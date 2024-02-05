function profile(callback, ...args) {
  const iterations = 250
  let totalMs = 0

  for (let i = 0; i < iterations; i++) {
    const start = performance.now()
    callback(...args)
    const duration = performance.now() - start
    totalMs += duration
  }

  console.log(`${(totalMs / iterations) * 1000} ms`)
}

export default profile
