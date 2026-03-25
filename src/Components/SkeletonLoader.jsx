import React from 'react';

function SkeletonLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: '#1a1a1a' }}>
      <div className="w-12 h-12 border-4 border-gray-700 border-t-[var(--color-primary)] rounded-full animate-spin"></div>
    </div>
  );
}

export default SkeletonLoader;
