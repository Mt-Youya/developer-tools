if (!window.requestIdleCallback) {
  window.requestIdleCallback =
    window.requestIdleCallback ||
    ((callback) => {
      const start = Date.now()
      return setTimeout(() => {
        callback({
          didTimeout: false,
          timeRemaining: () => Math.max(0, 50 - (Date.now() - start)),
        })
      }, 1)
    })

  window.cancelIdleCallback =
    window.cancelIdleCallback ||
    ((id) => {
      clearTimeout(id)
    })
}
