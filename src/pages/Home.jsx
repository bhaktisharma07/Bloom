import React, { useState, useEffect } from 'react';
import { getStoredHabits, saveStoredHabits, STORAGE_KEY } from '../data/storage';

function Home() {
  const today = new Date().toLocaleDateString('en-CA');
  
  // Format human-readable date for sub-header (e.g. Tuesday, June 9)
  const formattedDate = new Date().toLocaleDateString('default', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric' 
  });

  // State
  const [habits, setHabits] = useState(() => getStoredHabits());
  const [showOnboarding, setShowOnboarding] = useState(() => {
    return !localStorage.getItem('bloom_onboarding_dismissed');
  });
  
  // Edit mode state
  const [isEditingList, setIsEditingList] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  // Initialize checklist completions state from localStorage
  const getInitialCompletedHabits = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed[today]) {
          return Array.isArray(parsed[today]) ? parsed[today] : [];
        }
      }
    } catch (e) {
      console.error("Error loading completed seeds:", e);
    }
    return [];
  };

  const [completedHabits, setCompletedHabits] = useState(getInitialCompletedHabits);

  // Sync completions state to localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const history = saved ? JSON.parse(saved) : {};
      history[today] = completedHabits;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch (e) {
      console.error("Error saving completed seeds:", e);
    }
  }, [completedHabits]);

  const toggleHabit = (id) => {
    setCompletedHabits(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Add Habit handler
  const handleAddHabitSubmit = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const newHabit = {
      id: 'habit-' + Date.now(),
      title: newTitle.trim()
    };
    const updated = [...habits, newHabit];
    setHabits(updated);
    saveStoredHabits(updated);
    setNewTitle('');
    setShowAddForm(false);
  };

  // Delete Habit handler
  const handleDeleteHabit = (id) => {
    const updated = habits.filter(h => h.id !== id);
    setHabits(updated);
    saveStoredHabits(updated);
    // Also remove from today's completed list
    setCompletedHabits(prev => prev.filter(item => item !== id));
  };

  // Edit Habit title handler
  const handleEditHabitTitle = (id, newText) => {
    const updated = habits.map(h => h.id === id ? { ...h, title: newText } : h);
    setHabits(updated);
    saveStoredHabits(updated);
  };

  // Dismiss onboarding
  const dismissOnboarding = () => {
    localStorage.setItem('bloom_onboarding_dismissed', 'true');
    setShowOnboarding(false);
  };

  const activeCompletions = completedHabits.filter(id => habits.some(h => h.id === id));
  const completedCount = activeCompletions.length;
  const totalCount = habits.length;
  const progressPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Weekly activity calculations (Mon-Sun)
  const getWeekDays = () => {
    const dayOfWeek = new Date().getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date();
    monday.setDate(monday.getDate() + mondayOffset);

    const weekdays = [];
    const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const history = saved ? JSON.parse(saved) : {};

      for (let i = 0; i < 7; i++) {
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        const dateStr = d.toLocaleDateString('en-CA');
        
        const completed = history[dateStr] || [];
        const isComplete = completed.length > 0;
        const isFuture = dateStr > today;

        weekdays.push({
          label: labels[i],
          dateStr,
          isComplete,
          isFuture,
          isToday: dateStr === today
        });
      }
    } catch (e) {
      console.error(e);
    }
    return weekdays;
  };

  const weekDays = getWeekDays();

  return (
    <div className="home-page-container">
      
      {/* 1. Onboarding Banner */}
      {showOnboarding && (
        <section className="cozy-card onboarding-banner-card" style={{ marginBottom: '24px' }}>
          <div className="onboarding-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3 className="onboarding-title" style={{ fontSize: '18px', fontWeight: '850', color: 'var(--text)' }}>Welcome to Bloom! 🌸</h3>
            <button className="onboarding-close-btn" onClick={dismissOnboarding} style={{ background: 'none', border: 'none', fontSize: '18px', color: 'var(--text-light)', cursor: 'pointer' }}>✕</button>
          </div>
          <p className="onboarding-text" style={{ fontSize: '14px', color: 'var(--text)', marginBottom: '16px', lineHeight: '1.5' }}>
            Bloom helps you build daily routines and visual consistency:
          </p>
          <ul className="onboarding-steps" style={{ listStyle: 'none', paddingLeft: 0, display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
            <li style={{ fontSize: '13.5px', color: 'var(--text-light)', position: 'relative', paddingLeft: '20px' }}>
              <span style={{ position: 'absolute', left: 0 }}>✓</span>
              <strong>Check off:</strong> Click habits on the checklist to log completions and watch your progress bar fill.
            </li>
            <li style={{ fontSize: '13.5px', color: 'var(--text-light)', position: 'relative', paddingLeft: '20px' }}>
              <span style={{ position: 'absolute', left: 0 }}>⚙</span>
              <strong>Customize:</strong> Use the buttons below the checklist to add new habits or edit/delete existing ones.
            </li>
            <li style={{ fontSize: '13.5px', color: 'var(--text-light)', position: 'relative', paddingLeft: '20px' }}>
              <span style={{ position: 'absolute', left: 0 }}>📈</span>
              <strong>Track:</strong> Open the Dashboard and Progress pages to see streaks and monthly consistency charts.
            </li>
          </ul>
          <button className="cozy-btn coral-pill onboarding-done-btn" onClick={dismissOnboarding} style={{ padding: '8px 20px', fontSize: '13px' }}>
            Got it, let's start!
          </button>
        </section>
      )}

      {/* Page Title Section */}
      <header className="page-title-section" style={{ marginBottom: '28px' }}>
        <span className="metadata-tag">{formattedDate}</span>
        <h1 className="page-heading">Today</h1>
      </header>

      {/* Grid Split Layout (70/30) */}
      <div className="today-split-layout">
        
        {/* Left Column: Habit List (70%) */}
        <div className="today-left-col">
          <section className="cozy-card checklist-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 className="section-title-tag">Habit List</h3>
              {isEditingList && (
                <button 
                  type="button" 
                  onClick={() => setIsEditingList(false)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-light)', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px' }}
                >
                  Close Manager
                </button>
              )}
            </div>

            {/* Dedicated Edit/Manage Mode */}
            {isEditingList ? (
              <div className="edit-habits-container" style={{ marginTop: '20px' }}>
                {habits.map(habit => (
                  <div key={habit.id} className="edit-habit-row" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <input 
                      type="text" 
                      value={habit.title} 
                      onChange={(e) => handleEditHabitTitle(habit.id, e.target.value)}
                      className="edit-habit-input"
                      style={{ flex: 1, padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(63, 61, 86, 0.15)', fontSize: '14px', color: 'var(--text)' }}
                    />
                    <button 
                      type="button" 
                      onClick={() => handleDeleteHabit(habit.id)}
                      className="delete-habit-btn"
                      style={{ padding: '10px 14px', backgroundColor: '#FFF0F5', color: '#FF7675', border: '1px solid rgba(255, 118, 117, 0.2)', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}
                    >
                      Delete
                    </button>
                  </div>
                ))}
                
                <div style={{ marginTop: '20px' }}>
                  <button 
                    type="button" 
                    onClick={() => setIsEditingList(false)}
                    className="cozy-btn coral-pill"
                    style={{ padding: '8px 20px', fontSize: '13px' }}
                  >
                    Done Editing
                  </button>
                </div>
              </div>
            ) : (
              /* Regular Checklist Mode */
              <>
                {habits.length === 0 ? (
                  <div className="empty-habits-state" style={{ textAlign: 'center', padding: '40px 16px' }}>
                    <p style={{ color: 'var(--text-light)', fontSize: '14px', marginBottom: '8px', fontWeight: '600' }}>
                      No habits configured yet.
                    </p>
                    <p style={{ color: 'var(--text-light)', fontSize: '13px' }}>
                      Click "+ Add Habit" below to create your first habit!
                    </p>
                  </div>
                ) : (
                  <div className="seed-list">
                    {habits.map(seed => {
                      const isCompleted = completedHabits.includes(seed.id);
                      return (
                        <div 
                          key={seed.id} 
                          className={`seed-item ${isCompleted ? 'completed' : ''}`}
                          onClick={() => toggleHabit(seed.id)}
                        >
                          <div className="seed-checkbox-wrapper">
                            <div className={`circle-checkbox-check ${isCompleted ? 'checked' : 'unchecked'}`}>
                              {isCompleted ? '✓' : ''}
                            </div>
                          </div>
                          <span className="seed-text">{seed.title}</span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Add Habit inline Form & Action Buttons */}
                {showAddForm ? (
                  <form onSubmit={handleAddHabitSubmit} className="add-habit-form" style={{ marginTop: '20px', display: 'flex', gap: '8px' }}>
                    <input 
                      type="text" 
                      placeholder="Add a new habit..." 
                      value={newTitle} 
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="add-habit-input"
                      style={{ flex: 1, padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(63, 61, 86, 0.15)', fontSize: '14px' }}
                      autoFocus
                    />
                    <button type="submit" className="cozy-btn coral-pill" style={{ padding: '10px 18px', fontSize: '13px' }}>Save</button>
                    <button type="button" onClick={() => setShowAddForm(false)} className="cozy-btn" style={{ padding: '10px 14px', fontSize: '13px', backgroundColor: 'transparent', border: '1px solid rgba(63, 61, 86, 0.1)' }}>Cancel</button>
                  </form>
                ) : (
                  <div className="checklist-actions-row" style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
                    <button 
                      type="button" 
                      onClick={() => setShowAddForm(true)}
                      className="cozy-btn coral-pill"
                      style={{ padding: '8px 16px', fontSize: '13px' }}
                    >
                      + Add Habit
                    </button>
                    {habits.length > 0 && (
                      <button 
                        type="button" 
                        onClick={() => setIsEditingList(true)}
                        className="cozy-btn"
                        style={{ padding: '8px 16px', fontSize: '13px', backgroundColor: 'transparent', border: '1px solid rgba(63, 61, 86, 0.15)' }}
                      >
                        Manage Habits
                      </button>
                    )}
                  </div>
                )}
              </>
            )}
          </section>
        </div>

        {/* Right Column: Progress + Weekly Activity (30%) */}
        <div className="today-right-col">
          {/* Progress Section */}
          <section className="cozy-card progress-bar-card" style={{ marginBottom: '24px' }}>
            <h3 className="section-title-tag" style={{ marginBottom: '16px' }}>Progress</h3>
            <div className="progress-summary-row">
              <p className="progress-status-text">
                {completedCount} of {totalCount} completed
              </p>
              <span className="progress-percent-label">{progressPercentage}%</span>
            </div>
            <div className="habit-progress-track">
              <div 
                className="habit-progress-fill" 
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </section>

          {/* Weekly Activity Section */}
          <section className="cozy-card weekly-activity-card">
            <h3 className="section-title-tag">Weekly Activity</h3>
            <div className="weekly-activity-row" style={{ marginTop: '20px' }}>
              {weekDays.map(day => (
                <div 
                  key={day.dateStr} 
                  className={`weekly-day-col ${day.isToday ? 'is-today' : ''}`}
                >
                  <div className={`weekly-dot ${day.isComplete ? 'completed' : day.isFuture ? 'future' : 'incomplete'}`}></div>
                  <span className="weekly-label">{day.label}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

      </div>

    </div>
  );
}

export default Home;
