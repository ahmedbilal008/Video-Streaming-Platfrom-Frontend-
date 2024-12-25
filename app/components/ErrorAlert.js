'use client';

import { useState, useEffect } from 'react';

export default function ErrorAlert({ message }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative shadow-md hover:shadow-lg transition-shadow duration-300" role="alert">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{message}</span>
      </div>
    </div>
  );
}

