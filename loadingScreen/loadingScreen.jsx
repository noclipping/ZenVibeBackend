import React from 'react';
import LoadingScreen from './LoadingScreen/LoadingScreen.mp4';

const LoadingScreen = () => {
  return (
    <div className='screen'>
      <video autoPlay loop muted>
        <source src={LoadingScreen} type="video/mp4" />
      </video>
      <h2 className='loading'>Loading...</h2>
    </div>
  );
};

export default LoadingScreen;