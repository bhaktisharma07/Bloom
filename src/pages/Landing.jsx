import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  HeartSVG,
  TodayIconSVG,
  BoltIconSVG
} from '../components/SVGAssets';

function Landing() {
  // 1. Interactive Checklist Mockup State
  const [mockHabits, setMockHabits] = useState([
    { id: 'workout', title: 'Workout', checked: true },
    { id: 'read', title: 'Read', checked: true },
    { id: 'journal', title: 'Journal', checked: false },
    { id: 'sleep', title: 'Sleep Early', checked: false },
  ]);

  const toggleMockHabit = (id) => {
    setMockHabits(prev => prev.map(h => h.id === id ? { ...h, checked: !h.checked } : h));
  };

  const completedCount = mockHabits.filter(h => h.checked).length;
  const totalCount = mockHabits.length;
  const progressPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // 2. Interactive Weekly Consistency State
  const [mockWeekly, setMockWeekly] = useState([
    { day: 'Mon', completed: true },
    { day: 'Tue', completed: true },
    { day: 'Wed', completed: false },
    { day: 'Thu', completed: true },
    { day: 'Fri', completed: true },
    { day: 'Sat', completed: false },
    { day: 'Sun', completed: false },
  ]);

  const toggleMockWeekly = (index) => {
    setMockWeekly(prev => prev.map((item, idx) => idx === index ? { ...item, completed: !item.completed } : item));
  };

  const activeDaysCount = mockWeekly.filter(w => w.completed).length;

  return (
    <div className="landing-page-wrapper">
      
      {/* 1. Asymmetric Hero Section Layout */}
      <div className="hero-grid-wrapper">
        
        {/* Left Side: Copywriting & Action */}
        <section className="hero-text-side">
          <h1 className="hero-title">Build habits that last.</h1>
          <p className="hero-description">
            A minimalist habit tracker for building consistency.
          </p>
          <Link to="/home" className="cozy-btn coral-pill">
            Start Tracking
          </Link>
        </section>

        {/* Right Side: Interactive Today Checklist Mockup Card */}
        <section className="hero-mockup-side">
          <div className="landing-mockup-card-checklist">
            
            {/* Window controls header bar */}
            <div className="mockup-header-row">
              <div className="mockup-dot-controls">
                <span className="dot red"></span>
                <span className="dot yellow"></span>
                <span className="dot green"></span>
              </div>
              <span className="mockup-title-text">bloom-today</span>
            </div>

            {/* Checklist Card Contents */}
            <div className="mockup-content">
              <h4 className="mockup-card-title">Today</h4>
              <p className="mockup-card-subtitle">{completedCount} of {totalCount} habits completed</p>

              <div className="mockup-checklist-items">
                {mockHabits.map(habit => (
                  <div 
                    key={habit.id} 
                    className={`mockup-item interactive ${habit.checked ? 'checked' : ''}`}
                    onClick={() => toggleMockHabit(habit.id)}
                  >
                    <span className="mockup-icon checked">
                      {habit.checked ? '✓' : <span className="mockup-icon circle"></span>}
                    </span>
                    <span className="mockup-text">{habit.title}</span>
                  </div>
                ))}
              </div>

              {/* Progress bar fill */}
              <div className="mockup-progress-bar-container">
                <div className="mockup-progress-bar-fill" style={{ width: `${progressPercentage}%` }}></div>
              </div>
              <div className="mockup-progress-text">{progressPercentage}%</div>

            </div>
          </div>
        </section>

      </div>

      {/* 2. Why Bloom Section (Asymmetric Grid Layout) */}
      <section className="features-container">
        <h2 className="features-title">Why Bloom?</h2>
        
        <div className="features-list">
          
          {/* Card 1: Large Stay Consistent Card with Mini Today Mockup */}
          <div className="cozy-card feature-card large-card card-tint-cream">
            <div className="large-card-info">
              <div className="feature-illustration">
                <TodayIconSVG size={26} strokeColor="var(--text)" />
              </div>
              <div className="feature-info">
                <h3>Stay Consistent</h3>
                <p>Never lose track of daily habits.</p>
              </div>
            </div>
            
            {/* Tiny Product Mockup representing the Today screen checklist */}
            <div className="mini-today-card-mockup">
              <h5 className="mini-today-title">Today</h5>
              <div className="mini-today-items">
                <div className="mini-item checked">
                  <span className="mini-icon checked">✓</span>
                  <span>Workout</span>
                </div>
                <div className="mini-item checked">
                  <span className="mini-icon checked">✓</span>
                  <span>Read</span>
                </div>
                <div className="mini-item">
                  <span className="mini-icon circle">○</span>
                  <span>Journal</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Small See Progress Card */}
          <div className="cozy-card feature-card card-tint-pink">
            <div className="feature-illustration">
              <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="var(--text)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block' }}>
                <line x1="18" y1="20" x2="18" y2="10" />
                <line x1="12" y1="20" x2="12" y2="4" />
                <line x1="6" y1="20" x2="6" y2="14" />
              </svg>
            </div>
            <div className="feature-info">
              <h3>See Progress</h3>
              <p>Watch your completion rate improve over time.</p>
            </div>
          </div>

          {/* Card 3: Small Build Routines Card */}
          <div className="cozy-card feature-card card-tint-lavender">
            <div className="feature-illustration">
              <BoltIconSVG size={26} strokeColor="var(--text)" />
            </div>
            <div className="feature-info">
              <h3>Build Routines</h3>
              <p>Small actions compound into long-term results.</p>
            </div>
          </div>

        </div>
      </section>

      {/* 3. Weekly Consistency Card Section (Pure Visual Product Representation) */}
      <section className="weekly-consistency-section" style={{ marginBottom: '80px' }}>
        <div className="cozy-card weekly-consistency-card-preview">
          <h3 className="weekly-consistency-title">Weekly Consistency</h3>
          
          <div className="weekly-consistency-grid-layout">
            <div className="weekly-header-row">
              {mockWeekly.map(w => (
                <span key={w.day}>{w.day}</span>
              ))}
            </div>
            <div className="weekly-dots-row">
              {mockWeekly.map((w, idx) => (
                <span 
                  key={w.day} 
                  className={`weekly-dot interactive ${w.completed ? 'completed' : 'incomplete'}`}
                  onClick={() => toggleMockWeekly(idx)}
                >
                  {w.completed ? '●' : '○'}
                </span>
              ))}
            </div>
          </div>
          
          <div className="weekly-consistency-footer">
            <span>{activeDaysCount}/7 active days</span>
          </div>
        </div>
      </section>

      {/* 4. Footer */}
      <footer className="footer">
        <div className="footer-brand" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>Bloom</span>
        </div>
        <p className="footer-copy">
          Made with <HeartSVG /> for your growth.
        </p>
      </footer>
    </div>
  );
}

export default Landing;
