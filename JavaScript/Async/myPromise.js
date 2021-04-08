const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'reject'

class Promise {
  constructor(executor) {
    this.status = PENDING
    this.value = undefined
    this.reason = undefined
    this.onResolvedCallbacks = []
    this.onRejectedCallbacks = []

    let resolve = (value) => {
      if (this.status === PENDING) {
        this.status = FULFILLED
        this.value = value
        this.onResolvedCallbacks.forEach((fn) => fn())
      }
    }

    let reject = (reason) => {
      if (this.status === PENDING) {
        this.status = REJECTED
        this.reason = reason
        this.onRejectedCallbacks.forEach((fn) => fn())
      }
    }

    try {
      executor(resolve, reject)
    } catch (error) {
      reject(error);
    }
  }
}