// プレイヤー用の変数
let playerW = 24, playerH = 16
let playerX = 0, playerY = HEIGHT - playerH
// 敵用の変数
let enemyAlive = true
let enemyW = 24, enemyH = 16
let enemyX = 0, enemyY = 0, enemyV = 2
// 弾用の変数
let shotW = 8, shotH = 16
let shotX = 0, shotY = -100, shotV = -8
function main() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT)

  // 敵の描画
  if (enemyAlive) {
    ctx.fillStyle = 'gray'
    ctx.fillRect(enemyX, enemyY, enemyW, enemyH)
  }
  // 弾の描画
  ctx.fillStyle = 'yellow'
  ctx.fillRect(shotX, shotY, shotW, shotH)
  // プレイヤーの描画
  ctx.fillStyle = 'black'
  ctx.fillRect(playerX, playerY, playerW, playerH)

  // 弾が発射されているとき
  if (shotY + shotH > 0) {
    // 弾の移動
    shotY += shotV
  } else { // 弾が発射されていないとき
    // スペースキーが押されたとき
    if (spaceKey()) {
      shotX = playerX + playerW / 2 - shotW / 2
      shotY = playerY
    }
  }

  if (enemyAlive) {
    // 敵を移動
    enemyX += enemyV
    // 右の壁に接触したとき
    if (enemyX > WIDTH - enemyW) {
      enemyX = WIDTH - enemyW
      enemyY += 4
      enemyV = -2
    }
    // 左の壁に接触したとき
    if (enemyX < 0) {
      enemyX = 0
      enemyY += 4
      enemyV = 2
    }
    // 弾と衝突したとき
    if (enemyX < shotX + shotW && shotX < enemyX + enemyW) {
      if (enemyY < shotY + shotH && shotY < enemyY + enemyH) {
        enemyAlive = false
        shotY = -100
      }
    }
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
  if (playerX > WIDTH - playerW) {
    playerX = WIDTH - playerW
  }
}
