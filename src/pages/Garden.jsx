import React from 'react';
import { DEFAULT_SEEDS } from '../data/seeds';
import { STORAGE_KEY } from '../data/storage';
import { 
  SproutSVG, 
  DaisySVG, 
  TulipSVG, 
  LavenderSVG, 
  RoseSVG 
} from '../components/SVGAssets';

function Garden() {
  const today = new Date().toLocaleDateString('en-CA');
  
  // Read completed seeds for today from localStorage
  const getCompletedSeeds = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed[today]) {
          return parsed[today];
        }
      }
    } catch (e) {
      console.error("Error reading completed seeds in Garden:", e);
    }
    return [];
  };

  const completedIds = getCompletedSeeds();
  const completedCount = completedIds.length;

  // Helper to render flower or sprout
  const renderPlant = (seedId) => {
    const isCompleted = completedIds.includes(seedId);
    if (!isCompleted) {
      return (
        <div className="sleeping-sprout">
          <SproutSVG />
        </div>
      );
    }
    switch (seedId) {
      case 'water':
        return (
          <div className="swaying-flower">
            <DaisySVG />
          </div>
        );
      case 'study':
        return (
          <div className="swaying-flower">
            <TulipSVG />
          </div>
        );
      case 'code':
        return (
          <div className="swaying-flower">
            <LavenderSVG />
          </div>
        );
      case 'journal':
        return (
          <div className="swaying-flower">
            <RoseSVG />
          </div>
        );
      default:
        return (
          <div className="sleeping-sprout">
            <SproutSVG />
          </div>
        );
    }
  };

  return (
    <div className="garden-page-container">
      
      {/* Header Card with Progress Bar */}
      <section className="cozy-card garden-header-card">
        <div className="garden-message-box">
          <p className="garden-message-main">Today's Garden</p>
          <p className="garden-message-sub">
            {completedCount === 0 
              ? "Your garden is waiting for its first flower. Complete a seed today to start blooming." 
              : completedCount === DEFAULT_SEEDS.length
                ? "Your little garden is blooming beautifully today."
                : `${completedCount} of ${DEFAULT_SEEDS.length} seeds bloomed today. Keep tending to your habits.`}
          </p>
          {/* Garden Progress Bar */}
          <div className="garden-progress-container">
            <div 
              className="garden-progress-bar" 
              style={{ width: `${(completedCount / DEFAULT_SEEDS.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </section>

      {/* Garden Pasture Field */}
      <section className="cozy-card garden-preview-card">
        <div className="garden-preview-container garden-scene-gradient">
          
          {/* Static Clouds */}
          <div className="static-cloud cloud-1"></div>
          <div className="static-cloud cloud-2"></div>

          {/* Flowers / Sprouts Field Row */}
          <div className="garden-flowers-container garden-plants-row">
            {DEFAULT_SEEDS.map(seed => (
              <div key={seed.id} className="flower-preview-spot plant-spot">
                <div className="plant-svg-wrapper">
                  {renderPlant(seed.id)}
                </div>
                <span className="plant-label">{seed.title}</span>
              </div>
            ))}
          </div>

          {/* Grass and Soil Layers */}
          <div className="garden-grass thick-grass"></div>
          <div className="garden-soil"></div>

        </div>
      </section>

      {/* Cozy Wisdom Quote at Bottom */}
      <div className="quote-container" style={{ marginTop: '24px', marginBottom: 0 }}>
        <section className="quote-card landing-quote-card garden-quote-card">
          <div className="quote-icon">“</div>
          <p className="quote-text">Every flower was once a seed.</p>
          <span className="quote-author">Cozy Wisdom</span>
        </section>
      </div>

    </div>
  );
}

export default Garden;
