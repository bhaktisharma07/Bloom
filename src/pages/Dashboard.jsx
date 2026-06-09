import React, { useState } from 'react';
import { getStoredHabits, STORAGE_KEY } from '../data/storage';
import { BoltIconSVG } from '../components/SVGAssets';

function Dashboard() {
  const todayStr = new Date().toLocaleDateString('en-CA');

  // Load dynamic habits list
  const [habits] = useState(() => getStoredHabits());

  // Load history from localStorage
  const getHistory = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      console.error("Error reading history in Dashboard:", e);
      return {};
    }
  };

  const history = getHistory();
  const todayCompleted = history[todayStr] || [];
  const completedCount = todayCompleted.filter(id => habits.some(h => h.id === id)).length;
  const totalCount = habits.length;
  const progressPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Timezone-safe and Calendar-day-based Streak Calculation (filtering deleted habits)
  const getStreak = () => {
    try {
      const dates = Object.keys(history)
        .filter(dateStr => {
          const completed = history[dateStr] || [];
          const activeCompleted = completed.filter(id => habits.some(h => h.id === id));
          return activeCompleted.length > 0;
        })
        .sort();
      
      if (dates.length === 0) return 0;
      
      const today = new Date();
      const todayStr = today.toLocaleDateString('en-CA');
      
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toLocaleDateString('en-CA');
      
      const hasCompletedToday = history[todayStr] && history[todayStr].filter(id => habits.some(h => h.id === id)).length > 0;
      const hasCompletedYesterday = history[yesterdayStr] && history[yesterdayStr].filter(id => habits.some(h => h.id === id)).length > 0;
      
      if (!hasCompletedToday && !hasCompletedYesterday) {
        return 0;
      }
      
      let streak = 0;
      let checkDate = hasCompletedToday ? today : yesterday;
      
      while (true) {
        const checkStr = checkDate.toLocaleDateString('en-CA');
        const completed = history[checkStr] || [];
        const activeCompleted = completed.filter(id => habits.some(h => h.id === id));
        
        if (activeCompleted.length > 0) {
          streak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }
      return streak;
    } catch (e) {
      return 0;
    }
  };

  const streakCount = getStreak();

  // Weekly Performance values (Mon to Sun) - shows completion percentage of ACTIVE habits per day
  const getWeeklyCompletions = () => {
    const dayOfWeek = new Date().getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date();
    monday.setDate(monday.getDate() + mondayOffset);

    const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const habitsCount = habits.length;

    return labels.map((label, idx) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + idx);
      const dateStr = d.toLocaleDateString('en-CA');
      
      const completed = history[dateStr] || [];
      const activeCompleted = completed.filter(id => habits.some(h => h.id === id));
      
      // Calculate simple completion percentage based on current active habits
      const pct = habitsCount > 0 ? Math.round((activeCompleted.length / habitsCount) * 100) : 0;
      // Proportional height (max 80px)
      const height = Math.round((pct / 100) * 80);

      return {
        label,
        value: `${pct}%`,
        height: Math.max(height, 2) // minimum height so a thin line is visible if 0%
      };
    });
  };

  const weeklyData = getWeeklyCompletions();

  // Aligned Monthly Activity Calendar Grid
  const getMonthGrid = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const totalDays = new Date(year, month + 1, 0).getDate();
    
    const firstDay = new Date(year, month, 1).getDay();
    const startOffset = firstDay === 0 ? 6 : firstDay - 1;

    const grid = [];
    for (let i = 0; i < startOffset; i++) {
      grid.push({ type: 'empty', id: `empty-${i}` });
    }
    
    for (let i = 1; i <= totalDays; i++) {
      const date = new Date(year, month, i);
      const dateStr = date.toLocaleDateString('en-CA');
      
      let status = 'future';
      if (dateStr <= todayStr) {
        const completed = history[dateStr] || [];
        const activeCompleted = completed.filter(id => habits.some(h => h.id === id));
        status = activeCompleted.length > 0 ? 'completed' : 'incomplete';
      }
      
      grid.push({
        type: 'day',
        dayNum: i,
        dateStr,
        status,
        id: `day-${i}`
      });
    }
    return grid;
  };

  const monthGrid = getMonthGrid();
  const currentMonthName = new Date().toLocaleString('default', { month: 'long' }).toUpperCase();

  // SVG progress ring variables (150px diameter layout)
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercentage / 100) * circumference;

  return (
    <div className="dashboard-page-container">
      
      {/* Page Header */}
      <header className="page-title-section" style={{ marginBottom: '28px' }}>
        <h1 className="page-heading">Dashboard</h1>
      </header>

      {/* Empty State warning if habits list is empty */}
      {habits.length === 0 && (
        <section className="cozy-card" style={{ marginBottom: '24px', textAlign: 'center', padding: '32px' }}>
          <h4 style={{ color: 'var(--text)', marginBottom: '8px', fontSize: '15px' }}>No habits configured.</h4>
          <p style={{ color: 'var(--text-light)', fontSize: '13px' }}>
            Go to the Today checklist screen to add your habits and begin generating dashboard statistics!
          </p>
        </section>
      )}

      {/* 1. Overview Grid Row */}
      <div className="dashboard-grid-overview" style={{ marginBottom: '24px' }}>
        
        {/* Habit Health Card */}
        <div className="cozy-card dashboard-overview-card card-health">
          <h3 className="section-title-tag">Habit Health</h3>
          <div className="health-ring-wrapper" style={{ marginTop: '20px' }}>
            <div className="progress-ring-container-dashboard">
              <svg className="progress-ring-svg" width="150" height="150" viewBox="0 0 150 150">
                <circle
                  className="progress-ring-track"
                  stroke="rgba(63, 61, 86, 0.05)"
                  strokeWidth="10"
                  fill="transparent"
                  r={radius}
                  cx="75"
                  cy="75"
                />
                <circle
                  className="progress-ring-bar"
                  stroke="var(--pink)"
                  strokeWidth="10"
                  fill="transparent"
                  r={radius}
                  cx="75"
                  cy="75"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  transform="rotate(-90 75 75)"
                />
              </svg>
              <div className="progress-ring-percentage-text">{progressPercentage}%</div>
            </div>
            <p className="overview-subtext" style={{ marginTop: '16px' }}>
              {completedCount} of {totalCount} habits completed today
            </p>
          </div>
        </div>

        {/* Current Streak Card */}
        <div className="cozy-card dashboard-overview-card card-streak">
          <h3 className="section-title-tag">Current Streak</h3>
          <div className="streak-content-wrapper" style={{ marginTop: '24px' }}>
            <div className="streak-display-row">
              <span className="streak-bold-value">{streakCount} Days</span>
              <div className="streak-badge-icon">
                <BoltIconSVG size={24} strokeColor="var(--pink)" />
              </div>
            </div>
            <p className="overview-subtext" style={{ marginTop: '16px' }}>
              Consecutive completion days
            </p>
          </div>
        </div>

      </div>

      {/* 2. Split Charts Row (Weekly on Left, Monthly on Right) */}
      <div className="dashboard-split-layout">
        
        {/* Weekly Performance */}
        <div className="dashboard-charts-left-col">
          <section className="cozy-card dashboard-weekly-chart-card">
            <h3 className="section-title-tag">Weekly Performance</h3>
            <div className="weekly-chart-canvas" style={{ marginTop: '28px' }}>
              {weeklyData.map(week => (
                <div key={week.label} className="weekly-chart-col">
                  <span className="chart-col-value">{week.value}</span>
                  <div 
                    className="chart-col-fill-bar" 
                    style={{ height: `${week.height}px`, backgroundColor: 'var(--lavender)' }}
                  ></div>
                  <span className="chart-col-label">{week.label}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Monthly Activity */}
        <div className="dashboard-charts-right-col">
          <section className="cozy-card dashboard-calendar-grid-card">
            <h3 className="section-title-tag">{currentMonthName} ACTIVITY</h3>
            <div className="monthly-activity-canvas" style={{ marginTop: '24px' }}>
              
              {/* Calendar Weekday Labels */}
              <div className="calendar-weekdays-row" style={{ marginBottom: '12px' }}>
                <span>M</span>
                <span>T</span>
                <span>W</span>
                <span>T</span>
                <span>F</span>
                <span>S</span>
                <span>S</span>
              </div>

              {/* Dots Grid */}
              <div className="calendar-dots-grid">
                {monthGrid.map(cell => {
                  if (cell.type === 'empty') {
                    return <div key={cell.id} className="activity-dot-item empty-cell"></div>;
                  }
                  return (
                    <div 
                      key={cell.id} 
                      className={`activity-dot-item ${cell.status}`}
                      title={`${cell.dateStr}: ${cell.status === 'completed' ? 'Done' : 'Missed'}`}
                    ></div>
                  );
                })}
              </div>

            </div>
          </section>
        </div>

      </div>

    </div>
  );
}

export default Dashboard;
