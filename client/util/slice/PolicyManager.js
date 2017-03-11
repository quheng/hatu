export default class PolicyManager {
  /**
   *
   * @param {Slices} slice
   */
  constructor (slice) {
    this.slice = slice
    this.left = 0
    this.right = this.slice.width
    this.top = this.slice.height
    this.bottom = 0
    this.updateTime = Date.now()

    let scope = this
    let sqr = n => n * n

    setInterval(() => {
      if (Date.now() - scope.updateTime > 1000) {
        if ((sqr(scope.slice.left - scope.left) + sqr(scope.slice.right - scope.right) + sqr(scope.slice.top - scope.top) + sqr(scope.slice.bottom - scope.bottom) > 1) || scope.slice.updateElevation) {
          scope.left = scope.slice.left
          scope.right = scope.slice.right
          scope.top = scope.slice.top
          scope.bottom = scope.slice.bottom
          scope.slice.update()
          scope.slice.updateElevation = false
        }
      }
    }, 500)
  }

  notify () {
    console.log('change')
    this.updateTime = Date.now()
  }
}
