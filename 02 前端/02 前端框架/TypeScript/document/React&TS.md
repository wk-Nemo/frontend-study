## npx安装react + ts环境

使用`npx create-react-app ts-with-react --template typescript`命令配置环境



## Hello World

```typescript
import React from 'react'

interface IHelloProps {
  message: string;
}

const Hello: React.FC<IHelloProps> = (props) => {
  return <h2>{props.message}</h2>
}

Hello.defaultProps = {
  message: "Hello World"
}

export default Hello
```



## React Hooks

在react中原来有两种写法，一种是class，另一种是function。而hooks的特性，意在代替class的写法。

- 完全可选
- 百分百向后兼容
- 没有计划移除class



解决的问题：

- 组件很难复用状态逻辑
- 复杂组件难以理解，尤其是生命周期函数
- Hooks使react完全拥抱函数



规则：

- 只在顶层调用Hook
- 只在react函数中调用Hook



## useState

```typescript
import React, { useState } from 'react'

const LikeButton: React.FC = () => {
  const [like, setLike] = useState(0)
  const [on, setOn] = useState(true)

  return (
    <>
      <button onClick={() => {setLike(like + 1)}}>
        {like} 👍
      </button>
      <button onClick={() => {setOn(!on)}}>
        {on ? 'NO' : 'OFF'} 
      </button>
    </>
  )
}

export default LikeButton
```



## useEffect

```typescript
import React, { useState, useEffect } from 'react'

const MouseTracker: React.FC = () => {
  const [position, setPosition] = useState({x: 0, y: 0})
  useEffect(() => {
    const updateMouse = (e: MouseEvent) => {
      console.log('inner')
      setPosition({x: e.clientX, y: e.clientY})
    }
    document.addEventListener('click', updateMouse)

    return () => {
      document.removeEventListener('click', updateMouse)

    }
  }, [])

  return (
    <p>X: {position.x}, Y: {position.y}</p>
  )
}

export default MouseTracker
```



## 自定义Hook

将组件逻辑提取到可重用的函数种

**定义：**

```typescript
import { useState, useEffect } from 'react'
import axios from 'axios'

const useURLLoader = (url: string, deps: number[] = []) => {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    axios.get(url).then(result => {
      setData(result.data)
      setLoading(false)
    })
  }, deps)

  return [data, loading]
}

export default useURLLoader
```

**调用：**

```react
function App() {
  const [num, setNum] = useState(0)
  const [data, loading] = useURLLoader('https://dog.ceo/api/breeds/image/random', [num])
  const dogResult =  data as IShowResult

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={() => {setNum(num + 1)}}>refresh dog</button>
        { loading ? <p>读取中</p>
          : <img src={dogResult && dogResult.message} />
        }
      </header>
    </div>
  );
}
```



## useRef

```react
import React, { useState, useEffect, useRef } from 'react'

const LikeButton: React.FC = () => {
  const [like, setLike] = useState(0)
  const [on, setOn] = useState(true)
  const likeRef = useRef(1)

  useEffect(() => {
    document.title = `点击了${like}次`
  }, [like])

  function handleAlertClick() {
    console.log(likeRef)
    setTimeout(() => {
      alert(`click like: ${like} times, refLike: ${likeRef.current}`)
    }, 2000)
  }

  return (
    <>
      <button onClick={handleAlertClick}>like test</button>
      <button onClick={() => {setLike(like + 1); likeRef.current++}}>
        {like} 👍
      </button>
      <button onClick={() => {setOn(!on)}}>
        {on ? 'NO' : 'OFF'} 
      </button>
    </>
  )
}

export default LikeButton
```



## useContext

类似于vuex的作用

```react
import React, { useState } from 'react'
import LikeButton from './components/LikeButton'
import './App.css';

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
  return (
    <div className="App">
      <ThemeContext.Provider value={themes.dark}>
          <LikeButton></LikeButton>
      </ThemeContext.Provider>
    </div>
  );
}

export default App;
```

```react
import React, { useState, useEffect, useRef, useContext } from 'react'
import { ThemeContext } from '../App'

const LikeButton: React.FC = () => {
  const theme = useContext(ThemeContext)
  const style = {
    background: theme.background,
    color:theme.color
  }

  return (
    <>
      <button style={style}>
        {like} 👍
      </button>
    </>
  )
}

export default LikeButton
```



