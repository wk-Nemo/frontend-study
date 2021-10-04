import React, { useState } from 'react'
import logo from './logo.svg';
import Hello from './components/Hello'
import LikeButton from './components/LikeButton'
import MouseTracker from './components/MouseTracker';
import useMousePosition from './hooks/useMousePosition';
import useURLLoader from './hooks/useURLLoader';
import './App.css';

interface IShowResult {
  message: string;
  status: string;
}

interface IThemeProps {
  [key: string]: {color: string; background: string;}
}

const themes: IThemeProps = {
  'light': {
    color: '#000',
    background: '#eee',
  },
  'dark': {
    color: '#fff',
    background: '#222',
  }
}

export const ThemeContext = React.createContext(themes.light)

function App() {
  const position = useMousePosition()
  const [num, setNum] = useState(0)
  const [data, loading] = useURLLoader('https://dog.ceo/api/breeds/image/random', [num])
  const dogResult =  data as IShowResult

  return (
    <div className="App">
      <ThemeContext.Provider value={themes.dark}>
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <Hello message="Hello World"></Hello>

          <LikeButton></LikeButton>

          <MouseTracker></MouseTracker>

          <p>X: {position.x}, Y: {position.y}</p>

          <button onClick={() => {setNum(num + 1)}}>refresh dog</button>
          { loading ? <p>读取中</p>
            : <img src={dogResult && dogResult.message} />
          }
        </header>
      </ThemeContext.Provider>
    </div>
  );
}

export default App;
