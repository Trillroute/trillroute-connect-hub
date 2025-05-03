
import React from 'react';
import { Card } from '@/components/ui/card';

interface ContentWrapperProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

const ContentWrapper: React.FC<ContentWrapperProps> = ({ title, description, children }) => {
  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="text-gray-500">{description}</p>
      </div>
      {children}
    </div>
  );
};

export default ContentWrapper;
