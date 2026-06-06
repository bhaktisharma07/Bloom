import React from 'react';
import { Link } from 'react-router-dom';
import { 
  HeroIllustrationSVG, 
  DaisySVG, 
  TulipSVG, 
  LavenderSVG, 
  RoseSVG,
  SproutSVG, 
  ButterflySVG,
  HeartSVG 
} from '../components/SVGAssets';

function Landing() {
  return (
    <div>
      {/* 1. Hero Section (2-Column Grid on Desktop) */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Grow one tiny habit at a time.</h1>
          <p className="hero-description">
            Turn daily habits into a beautiful blooming garden and nurture your self-care journey. 
            Nurture your seeds, watch them blossom, and grow little by little.
          </p>
          <Link to="/home" className="cozy-btn">
            Start Growing
          </Link>
        </div>
        
        <div className="hero-illustration">
          <HeroIllustrationSVG />
        </div>
      </section>

      {/* 2. Features Preview Section */}
      <section className="features-container">
        <h2 className="features-title">Features Preview</h2>
        
        <div className="features-list">
          {/* Card 1 */}
          <div className="cozy-card feature-card">
            <div className="feature-illustration">
              <div style={{ width: '28px', height: '42px' }}>
                <SproutSVG />
              </div>
            </div>
            <div className="feature-info">
              <h3>Track Daily Habits 🌱</h3>
              <p>Plant tiny daily habits and watch them sprout as you tend to them every morning.</p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="cozy-card feature-card">
            <div className="feature-illustration">
              <div style={{ width: '28px', height: '42px' }}>
                <TulipSVG />
              </div>
            </div>
            <div className="feature-info">
              <h3>Grow Your Garden 🌷</h3>
              <p>Your progress is visual. Water your seeds to grow a lush, colorful flower bed.</p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="cozy-card feature-card">
            <div className="feature-illustration">
              <div style={{ width: '28px', height: '42px' }}>
                <LavenderSVG />
              </div>
            </div>
            <div className="feature-info">
              <h3>Celebrate Small Wins ✨</h3>
              <p>Earn cute badges, self-care affirmations, and milestones along the way.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Garden Preview Section (cinematic full-width plot) */}
      <section className="cozy-card garden-preview-card">
        <div className="garden-preview-header">
          <h2>Garden Preview</h2>
          <p className="subtitle">Here is a glimpse of your potential future meadow.</p>
        </div>

        <div className="garden-preview-container">
          {/* Drifting clouds */}
          <div className="floating-cloud cloud-1"></div>
          <div className="floating-cloud cloud-2"></div>
          
          {/* Fluttering butterfly */}
          <div className="butterfly bf-1">
            <ButterflySVG />
          </div>

          {/* Soil & Grass */}
          <div className="garden-grass"></div>
          <div className="garden-soil"></div>

          {/* Mock bloomed flowers */}
          <div className="garden-flowers-container">
            <div className="flower-preview-spot">
              <DaisySVG />
            </div>
            <div className="flower-preview-spot">
              <TulipSVG />
            </div>
            <div className="flower-preview-spot">
              <LavenderSVG />
            </div>
            <div className="flower-preview-spot">
              <RoseSVG />
            </div>
          </div>
        </div>
      </section>

      {/* 4. Cute Quote Section */}
      <div className="quote-container">
        <section className="quote-card">
          <div className="quote-icon">🌸</div>
          <p className="quote-text">"Every flower was once a seed."</p>
          <span className="quote-author">Cozy Wisdom</span>
        </section>
      </div>

      {/* 5. Footer */}
      <footer className="footer">
        <div className="footer-brand">
          <span>Bloom 🌸</span>
        </div>
        <p className="footer-copy">
          Made with <HeartSVG /> for your growth.
        </p>
      </footer>
    </div>
  );
}

export default Landing;
