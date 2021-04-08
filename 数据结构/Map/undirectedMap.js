// 邻接表实现无向图
class Graph {
  constructor (V) {
    // 顶点的数量
    this.V = V
    // 边的数量
    this.E = 0
    this.adj = []
    for (let i = 0; i < V; i++) {
      this.adj[i] = []
    }
  }

  // 向图中添加一条边v-w
  addEdge (v, w) {
    this.adj[v].push(w)
    this.adj[w].push(v)
    E++
  }

  // 获取一个顶点的所有边
  queue (v) {
    return this.adj[v]
  }
}