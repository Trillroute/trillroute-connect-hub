
import React from 'react';
import { Link } from 'react-router-dom';

export const NavbarLogo = () => {
  return (
    <Link to="/" className="flex-shrink-0">
      <img 
        src="https://static.wixstatic.com/media/7ce495_06a8ff028073430581ba22c033ab586f~mv2.jpg" 
        alt="Trillroute Logo" 
        className="h-10 w-10 rounded-full"
      />
    </Link>
  );
};
