import React, { useState, useEffect } from 'react';
import { SproutSVG, SunCloudSVG, CheckIconSVG } from '../components/SVGAssets';
import { DEFAULT_SEEDS } from '../data/seeds';

const STORAGE_KEY = 'bloom_completed_seeds';

function Home() {
  // Initialize state from localStorage using today's date
  const getInitialCheckedSeeds = () => {
    const today = new Date().toISOString().split('T')[0];
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

  // Sync state to localStorage whenever checked seeds toggle
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
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

  return (
    <div className="home-page-container">
      
      {/* Greeting Card */}
      <section className="cozy-card greeting-card">
        <div className="greeting-content">
          <h2 className="greeting-title">Ready to bloom today? ✨</h2>
          <p className="greeting-text">
            Welcome to a new day. Let's tend to our garden and water our seeds one step at a time.
          </p>
        </div>
        <div className="greeting-illustration">
          <SunCloudSVG />
        </div>
      </section>

      {/* Today's Seeds Checklist Card */}
      <section className="cozy-card seeds-card">
        <div className="seeds-header">
          <div>
            <h2>Today's Seeds</h2>
            <p className="subtitle">
              {completedCount === DEFAULT_SEEDS.length 
                ? "All seeds watered! Your garden is happy 🌸✨" 
                : `Watered ${completedCount} of ${DEFAULT_SEEDS.length} seeds today`}
            </p>
          </div>
          <div className="seeds-badge">
            <div className="seeds-badge-sprout">
              <SproutSVG />
            </div>
          </div>
        </div>

        <div className="seed-list">
          {DEFAULT_SEEDS.map(seed => {
            const isCompleted = checkedSeeds[seed.id];
            return (
              <div 
                key={seed.id} 
                className={`seed-item ${isCompleted ? 'completed' : ''}`}
                onClick={() => toggleSeed(seed.id)}
              >
                <div className="seed-checkbox-wrapper">
                  <div className="seed-checkmark">
                    {isCompleted && <CheckIconSVG />}
                  </div>
                </div>
                <span className="seed-text">{seed.title}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Decorative Tips Card */}
      <section className="cozy-card tips-card">
        <h3>Bloom Message of the Day 🌷</h3>
        <p>
          Be patient with yourself. Just like real flowers, habits take time to grow and bloom. Take a deep breath.
        </p>
      </section>

    </div>
  );
}

export default Home;
