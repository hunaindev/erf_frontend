import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  light?: boolean;
}

const Logo: React.FC<LogoProps> = ({ light = false }) => {
  return (
    <>
      <Link to="/" className={`transition-colors duration-200 flex items-center ${light ? 'text-white hover:text-white/80' : 'text-foreground hover:text-primary'}`}>
        <div className={`text-lg md:text-2xl tracking-tight ${light ? 'text-white' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '0.15rem' }}>
          <span className={`inline-block font-bold text-3xl md:text-4xl ${light ? 'text-white' : 'text-primary'}`}>E</span>
          <span className={`inline-block font-bold text-3xl md:text-4xl ${light ? 'text-white' : 'text-primary'}`}>R</span>
          <span className="inline-block">F</span>
          <span className="inline-block">L</span>
          <span className="inline-block">U</span>
          <span className="inline-block">E</span>
          <span className="inline-block">N</span>
          <span className="inline-block">C</span>
          <span className="inline-block">E</span>
          <span className="inline-block">R</span>
        </div>
      </Link>
    </>
  );
};

export default Logo;
