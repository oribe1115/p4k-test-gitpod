// シーンの変数
let scene = 'TITLE'
// プレイヤー用の変数
let playerW = 24, playerH = 16
let playerX = 0, playerY = HEIGHT - playerH
// 敵用の変数
let enemyAlive = true
let enemyW = 24, enemyH = 16
let enemyX = 0, enemyY = 0, enemyV = 2
let enemyCount = 300
// 弾用の変数
let shotW = 8, shotH = 16
let shotX = 0, shotY = -100, shotV = -8
// 敵の弾用の変数
let enemyShotW = 8, enemyShotH = 16
let enemyShotX = 0, enemyShotY = HEIGHT + 100, enemyShotV = 2
// 障害物用の変数
let wallW = 32, wallHP = 4
let wallX = WIDTH / 2 - wallW / 2, wallY = HEIGHT - 64
function game () {
  ctx.clearRect(0, 0, WIDTH, HEIGHT)

  // 敵の弾の描画
  ctx.fillStyle = 'red'
  ctx.fillRect(enemyShotX, enemyShotY, enemyShotW, enemyShotH)
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
  // 障害物の描画
  ctx.fillStyle = 'green'
  ctx.fillRect(wallX, wallY, wallW, wallHP * 4)

  // 障害物の処理
  if (wallHP > 0) {
    // 弾と接触したとき
    if (wallX < shotX + shotW && shotX < wallX + wallW) {
      if (wallY < shotY + shotH && shotY < wallY + wallHP * 4) {
        shotY = -100
        wallHP -= 1
      }
    }
    // 敵の弾と接触したとき
    if (wallX < enemyShotX + enemyShotW && enemyShotX < wallX + wallW) {
      if (wallY < enemyShotY + enemyShotH &&
            enemyShotY < wallY + wallHP * 4) {
        enemyShotY = HEIGHT + 100
        wallHP -= 1
      }
    }
  }

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

  // 敵の弾が発射されているとき
  if (enemyShotY < HEIGHT) {
    // 敵の弾の移動
    enemyShotY += enemyShotV
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
        // シーンをゲームクリアーにする
        scene = 'GAMECLEAR'
        enemyAlive = false
        shotY = -100
      }
    }

    // 一定間隔で弾を撃つ
    enemyCount -= 1
    if (enemyCount === 0) {
      enemyCount = 300
      enemyShotX = enemyX + enemyW / 2 - enemyShotW / 2
      enemyShotY = enemyY
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
  // 敵の弾と接触したとき
  if (playerX < enemyShotX + enemyShotW &&
    enemyShotX < playerX + playerW) {
    if (playerY < enemyShotY + enemyShotH &&
      enemyShotY < playerY + playerH) {
      // シーンをゲームオーバーにする
      scene = 'GAMEOVER'
    }
  }
}

function main () {
  // シーンがタイトルのとき
  if (scene === 'TITLE') {
    title()
  }
  // シーンがゲームのとき
  if (scene === 'GAME') {
    game()
  }
  // シーンがゲームオーバーのとき
  if (scene === 'GAMEOVER') {
    gameover()
  }
  // シーンがゲームクリアーのとき
  if (scene === 'GAMECLEAR') {
    gameclear()
  }
}

function title () {
  ctx.clearRect(0, 0, WIDTH, HEIGHT)
  // 画面を黒く
  ctx.fillStyle = 'black'
  ctx.fillRect(0, 0, WIDTH, HEIGHT)

  // 「INVADER」を描画
  ctx.fillStyle = 'white'
  ctx.fillText('INVADER', WIDTH / 2, HEIGHT / 2)

  // スペースキーが押されたとき
  if (spaceKeyOnce()) {
    // 初期化を行う
    reset()
    // シーンをゲームにする
    scene = 'GAME'
  }
}

function gameover () {
  ctx.clearRect(0, 0, WIDTH, HEIGHT)
  // 画面を黒く
  ctx.fillStyle = 'black'
  ctx.fillRect(0, 0, WIDTH, HEIGHT)

  // 「GAMEOVER」を描画
  ctx.fillStyle = 'white'
  ctx.fillText('GAMEOVER', WIDTH / 2, HEIGHT / 2)

  // スペースキーが押されたとき
  if (spaceKeyOnce()) {
    // シーンをタイトルにする
    scene = 'TITLE'
  }
}

function gameclear () {
  ctx.clearRect(0, 0, WIDTH, HEIGHT)
  // 画面を黒く
  ctx.fillStyle = 'black'
  ctx.fillRect(0, 0, WIDTH, HEIGHT)

  // 「GAMECLEAR」を描画
  ctx.fillStyle = 'white'
  ctx.fillText('GAMECLEAR', WIDTH / 2, HEIGHT / 2)

  // スペースキーが押されたとき
  if (spaceKeyOnce()) {
    // シーンをタイトルにする
    scene = 'TITLE'
  }
}

function reset () {
  // プレイヤーの初期位置
  playerX = WIDTH / 2 - playerW / 2
  playerY = HEIGHT - playerH
  // 弾の初期化
  shotX = 0
  shotY = -100
  // 敵の初期化
  enemyX = 0
  enemyY = 0
  enemyV = 2
  enemyAlive = true
  enemyCount = 300
  // 敵の弾の初期化
  enemyShotX = 0
  enemyShotY = HEIGHT + 100
  // 障害物の初期化
  wallHP = 4
}
