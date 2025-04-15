
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Music, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout, role } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Courses', path: '/courses' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const dashboardLink = () => {
    if (!user) return null;
    
    switch(role) {
      case 'student':
        return { name: 'Student Dashboard', path: '/dashboard/student' };
      case 'teacher':
        return { name: 'Teacher Dashboard', path: '/dashboard/teacher' };
      case 'admin':
        return { name: 'Admin Dashboard', path: '/dashboard/admin' };
      default:
        return null;
    }
  };

  const dashboardOption = dashboardLink();

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <Music className="h-8 w-8 text-music-500" />
              <span className="ml-2 text-xl font-bold text-music-500">Trillroute</span>
            </Link>
            
            <div className="hidden md:ml-10 md:flex md:space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-700 hover:text-music-500 transition-colors"
                >
                  {link.name}
                </Link>
              ))}
              
              {dashboardOption && (
                <Link
                  to={dashboardOption.path}
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-music-500 hover:text-music-600 transition-colors"
                >
                  {dashboardOption.name}
                </Link>
              )}
            </div>
          </div>
          
          <div className="hidden md:flex md:items-center md:space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/profile" className="text-sm font-medium text-gray-700 hover:text-music-500">
                  Profile
                </Link>
                <Button
                  variant="outline"
                  onClick={logout}
                  className="border-music-300 text-music-500 hover:bg-music-50"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/auth/login">
                  <Button variant="outline" className="border-music-300 text-music-500 hover:bg-music-50">
                    Login
                  </Button>
                </Link>
                <Link to="/auth/register">
                  <Button className="bg-music-500 text-white hover:bg-music-600">
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>
          
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-music-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-music-500"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
        <div className="pt-2 pb-3 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:text-music-500 hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          
          {dashboardOption && (
            <Link
              to={dashboardOption.path}
              className="block pl-3 pr-4 py-2 text-base font-medium text-music-500 hover:text-music-600 hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              {dashboardOption.name}
            </Link>
          )}
        </div>
        
        <div className="pt-4 pb-3 border-t border-gray-200">
          {user ? (
            <div className="space-y-1">
              <Link
                to="/profile"
                className="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:text-music-500 hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Profile
              </Link>
              <button
                onClick={() => {
                  logout();
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:text-music-500 hover:bg-gray-50"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="space-y-1">
              <Link
                to="/auth/login"
                className="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:text-music-500 hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/auth/register"
                className="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:text-music-500 hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
