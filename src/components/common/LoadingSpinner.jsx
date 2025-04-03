import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center min-h-[200px]">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
    </div>
  );
};

export default LoadingSpinner;