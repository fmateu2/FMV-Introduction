import React from 'react';

function ProcessNode({ x, y, name }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="-52" y="-39" width="104" height="78" rx="12" fill="var(--purple)" stroke="var(--ink)" strokeWidth="1.2" />
      <text y="-10" textAnchor="middle" fill="var(--paper)" fontFamily="Arial, sans-serif" fontSize="11" letterSpacing="1.2">PROCESS</text>
      <text y="20" textAnchor="middle" fill="var(--lime)" fontFamily="Arial, sans-serif" fontSize="28" fontWeight="700">{name}</text>
    </g>
  );
}

export default function CitadelArtwork() {
  return (
    <svg className="citadel-artwork" viewBox="0 0 560 350" role="img" aria-label="Three independent processes connected by a shared TCP protocol">
      <g fill="none" stroke="var(--purple)" strokeWidth="1.5">
        <path className="diagram-dash" d="M197 118H363" />
        <path className="diagram-dash" d="M171 157L254 207" />
        <path className="diagram-dash" d="M389 157L306 207" />
      </g>
      <text x="280" y="96" textAnchor="middle" fill="var(--muted)" fontFamily="Arial, sans-serif" fontSize="12" letterSpacing="1">TCP / MESSAGES</text>
      <ProcessNode x={145} y={118} name="A" />
      <ProcessNode x={415} y={118} name="B" />
      <ProcessNode x={280} y={246} name="C" />
      <g fill="var(--lime)" stroke="var(--ink)" strokeWidth="1">
        <circle cx="197" cy="118" r="4" />
        <circle cx="363" cy="118" r="4" />
        <circle cx="254" cy="207" r="4" />
        <circle cx="306" cy="207" r="4" />
      </g>
      <text x="280" y="324" textAnchor="middle" fill="var(--muted)" fontFamily="Arial, sans-serif" fontSize="12" letterSpacing="1.4">DECENTRALIZED BY DESIGN</text>
    </svg>
  );
}
