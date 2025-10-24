import React from 'react';

function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 flex-shrink-0">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            <linearGradient id="earthGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#10b981', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#059669', stopOpacity: 1 }} />
            </linearGradient>
          </defs>

          <circle 
            cx="50" 
            cy="50" 
            r="45" 
            fill="url(#earthGradient)"
            style={{ filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))' }}
          />
          
          <path 
            d="M 30 35 Q 35 30 45 32 L 50 28 L 55 35 L 50 40 Z" 
            fill="#047857"
            opacity="0.7"
          />
          <path 
            d="M 60 45 Q 65 42 70 45 L 75 50 L 70 58 L 60 55 Z" 
            fill="#047857"
            opacity="0.7"
          />
          <path 
            d="M 25 55 Q 30 52 38 55 L 42 62 L 35 68 L 28 63 Z" 
            fill="#047857"
            opacity="0.7"
          />
          
          <g opacity="0.95">
            <ellipse 
              cx="48" 
              cy="70" 
              rx="10" 
              ry="8" 
              fill="#ffffff" 
            />
            <circle cx="42" cy="58" r="3" fill="#ffffff" />
            <circle cx="48" cy="56" r="3.5" fill="#ffffff" />
            <circle cx="54" cy="57" r="3" fill="#ffffff" />
            <circle cx="59" cy="59" r="2.5" fill="#ffffff" />
          </g>
        </svg>
      </div>
      
      <div className="flex flex-col">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
          Carbon Footprint Tracer
        </h1>
        <p className="text-xs text-gray-600 dark:text-gray-400 font-medium leading-tight">
          Track. Reduce. Impact.
        </p>
      </div>
    </div>
  );
}

export default Logo;