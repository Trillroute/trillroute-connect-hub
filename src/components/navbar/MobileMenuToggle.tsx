
import React from 'react';
import { Menu, X } from 'lucide-react';

interface MobileMenuToggleProps {
  isMenuOpen: boolean;
  toggleMenu: () => void;
}

export const MobileMenuToggle = ({ isMenuOpen, toggleMenu }: MobileMenuToggleProps) => {
  return (
    <div className="flex items-center md:hidden absolute right-4">
      <button
        onClick={toggleMenu}
        className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-music-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-music-500"
      >
        <span className="sr-only">Open main menu</span>
        {isMenuOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
      </button>
    </div>
  );
};
