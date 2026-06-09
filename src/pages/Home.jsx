import React, { useState, useEffect } from 'react';
import { DEFAULT_SEEDS } from '../data/seeds';
import { STORAGE_KEY } from '../data/storage';

function Home() {
  const today = new Date().toLocaleDateString('en-CA');
  
  // Format human-readable date for sub-header (e.g. Tuesday, June 9)
  const formattedDate = new Date().toLocaleDateString('default', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric' 
  });

  // Initialize checklist state from localStorage
  const getInitialCheckedSeeds = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed[today]) {
          return {
            water: parsed[today].includes('water'),
            study: parsed[today].includes('study'),
            code: parsed[today].includes('code'),
            journal: parsed[today].includes('journal')
          };
        }
      }
    } catch (e) {
      console.error("Error loading completed seeds:", e);
    }
    return {
      water: false,
      study: false,
      code: false,
      journal: false
    };
  };

  const [checkedSeeds, setCheckedSeeds] = useState(getInitialCheckedSeeds);

  // Sync state to localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const history = saved ? JSON.parse(saved) : {};
      
      const checkedIds = Object.keys(checkedSeeds).filter(key => checkedSeeds[key]);
      history[today] = checkedIds;
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch (e) {
      console.error("Error saving completed seeds:", e);
    }
  }, [checkedSeeds]);

  const toggleSeed = (id) => {
    setCheckedSeeds(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const completedCount = Object.values(checkedSeeds).filter(Boolean).length;
  const totalCount = DEFAULT_SEEDS.length;
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
      
      {/* 1. Header Section */}
      <header className="page-title-section" style={{ marginBottom: '24px' }}>
        <span className="metadata-tag">{formattedDate}</span>
        <h1 className="page-heading">Today</h1>
      </header>

      {/* 2. Progress Section */}
      <section className="cozy-card progress-bar-card" style={{ marginBottom: '24px' }}>
        <div className="progress-summary-row">
          <p className="progress-status-text">
            {completedCount} of {totalCount} habits completed &bull; {progressPercentage}% complete
          </p>
        </div>
        <div className="habit-progress-track">
          <div 
            className="habit-progress-fill" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </section>

      {/* 3. Habit List Section */}
      <section className="cozy-card checklist-card" style={{ marginBottom: '24px' }}>
        <h3 className="section-title-tag">Habit List</h3>
        <div className="seed-list" style={{ marginTop: '16px' }}>
          {DEFAULT_SEEDS.map(seed => {
            const isCompleted = checkedSeeds[seed.id];
            return (
              <div 
                key={seed.id} 
                className={`seed-item ${isCompleted ? 'completed' : ''}`}
                onClick={() => toggleSeed(seed.id)}
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
      </section>

      {/* 4. Weekly Activity Section */}
      <section className="cozy-card weekly-activity-card">
        <h3 className="section-title-tag">Weekly Activity</h3>
        <div className="weekly-activity-row" style={{ marginTop: '16px' }}>
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
  );
}

export default Home;
