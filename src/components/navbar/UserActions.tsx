
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';

export const UserActions = () => {
  const { user, logout } = useAuth();

  const getUserInitials = () => {
    if (!user) return '';
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
  };

  if (user) {
    return (
      <div className="flex items-center space-x-4">
        <Link to="/profile" className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-music-500">
          <Avatar className="h-8 w-8 border border-gray-200">
            {user.profilePhoto ? (
              <AvatarImage src={user.profilePhoto} alt={`${user.firstName} ${user.lastName}`} />
            ) : (
              <AvatarFallback className="bg-music-100 text-music-600">
                {getUserInitials()}
              </AvatarFallback>
            )}
          </Avatar>
          <span>Profile</span>
        </Link>
        <Button
          variant="outline"
          onClick={logout}
          className="border-music-300 text-music-500 hover:bg-music-50"
        >
          Logout
        </Button>
      </div>
    );
  }

  return (
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
  );
};
