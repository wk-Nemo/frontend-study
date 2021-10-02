## npx安装react + ts环境

使用`npx create-react-app ts-with-react --typescript`命令配置环境



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



## State - useState Hook

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







