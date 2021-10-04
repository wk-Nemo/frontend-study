import React, { useState, useEffect, useRef, useContext } from 'react'
import { ThemeContext } from '../App'

const LikeButton: React.FC = () => {
  const [like, setLike] = useState(0)
  const [on, setOn] = useState(true)
  const likeRef = useRef(1)
  const theme = useContext(ThemeContext)
  const style = {
    background: theme.background,
    color:theme.color
  }

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
      <button style={style} onClick={() => {setLike(like + 1); likeRef.current++}}>
        {like} 👍
      </button>
      <button onClick={() => {setOn(!on)}}>
        {on ? 'NO' : 'OFF'} 
      </button>
    </>
  )
}

export default LikeButton