import React from 'react';
import { STORAGE_KEY } from '../data/storage';
import { DEFAULT_SEEDS } from '../data/seeds';
import { BoltIconSVG } from '../components/SVGAssets';

function Progress() {
  const todayStr = new Date().toLocaleDateString('en-CA');

  // Load history from localStorage
  const getHistory = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      console.error("Error reading history in Progress page:", e);
      return {};
    }
  };

  const history = getHistory();

  // Streak calculation (longest block of consecutive completed days)
  const getLongestStreak = () => {
    try {
      const dates = Object.keys(history)
        .filter(dateStr => history[dateStr] && history[dateStr].length > 0)
        .sort();
      
      if (dates.length === 0) return 0;
      
      let maxStreak = 0;
      let currentStreak = 0;
      let prevDate = null;
      
      for (const dStr of dates) {
        // Replace dashes with slashes for parsing to prevent UTC shifts
        const d = new Date(dStr.replace(/-/g, '/'));
        
        if (!prevDate) {
          currentStreak = 1;
        } else {
          const diffTime = Math.abs(d - prevDate);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          if (diffDays === 1) {
            currentStreak++;
          } else if (diffDays > 1) {
            currentStreak = 1;
          }
        }
        
        prevDate = d;
        if (currentStreak > maxStreak) {
          maxStreak = currentStreak;
        }
      }
      return maxStreak;
    } catch (e) {
      console.error("Error calculating longest streak:", e);
      return 0;
    }
  };

  // Best Month calculation (month with highest completion counts)
  const getBestMonth = () => {
    try {
      const months = {};
      Object.keys(history).forEach(dateStr => {
        const completed = history[dateStr] || [];
        if (completed.length > 0) {
          // parse YYYY-MM-DD
          const parts = dateStr.split('-');
          const year = parts[0];
          const month = parseInt(parts[1], 10) - 1;
          const date = new Date(year, month, 1);
          const label = date.toLocaleString('default', { month: 'long', year: 'numeric' });
          months[label] = (months[label] || 0) + completed.length;
        }
      });
      const sorted = Object.keys(months).sort((a, b) => months[b] - months[a]);
      return sorted[0] || 'None yet';
    } catch (e) {
      return 'None yet';
    }
  };

  const totalCompletions = Object.values(history).reduce((acc, curr) => acc + (curr ? curr.length : 0), 0);
  const totalDaysTracked = Object.keys(history).length || 1;
  const completionRate = Math.round((totalCompletions / (totalDaysTracked * DEFAULT_SEEDS.length)) * 100) || 0;

  const longestStreak = getLongestStreak();
  const bestMonth = getBestMonth();

  // Top Habit calculation
  const getTopHabit = () => {
    try {
      const counts = { water: 0, study: 0, code: 0, journal: 0 };
      const totalDays = Object.keys(history).length || 1;
      
      Object.keys(history).forEach(dateStr => {
        const completed = history[dateStr] || [];
        completed.forEach(id => {
          if (counts[id] !== undefined) {
            counts[id]++;
          }
        });
      });
      
      let bestId = 'water';
      let maxCount = -1;
      
      Object.keys(counts).forEach(id => {
        if (counts[id] > maxCount) {
          maxCount = counts[id];
          bestId = id;
        }
      });
      
      const seed = DEFAULT_SEEDS.find(s => s.id === bestId);
      const title = seed ? seed.title : 'None';
      const percentage = Math.round((maxCount / totalDays) * 100) || 0;
      
      return {
        title,
        percentage
      };
    } catch (e) {
      return { title: 'None', percentage: 0 };
    }
  };

  const topHabit = getTopHabit();

  // This Month calculations
  const getThisMonthStats = () => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    
    let completions = 0;
    let loggedDays = 0;
    const dayCounts = [0, 0, 0, 0, 0, 0, 0]; // 0: Sun, 1: Mon, ...
    
    Object.keys(history).forEach(dateStr => {
      const parts = dateStr.split('-');
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      
      if (year === currentYear && month === currentMonth) {
        const completed = history[dateStr] || [];
        completions += completed.length;
        loggedDays++;
        
        // Count weekday frequencies
        const d = new Date(dateStr.replace(/-/g, '/'));
        dayCounts[d.getDay()] += completed.length;
      }
    });
    
    const rate = loggedDays > 0 ? Math.round((completions / (loggedDays * DEFAULT_SEEDS.length)) * 100) : 0;
    
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let maxIndex = 1; // Default Mon
    let maxVal = 0;
    for (let i = 0; i < 7; i++) {
      if (dayCounts[i] > maxVal) {
        maxVal = dayCounts[i];
        maxIndex = i;
      }
    }
    
    return {
      rate,
      total: completions,
      bestDay: maxVal > 0 ? dayNames[maxIndex] : 'None yet'
    };
  };

  const thisMonth = getThisMonthStats();

  // History list (reverse chronological order)
  const historyEntries = Object.keys(history)
    .filter(dateStr => history[dateStr] && history[dateStr].length > 0)
    .sort()
    .reverse();

  // Map seed IDs to titles
  const getSeedTitle = (id) => {
    const seed = DEFAULT_SEEDS.find(s => s.id === id);
    return seed ? seed.title : id;
  };

  return (
    <div className="progress-page-container">
      
      {/* Page Header */}
      <header className="page-title-section" style={{ marginBottom: '24px' }}>
        <h1 className="page-heading">Progress</h1>
      </header>

      {/* 1. Core Metrics Grid */}
      <section className="cozy-card progress-metrics-card" style={{ marginBottom: '24px' }}>
        <h3 className="section-title-tag">Overview Metrics</h3>
        <div className="metrics-grid" style={{ marginTop: '20px' }}>
          
          <div className="metric-tile">
            <span className="metric-tag">Longest Streak</span>
            <div className="metric-value-row">
              <BoltIconSVG size={20} strokeColor="var(--pink)" />
              <span className="metric-value">{longestStreak} Days</span>
            </div>
          </div>

          <div className="metric-tile">
            <span className="metric-tag">Best Month</span>
            <span className="metric-value" style={{ fontSize: '18px', display: 'block', marginTop: '6px' }}>
              {bestMonth}
            </span>
          </div>

          <div className="metric-tile">
            <span className="metric-tag">Total Completions</span>
            <span className="metric-value">{totalCompletions}</span>
          </div>

          <div className="metric-tile">
            <span className="metric-tag">Completion Rate</span>
            <span className="metric-value">{completionRate}%</span>
          </div>

        </div>
      </section>

      {/* 2. Top Habit Section (Progress Bar format) */}
      <section className="cozy-card top-habit-card" style={{ marginBottom: '24px' }}>
        <h3 className="section-title-tag">Top Habit</h3>
        <div className="top-habit-body" style={{ marginTop: '16px' }}>
          <div className="top-habit-meta">
            <span className="top-habit-name">{topHabit.title}</span>
            <span className="top-habit-percent">{topHabit.percentage}% consistent</span>
          </div>
          <div className="top-habit-progress-bg">
            <div 
              className="top-habit-progress-fill" 
              style={{ width: `${topHabit.percentage}%` }}
            ></div>
          </div>
        </div>
      </section>

      {/* 3. This Month Summary */}
      <section className="cozy-card progress-stats-card" style={{ marginBottom: '24px' }}>
        <h3 className="section-title-tag">This Month</h3>
        <div className="month-stats-grid" style={{ marginTop: '20px' }}>
          <div className="month-stat-item">
            <span className="month-stat-num">{thisMonth.rate}%</span>
            <span className="month-stat-label">Completion Rate</span>
          </div>
          <div className="month-stat-item">
            <span className="month-stat-num">{thisMonth.total}</span>
            <span className="month-stat-label">Total Habits Done</span>
          </div>
          <div className="month-stat-item">
            <span className="month-stat-num" style={{ fontSize: '18px' }}>{thisMonth.bestDay}</span>
            <span className="month-stat-label">Best Weekday</span>
          </div>
        </div>
      </section>

      {/* 4. Timeline Journal History */}
      <section className="cozy-card history-card">
        <h3 className="section-title-tag">Journal History</h3>
        
        {historyEntries.length === 0 ? (
          <p className="subtitle" style={{ textAlign: 'center', padding: '24px 0', marginTop: '16px' }}>
            No logged history yet. Start checking habits on the Today page!
          </p>
        ) : (
          <div className="history-timeline" style={{ marginTop: '24px' }}>
            {historyEntries.map(dateStr => {
              const completedList = history[dateStr] || [];
              const formattedDate = new Date(dateStr.replace(/-/g, '/')).toLocaleDateString('default', { 
                weekday: 'short', 
                month: 'short', 
                day: 'numeric' 
              });
              
              return (
                <div key={dateStr} className="history-timeline-item">
                  <div className="history-time-node">
                    <span className="timeline-date-label">{formattedDate}</span>
                  </div>
                  <div className="history-timeline-connector">
                    <div className="timeline-node-circle"></div>
                    <div className="timeline-connector-line"></div>
                  </div>
                  <div className="history-pill-list">
                    {completedList.map(seedId => (
                      <span key={seedId} className="history-habit-pill">
                        {getSeedTitle(seedId)}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

    </div>
  );
}

export default Progress;
