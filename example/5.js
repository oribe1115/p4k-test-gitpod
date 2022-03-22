let x = 0
function main () {
  ctx.clearRect(0, 0, WIDTH, HEIGHT)
  ctx.fillRect(x, HEIGHT - 16, 24, 16)
  // →が押されているとき
  if (rightKey()) {
    x += 2
  }
  // ←が押されているとき
  if (leftKey()) {
    x -= 2
  }
  // 左の壁に接触したとき
  if (x < 0) {
    x = 0
  }
  // 右の壁に接触したとき
  if (x > WIDTH - 24) {
    x = WIDTH - 24
  }
}
