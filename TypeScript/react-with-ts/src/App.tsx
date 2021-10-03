import React from 'react';
import logo from './logo.svg';
import Hello from './components/Hello'
import LikeButton from './components/LikeButton'
import MouseTracker from './components/MouseTracker';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <Hello message="Hello World"></Hello>
        <LikeButton></LikeButton>
        <MouseTracker></MouseTracker>
      </header>
    </div>
  );
}

export default App;
