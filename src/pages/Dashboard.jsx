import React from 'react';
import { DEFAULT_SEEDS } from '../data/seeds';
import { STORAGE_KEY } from '../data/storage';
import { BoltIconSVG } from '../components/SVGAssets';

function Dashboard() {
  const todayStr = new Date().toLocaleDateString('en-CA');

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
  const completedCount = todayCompleted.length;
  const totalCount = DEFAULT_SEEDS.length;
  const progressPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Streak Calculation
  const getStreak = () => {
    try {
      let streak = 0;
      let checkDate = new Date();
      
      while (true) {
        const dateStr = checkDate.toLocaleDateString('en-CA');
        const completed = history[dateStr] || [];
        
        if (completed.length > 0) {
          streak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          // If we haven't completed any habits today yet, the streak is still alive if yesterday was complete
          if (streak === 0 && dateStr === todayStr) {
            checkDate.setDate(checkDate.getDate() - 1);
            continue;
          }
          break;
        }
      }
      return streak;
    } catch (e) {
      return 0;
    }
  };

  const streakCount = getStreak();

  // Weekly Performance values (Week 1 to Week 4)
  const getWeeklyCompletions = () => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();

    const weekSums = [0, 0, 0, 0]; // W1, W2, W3, W4 sums
    
    Object.keys(history).forEach(dateStr => {
      const parts = dateStr.split('-');
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);

      if (year === currentYear && month === currentMonth) {
        const completed = history[dateStr] || [];
        
        // Distribute days roughly into 4 weeks
        if (day <= 7) weekSums[0] += completed.length;
        else if (day <= 14) weekSums[1] += completed.length;
        else if (day <= 21) weekSums[2] += completed.length;
        else weekSums[3] += completed.length;
      }
    });

    // Proportional height calculations (max height 80px)
    const maxVal = Math.max(...weekSums) || 1;
    return weekSums.map((val, idx) => {
      const height = Math.round((val / maxVal) * 80);
      return {
        label: `Week ${idx + 1}`,
        value: val,
        height: Math.max(height, 8) // Ensure a minimum visible height of 8px
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
        status = completed.length > 0 ? 'completed' : 'incomplete';
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

  // SVG progress ring variables
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercentage / 100) * circumference;

  return (
    <div className="dashboard-page-container">
      
      {/* Page Header */}
      <header className="page-title-section" style={{ marginBottom: '24px' }}>
        <h1 className="page-heading">Dashboard</h1>
      </header>

      {/* 1. Overview Row (Habit Health Ring + Current Streak) */}
      <div className="dashboard-grid-overview" style={{ marginBottom: '24px' }}>
        
        {/* Habit Health Card */}
        <div className="cozy-card dashboard-overview-card card-health">
          <h3 className="section-title-tag">Habit Health</h3>
          <div className="health-ring-wrapper" style={{ marginTop: '16px' }}>
            <div className="progress-ring-container-dashboard">
              <svg className="progress-ring-svg" width="80" height="80" viewBox="0 0 80 80">
                <circle
                  className="progress-ring-track"
                  stroke="rgba(63, 61, 86, 0.05)"
                  strokeWidth="6"
                  fill="transparent"
                  r={radius}
                  cx="40"
                  cy="40"
                />
                <circle
                  className="progress-ring-bar"
                  stroke="var(--pink)"
                  strokeWidth="6"
                  fill="transparent"
                  r={radius}
                  cx="40"
                  cy="40"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  transform="rotate(-90 40 40)"
                />
              </svg>
              <div className="progress-ring-percentage-text">{progressPercentage}%</div>
            </div>
            <p className="overview-subtext">
              {completedCount} of {totalCount} habits completed today
            </p>
          </div>
        </div>

        {/* Current Streak Card */}
        <div className="cozy-card dashboard-overview-card card-streak">
          <h3 className="section-title-tag">Current Streak</h3>
          <div className="streak-content-wrapper" style={{ marginTop: '16px' }}>
            <div className="streak-display-row">
              <div className="streak-badge-icon">
                <BoltIconSVG size={24} strokeColor="var(--pink)" />
              </div>
              <span className="streak-bold-value">{streakCount} Days</span>
            </div>
            <p className="overview-subtext" style={{ marginTop: '12px' }}>
              Consecutive completion days
            </p>
          </div>
        </div>

      </div>

      {/* 2. Weekly Performance Chart (Separate Card) */}
      <section className="cozy-card dashboard-weekly-chart-card" style={{ marginBottom: '24px' }}>
        <h3 className="section-title-tag">Weekly Performance</h3>
        <div className="weekly-chart-canvas" style={{ marginTop: '24px' }}>
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

      {/* 3. Monthly Activity Grid (Separate Card) */}
      <section className="cozy-card dashboard-calendar-grid-card">
        <h3 className="section-title-tag">{currentMonthName} ACTIVITY</h3>
        <div className="monthly-activity-canvas" style={{ marginTop: '24px' }}>
          
          {/* Calendar Weekday Labels */}
          <div className="calendar-weekdays-row">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
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
  );
}

export default Dashboard;
