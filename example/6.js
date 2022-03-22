// プレイヤー用の変数
let playerX = 0, playerY = HEIGHT - 16
// 敵用の変数
let enemyX = 0, enemyY = 0, enemyV = 2
function main () {
  ctx.clearRect(0, 0, WIDTH, HEIGHT)
  // プレイヤーの描画
  ctx.fillRect(playerX, playerY, 24, 16)
  // 敵の描画
  ctx.fillRect(enemyX, enemyY, 24, 16)
  // 敵を移動
  enemyX += enemyV
  // 右の壁に接触したとき
  if (enemyX > WIDTH - 24) {
    enemyX = WIDTH - 24
    enemyY += 4
    enemyV = -2
  }
  // 左の壁に接触したとき
  if (enemyX < 0) {
    enemyX = 0
    enemyY += 4
    enemyV = 2
  }

  // 右が押されているとき
  if (rightKey()) {
    playerX += 2
  }
  // 左が押されているとき
  if (leftKey()) {
    playerX -= 2
  }
  // 左の壁に接触したとき
  if (playerX < 0) {
    playerX = 0
  }
  // 右の壁に接触したとき
  if (playerX > WIDTH - 24) {
    playerX = WIDTH - 24
  }
}
