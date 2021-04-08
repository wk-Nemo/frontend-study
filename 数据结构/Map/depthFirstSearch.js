class DepthFirstSearch {
  constructor (G, s) {
    // 表示顶点是否被搜索过
    this.marked = []
    for (let i = 0; i < G.length; i++) {
      this.marked[i] = false
    }
    // 记录有多少个顶点与s相通
    this.count = 0

    this.dfs(G, s)
  }

  // 使用深度优先搜索出G种与v相同的所有顶点
  dfs (G, v) {
    this.marked[v] = true
    for (let i = 0; i < G[v].length; i++) {
      if (!this.marked[G[v][i]]) {
        this.dfs(G, G[v][i])
      }
    }
    this.count++
    return
  }

  // 判断w是否和v相连
  marked (w) {
    return this.marked[w]
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

const dfs = new DepthFirstSearch(G, 12)
console.log(dfs.marked, dfs.count)