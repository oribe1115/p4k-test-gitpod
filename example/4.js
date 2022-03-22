let x = 0
function main () {
  ctx.clearRect(0, 0, WIDTH, HEIGHT)
  ctx.fillRect(x, 10, 100, 100)
  // スペースキーが押されているとき
  if (spaceKey()) {
    x += 1
  }
}
