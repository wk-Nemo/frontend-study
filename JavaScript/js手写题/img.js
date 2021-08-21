
function loadImg(url) {
  return new Promise() {
    (resolve, reject) => {
      const img = document.creatElement('img')
      img.onload = () => {
        resolve(img)
      }
      img.onerror = () => {
        reject(new Error(`图片加载失败${url}`))
      }
    }
  }
} 

const url1 = ''
const url2 = ''


loadImg(url1).then(img1 => {
  console.log(img1.width)
  return img1
})
  .then(img1 => {
    console.log(img1.height)
    return loadImg(url2)
  })
  .then(img2 => {
    console.log(img2.width)
  })
  .catch(err => console.log(err))