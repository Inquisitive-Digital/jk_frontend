import React, { Suspense, useState, useEffect } from 'react';
import SkeletonLoader from './SkeletonLoader';

/**
 * LazyLoad - A wrapper component for code-splitting with skeleton loader
 * @param {Function} componentImport - The dynamic import function for the component
 * @returns {React.Component} The loaded component or SkeletonLoader while loading
 */
function LazyLoad({ componentImport }) {
  const [Component, setComponent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadComponent = async () => {
      try {
        setLoading(true);
        const module = await componentImport();
        if (isMounted) {
          setComponent(() => module.default);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err);
          setLoading(false);
        }
      }
    };

    loadComponent();

    return () => {
      isMounted = false;
    };
  }, [componentImport]);

  if (loading) {
    return <SkeletonLoader />;
  }

  if (error) {
    console.error('Error loading component:', error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-4">Failed to load the page. Please try refreshing.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return Component ? <Component /> : <SkeletonLoader />;
}

/**
 * LazyPage - Higher order component to wrap lazy-loaded pages with Layout
 * @param {Function} componentImport - The dynamic import function for the component
 * @param {Object} layoutProps - Props to pass to the Layout wrapper
 * @returns {React.Component} The wrapped component with Layout
 */
export function LazyPage({ componentImport, layoutProps = {} }) {
  const [Component, setComponent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadComponent = async () => {
      try {
        setLoading(true);
        const module = await componentImport();
        if (isMounted) {
          setComponent(() => module.default);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err);
          setLoading(false);
        }
      }
    };

    loadComponent();

    return () => {
      isMounted = false;
    };
  }, [componentImport]);

  if (loading) {
    return <SkeletonLoader />;
  }

  if (error) {
    console.error('Error loading component:', error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-4">Failed to load the page. Please try refreshing.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  if (!Component) {
    return <SkeletonLoader />;
  }

  // If layoutProps are provided, wrap with Layout
  if (Object.keys(layoutProps).length > 0) {
    const Layout = layoutProps.layout;
    const { layout: LayoutComponent, ...restProps } = layoutProps;
    return <Layout {...restProps}><Component /></Layout>;
  }

  return <Component />;
}

export default LazyLoad;
