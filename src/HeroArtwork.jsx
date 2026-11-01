import React from 'react';

export default function HeroArtwork() {
  return (
    <div className="hero-art quiet-art" aria-hidden="true">
      <svg className="quiet-orbits" viewBox="0 0 480 480" fill="none">
        <circle className="orbit-outer" cx="240" cy="240" r="183" />
        <circle className="orbit-inner" cx="240" cy="240" r="139" />
        <g className="quiet-core">
          <circle cx="240" cy="240" r="96" fill="var(--purple)" />
          <circle cx="240" cy="240" r="73" stroke="var(--paper)" strokeOpacity=".24" />
        </g>
        <g className="quiet-satellite">
          <circle cx="376" cy="287" r="9" fill="var(--lime)" stroke="var(--ink)" strokeWidth=".75" />
        </g>
        <circle cx="139" cy="88" r="3" fill="var(--purple)" />
      </svg>
      <span className="quiet-caption">Thought into form.</span>
    </div>
  );
}
