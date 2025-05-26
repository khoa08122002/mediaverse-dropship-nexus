import React, { useState} from 'react';
import Preloader from '../components/Preloader';

const withPreloader = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
  return function WithPreloaderComponent(props: P) {
    const [isLoading, setIsLoading] = useState(true);

    const handleLoadingComplete = () => {
      setIsLoading(false);
    };

    if (isLoading) {
      return <Preloader onLoadingComplete={handleLoadingComplete} />;
    }

    return <WrappedComponent {...props} />;
  };
};

export default withPreloader; 