## HTML面试题

#### 1. 如何理解HTML语义化

同一个列表可以使用单纯的div也可以使用ul和li完成，虽然两种方式都可以通过css实现完全一样的展示效果，但是HTML语义化的优点如下：

- 两套完全一样的代码，第二种方法看起来会更容易理解。（增强代码可读性）
- 搜索引擎在第二种方便通过标签会更容易理解。（SEO）



#### 2. 默认情况下，哪些HTML标签是块级元素？哪些是内联元素？

块级元素，不管内容有多少都会独占一行。display:block/table，有div、h1、h2、table、ul、ol、p。

内联元素，会紧挨着上一个元素排列，一直到放不下才会换行。display:inline/inline-block，有span、img、input、button。



## CSS面试题

- 布局
- 定位
- 图文样式
- 响应式
- CSS3（flex和动画）

## 布局

#### 1. 盒子模型

css盒子模型包括：内容宽度、内边距（padding)、边框 （border）、外边框（margin）

##### （1）IE盒子模型和标准盒子模型的差异

- W3C的规范下，元素内容占据的空间是由width设置的，而内容周围的padding和margin是另算的。
  - 盒子的内容宽度 = 我们设置的width。
  - 盒子的实际宽度 = width + padding + border + margin
- IE盒子模型的width不是内容宽度，而是内容、内边距和边框宽度的总和。
  - 盒子的内容宽度 = width - padding - border
  - 盒子的总宽度 = width + margin



##### （2）如何设置成IE盒子模型？

设置样式`box-sizing: border-box`后，盒子模型就会变成IE盒子模型。



#### 2. margin纵向重叠问题

- 相邻元素的margin-top和margin-bottom会发生重叠
- 空内容的标签也会重叠

看个例子：

```html
<p>AAA</p>
<p></p>
<p></p>
<p>BBB</p>
```

```css
p {
	height: 10px;
	margin-top: 10px;
	margin-bottom: 15px;
}
```

上面内容AAA的p标签和内容为bbb标签的margin距离为15px，两者之间的p标签重叠了，最上面和最下面的两个p标签的外边距也重叠了。



#### 3. margin负值

- `margin-top`和`margin-left`为负值，元素向上、向左移动

- `margin-right`为负值，右侧元素左移，自身不受影响
- `margin-bottom`为负值，下侧元素上移，本身不受影响

ps：绝对定位 top=0 right = 0时 margin-right 设置负值就能影响本身向右偏移



#### 4. BFC是什么？如何应用？

##### （1）什么是BFC？

**`Block Format context`，"块级格式化上下文"。`BFC`是一个完全独立的 渲染空间，内部元素的渲染不会影响到边界以外的元素。**



##### （2）BFC的应用

那么怎么使用`BFC`呢，`BFC`可以看做是一个`CSS`元素属性。

**触发条件：**

-   `overflow`不是`visible`
-   `display`是`flex`、`inline-block`、`table-cell`等
-   `position`是` absolute`或`fixed`

**解决问题：**

-   float的高度塌陷
-   margin边距重叠
-   两栏布局的问题



#### 5. float布局

##### （1）实现圣杯布局

- 使用 float布局
- 两侧使用margin负值，以便中间内容横向重叠
- 防止中间内容被两侧覆盖，一个用padding，一个用margin

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      .header {
        text-align: center;
        background-color: #00f;
      }

      .footer {
        text-align: center;
        background-color: #0f0;
        clear: both;
      }

      .container {
        border: 1px solid black;
        padding: 0 300px 0 200px; /*为两边留白*/
      }

      .center {
        width: 100%;
        background: #f00;
      }

      .left {
        width: 200px;
        background-color: rgb(209, 142, 55);
        margin-left: -200px; /*这里相当于左移了200px*/
      }

      .right {
        width: 300px;
        background-color: aquamarine;
        margin-right: -300px; /*这里相当于自身的300px消除了*/ 
      }

      .colum {
        float: left;
      }
    </style>
  </head>
  <body>
    <div class="header">这是header</div>
    <div class="container">
      <div class="left colum">左侧区域</div>
      <div class="center colum">中间内容</div>
      <div class="right colum">右侧区域</div>
    </div>
    <div class="footer">这是footer</div>
  </body>
</html>
```

##### （2）双飞翼布局

思路和圣杯布局差不多，但是使用margin为两边留白

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      .main {
        width: 100%;
        background: #f00;
      }

      .main .content {
        margin-left: 200px;
        margin-right: 300px;
      }

      .left {
        width: 200px;
        background: #0f0;
        margin-left: -100%;
      }

      .right {
        width: 300px;
        background: #00f;
        margin-left: -300px;
      }

      .cloum {
        float: left;
        height: 200px;
      }
    </style>
  </head>
  <body>
    <div class="main cloum">
      <div class="content">hello world</div>
    </div>
    <div class="left cloum">你好</div>
    <div class="right cloum">王鹏浩</div>
  </body>
</html>
```



##### （3）手写clearfix

```css
.clearfix:after {
	content: '';
	display: table;
	clear: both;
}
```



#### 6. flex布局: 实现一个三点骰子

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <style>
    .box {
      width: 200px;
      height: 200px;
      border: 2px solid #ccc;
      border-radius: 10px;
      padding: 20px;

      display: flex;
      justify-content: space-between;
    }
    .item {
      width: 40px;
      height: 40px;
      background-color: black;
      border-radius: 50%;
      display: block;
    }
    .div1 {
      align-self: flex-start;
    }
    .div2 {
      align-self: center;
    }
    .div3 {
      align-self: flex-end;
    }
  </style>
</head>
<body>
  <div class="box">
    <div class="item div1"></div>
    <div class="item div2"></div>
    <div class="item div3"></div>
  </div>
</body>
</html>
```

效果如下：

![image-20210821012317862](C:\Users\lenovo\AppData\Roaming\Typora\typora-user-images\image-20210821012317862.png)



## 定位问题

#### 1. absolute和relative分别依据什么定位

- relative：依据自身定位

- absolute：依据最近的一层**定位元素**进行定位，定位元素如下：

  - absolute relative fixed
  - body

  

#### 2. 居中对其有哪些方式

##### （1）水平居中

- inline元素：text-align: center
- block元素：margin: auto
- absolute元素：left: 50% + margin-left 负值

##### （2）垂直居中

- inline元素：设置line-height
- absolute： top: 50% + margin-top 负值
- 不知道元素的高度和宽度：transform(-50%, -50%) 
- absolute: top，left，bottom，right：0 + margin:  auto



## 图文样式

#### 1. line-height如何继承

- 具体数值，直接继承。如line-height: 30px

  ```css
  body {
  	line-height: 30px;
  }
  .container {
  	/*相当于*/ 
  	line-height: 30px;
  }
  ```

- 写比例，继承比例。如line-height: 2

  ```css
  body {
  	line-height: 2;
  }
  .container {
  	/*高度为40px*/ 
  	line-height: 2;
  	font-size: 20px;
  }
  ```

- 写百分比，继承计算出来的line-height

  ```css
  body {
  	font-size: 30px;
  	line-height: 200%;
  }
  .container {
  	/*高度为60px，注意这里和比例的继承的不同*/ 
  	font-size: 20px;
  }
  ```

  

##  响应式

#### 1. rem是什么

- px：绝对长度单位，常用

- em：相对长度单位，相对的是父元素，不常用

- rem：相对长度单位，相对于根元素（html里设置font-size），常用于响应式布局

  

#### 2. 如何实现响应式

##### （1）rem实现

- media-quary，根据不同的屏幕宽度设置根元素font-size
- rem基于根元素的相对单位

##### （2）vw、vh

先了解一下网页视口尺寸，宽度类比：

- window.screen.height：屏幕高度，手机屏幕的高度
- window.innerHeight：网页视口高度，浏览器内显示内容的高度
- document.body.clientHeight：body高度，网页内容的实际长度

下面了解vw和vh

- vw：网页视口宽度的1/100

- vh：网页视口高度的1/100
- vmax：取两者的最大值
- vmin：取两者的最小值