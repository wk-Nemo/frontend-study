class BreadthFirstSearch {
  constructor (G, s) {
    // 表示顶点是否被搜索过
    this.marked = []
    for (let i = 0; i < G.length; i++) {
      this.marked[i] = false
    }
    // 记录有多少个顶点与s相通
    this.count = 0

    this.bfs(G, s)
  }

  // 广度优先搜索，如果遇到一个节点既有子节点又有兄弟节点，那么先找兄弟节点，再找子节点
  bfs (G, v) {
    this.marked[v] = true
    const queue = []
    for (let i = 0; i < G[v].length; i++) {
      if(!this.marked[G[v][i]]) {
        this.marked[G[v][i]] = true
        queue.push(G[v][i])
      }
    }
    while (queue.length) {
      this.bfs(G, queue.shift())
    }
    this.count ++
  }
}

const G = [
  [1],
  [0, 2, 5, 10],
  [1, 3, 4, 9],
  [2, 9],
  [2],
  [1, 7, 8],
  [10],
  [5, 8],
  [5, 7],
  [2, 3],
  [1, 6],
  [11],
  [12]
]

const bfs = new BreadthFirstSearch(G, 11)
console.log(bfs.marked)