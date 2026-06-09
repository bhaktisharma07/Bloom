import React, { useState } from 'react';
import { getStoredHabits, STORAGE_KEY } from '../data/storage';
import { BoltIconSVG } from '../components/SVGAssets';

function Progress() {
  // Load dynamic habits list
  const [habits] = useState(() => getStoredHabits());

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
        .filter(dateStr => {
          const completed = history[dateStr] || [];
          const activeCompleted = completed.filter(id => habits.some(h => h.id === id));
          return activeCompleted.length > 0;
        })
        .sort();
      
      if (dates.length === 0) return 0;
      
      let maxStreak = 0;
      let currentStreak = 0;
      let prevDate = null;
      
      for (const dStr of dates) {
        // Parse dateStr using calendar components to avoid UTC shift
        const parts = dStr.split('-');
        const current = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
        
        if (!prevDate) {
          currentStreak = 1;
        } else {
          // Check if current is exactly 1 day after prevDate
          const diffTime = current.getTime() - prevDate.getTime();
          const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
          
          if (diffDays === 1) {
            currentStreak++;
          } else if (diffDays > 1) {
            currentStreak = 1;
          }
        }
        
        prevDate = current;
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
        const activeCompleted = completed.filter(id => habits.some(h => h.id === id));
        if (activeCompleted.length > 0) {
          const parts = dateStr.split('-');
          const year = parts[0];
          const month = parseInt(parts[1], 10) - 1;
          const date = new Date(year, month, 1);
          const label = date.toLocaleString('default', { month: 'long', year: 'numeric' });
          months[label] = (months[label] || 0) + activeCompleted.length;
        }
      });
      const sorted = Object.keys(months).sort((a, b) => months[b] - months[a]);
      return sorted[0] || 'None yet';
    } catch (e) {
      return 'None yet';
    }
  };

  const totalCompletions = Object.values(history).reduce((acc, curr) => {
    if (!curr) return acc;
    const activeCompletionsCount = curr.filter(id => habits.some(h => h.id === id)).length;
    return acc + activeCompletionsCount;
  }, 0);

  const totalDaysTracked = Object.keys(history).length || 1;
  const completionRate = habits.length > 0 ? Math.round((totalCompletions / (totalDaysTracked * habits.length)) * 100) : 0;

  const longestStreak = getLongestStreak();
  const bestMonth = getBestMonth();

  // Top Habit calculation
  const getTopHabit = () => {
    try {
      if (habits.length === 0) return { title: 'None', percentage: 0 };
      
      const counts = {};
      habits.forEach(h => { counts[h.id] = 0; });
      const totalDays = Object.keys(history).length || 1;
      
      Object.keys(history).forEach(dateStr => {
        const completed = history[dateStr] || [];
        completed.forEach(id => {
          if (counts[id] !== undefined) {
            counts[id]++;
          }
        });
      });
      
      let bestId = habits[0].id;
      let maxCount = -1;
      
      Object.keys(counts).forEach(id => {
        if (counts[id] > maxCount) {
          maxCount = counts[id];
          bestId = id;
        }
      });
      
      const seed = habits.find(s => s.id === bestId);
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
        const activeCompleted = completed.filter(id => habits.some(h => h.id === id));
        completions += activeCompleted.length;
        loggedDays++;
        
        // Count weekday frequencies
        const d = new Date(dateStr.replace(/-/g, '/'));
        dayCounts[d.getDay()] += activeCompleted.length;
      }
    });
    
    const rate = (loggedDays > 0 && habits.length > 0) ? Math.round((completions / (loggedDays * habits.length)) * 100) : 0;
    
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

  // History list (reverse chronological order, filtered by active habits)
  const historyEntries = Object.keys(history)
    .filter(dateStr => {
      const completed = history[dateStr] || [];
      const activeCompleted = completed.filter(id => habits.some(h => h.id === id));
      return activeCompleted.length > 0;
    })
    .sort()
    .reverse();

  // Map habit IDs to titles
  const getSeedTitle = (id) => {
    const seed = habits.find(s => s.id === id);
    return seed ? seed.title : id;
  };

  // Export Data to JSON File
  const exportData = () => {
    try {
      const habitsData = localStorage.getItem('bloom_habits') || '[]';
      const historyData = localStorage.getItem(STORAGE_KEY) || '{}';
      
      const backup = {
        version: 'bloom-v1',
        habits: JSON.parse(habitsData),
        completions: JSON.parse(historyData)
      };
      
      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `bloom-backup-${new Date().toLocaleDateString('en-CA')}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (e) {
      alert("Failed to export backup: " + e.message);
    }
  };

  // Import Data from JSON File
  const importData = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const backup = JSON.parse(event.target.result);
        if (backup.version !== 'bloom-v1' || !Array.isArray(backup.habits) || typeof backup.completions !== 'object') {
          throw new Error("Invalid backup file format.");
        }
        
        localStorage.setItem('bloom_habits', JSON.stringify(backup.habits));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(backup.completions));
        
        alert("Data successfully restored!");
        window.location.reload();
      } catch (err) {
        alert("Restore failed: " + err.message);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="progress-page-container">
      
      {/* Page Header */}
      <header className="page-title-section" style={{ marginBottom: '24px' }}>
        <h1 className="page-heading">Progress</h1>
      </header>

      {/* Empty State warning if habits list is empty */}
      {habits.length === 0 && (
        <section className="cozy-card" style={{ marginBottom: '24px', textAlign: 'center', padding: '32px' }}>
          <h4 style={{ color: 'var(--text)', marginBottom: '8px', fontSize: '15px' }}>No habits configured.</h4>
          <p style={{ color: 'var(--text-light)', fontSize: '13px' }}>
            Add your habits on the Today page to track streaks, top habits, and monthly consistency.
          </p>
        </section>
      )}

      {/* Progress Split Layout (55/45) */}
      <div className="progress-split-layout">
        
        {/* Left Column (55%) */}
        <div className="progress-left-col">
          {/* 1. Core Metrics Grid */}
          <section className="cozy-card progress-metrics-card" style={{ marginBottom: '24px' }}>
            <h3 className="section-title-tag">Overview Metrics</h3>
            <div className="metrics-grid" style={{ marginTop: '20px' }}>
              
              <div className="metric-tile">
                <div className="metric-value-row">
                  <BoltIconSVG size={20} strokeColor="var(--pink)" />
                  <span className="metric-value">{longestStreak} Days</span>
                </div>
                <span className="metric-tag">Longest Streak</span>
              </div>

              <div className="metric-tile">
                <span className="metric-value" style={{ fontSize: '18px', display: 'block', marginTop: '4px' }}>
                  {bestMonth}
                </span>
                <span className="metric-tag">Best Month</span>
              </div>

              <div className="metric-tile">
                <span className="metric-value">{totalCompletions}</span>
                <span className="metric-tag">Total Completions</span>
              </div>

              <div className="metric-tile">
                <span className="metric-value">{completionRate}%</span>
                <span className="metric-tag">Completion Rate</span>
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
                  const activeList = completedList.filter(id => habits.some(h => h.id === id));
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
                        {activeList.map(seedId => (
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

        {/* Right Column (45%) */}
        <div className="progress-right-col">
          {/* 2. Top Habit Section (Progress Bar format) */}
          <section className="cozy-card top-habit-card" style={{ marginBottom: '24px' }}>
            <h3 className="section-title-tag">Top Habit</h3>
            <div className="top-habit-body" style={{ marginTop: '16px' }}>
              {habits.length === 0 ? (
                <p style={{ color: 'var(--text-light)', fontSize: '13px' }}>No habits configured.</p>
              ) : (
                <>
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
                </>
              )}
            </div>
          </section>

          {/* 3. This Month Summary */}
          <section className="cozy-card progress-stats-card">
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

          {/* 5. Data Management (Backup/Restore) */}
          <section className="cozy-card backup-card" style={{ marginTop: '24px' }}>
            <h3 className="section-title-tag">Data Backup</h3>
            <div className="backup-body" style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <p style={{ fontSize: '13px', color: 'var(--text-light)', lineHeight: '1.4' }}>
                Save your routine configuration and progress history as a local backup file, or restore from a previous export.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
                <button 
                  type="button" 
                  onClick={exportData}
                  className="cozy-btn coral-pill"
                  style={{ padding: '8px 16px', fontSize: '13px' }}
                >
                  Export Data
                </button>
                <label 
                  className="cozy-btn"
                  style={{ padding: '8px 16px', fontSize: '13px', backgroundColor: 'transparent', border: '1px solid rgba(63, 61, 86, 0.15)', cursor: 'pointer', display: 'inline-block', textAlign: 'center' }}
                >
                  Import Data
                  <input 
                    type="file" 
                    accept=".json" 
                    onChange={importData} 
                    style={{ display: 'none' }}
                  />
                </label>
              </div>
            </div>
          </section>
        </div>

      </div>

    </div>
  );
}

export default Progress;
