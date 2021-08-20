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

#### 4. BFC是什么？如何应用？

#### 5. float布局问题，以及clearfix

- 实现圣杯布局和双飞翼布局
- 手写clearfix

#### 6. flex布局

- 实现一个三点骰子

## 定位问题

#### 1. absolute和relative分别依据什么定位

#### 2. 居中对其有哪些方式

## 图文样式

#### 1. line-height继承问题

##  响应式

#### 1. rem是什么

#### 2. 如何实现响应式

## CSS3

#### 1. 关于CSS3动画