// 制約
// シングルクオート
// インデント: 2 space & soft tab
// セミコロンなし

let IMG = {}
IMG['Player'] = new Image()
IMG['Player'].src = 'img/player2.png'
IMG['Shot'] = new Image()
IMG['Shot'].src = 'img/shot2.png'
IMG['Enemy'] = new Image()
IMG['Enemy'].src = 'img/enemy2.png'
IMG['EnemyShot'] = new Image()
IMG['EnemyShot'].src = 'img/enemyShot2.png'

// シーン変数
let scene = 'TITLE'

// player変数
let playerW = 24, playerH = 16
let playerX = WIDTH / 2, playerY = HEIGHT - playerH

// player shot 変数
let shotW = 8, shotH = 16
let shotX = 0, shotY = -100, shotV = -8

// enemy変数
let enemyW = 24, enemyH = 16
let enemyX = new Array(30), enemyY = new Array(30), enemyV = new Array(30), enemyAlive = new Array(30), enemyCount = new Array(30)

// enemyShot変数
let enemyShotW = 8, enemyShotH = 16
let enemyShotX = new Array(30), enemyShotY = new Array(30), enemyShotV = new Array(30)

// wall変数
let wallW = 32, wallHP = new Array(5)
let wallX = new Array(5), wallY = new Array(5)

// スコア変数
let score, bestScore = 0

function main () {
  switch(scene) {
    case 'TITLE':
      title()
      break
    case 'GAME':
      game()
      break
    case 'GAMEOVER':
      gameover()
      break
    case 'GAMECLEAR':
      gameclear()
      break
  }
}

function title () {
  // 画面をリセット
  drawBack('rgb(0,0,0)')

  // 文字列INVADERを描画
  ctx.fillStyle = 'rgb(255,255,255)'
  ctx.fillText('INVADER', WIDTH / 2, HEIGHT / 2)

  // spaceが押されたとき
  if(spaceKeyOnce()) {
    reset()
    scene = 'GAME'
  }
}

function reset () {
  playerX = WIDTH / 2 - playerW / 2
  playerY = HEIGHT - playerH
  shotX = 0
  shotY = -100
  score = 0
  for(let i = 0; i < 6; i++) for(let j = 0; j < 5; j++) {
    enemyX[i * 5 + j] = j * 48
    enemyY[i * 5 + j] = i * 32
    enemyV[i * 5 + j] = 2
    enemyAlive[i * 5 + j] = true
    enemyCount[i * 5 + j] = Math.floor(Math.random() * 500)
    enemyShotX[i * 5 + j] = 0
    enemyShotY[i * 5 + j] = HEIGHT + 100
    enemyShotV[i * 5 + j] = 2
  }
  for(let i = 0; i < 5; i++) {
    wallHP[i] = 4
    wallX[i] = 80 - wallW / 2 + i * 80
    wallY[i] = HEIGHT - 64
  }
}

function game () {
  // 画面をリセット
  drawBack('rgb(0,0,0)')

  // playerの処理
  // ←が押されたとき
  if (leftKey()) {
    playerX -= 2
  }
  // →が押されたとき
  if (rightKey()) {
    playerX += 2
  }
  // spaceが押されたとき
  if (spaceKey()) {
    if (shotY < 0) {
      shotX = playerX + playerW / 2 - shotW / 2
      shotY = playerY
    }
  }
  if (playerX < 0) {
    playerX = 0
  }
  if (playerX > WIDTH) {
    playerX = WIDTH
  }
  // enemyShotと衝突したとき
  for(let i = 0; i < 30; i++) {
    if (playerX < enemyShotX[i] + enemyShotW && enemyShotX[i] < playerX + playerW) {
      if (playerY < enemyShotY[i] + enemyShotH && enemyShotY[i] < playerY + playerH) {
        scene = 'GAMEOVER'
      }
    }
  }
  ctx.drawImage(IMG['Player'], playerX, playerY)

  // playerのshotの処理
  // 画面内にいるとき
  if (shotY + shotH > 0) {
    shotY += shotV
  }
  ctx.drawImage(IMG['Shot'], shotX, shotY)

  // 敵の処理

  let enemyRight = false, enemyLeft = false, enemyNumber = 0

  for(let i = 0; i < 30; i++) {
    if (enemyAlive[i]) {
      enemyNumber++
      enemyX[i] += enemyV[i]
      // 右の壁に接触したとき
      if (enemyX[i] + enemyW + enemyV[i] > WIDTH) {
        enemyRight = true
      }
      // 左の壁に接触したとき
      if (enemyX[i] + enemyV[i] < 0) {
        enemyLeft = true
      }
      // shotと衝突したとき
      if (enemyX[i] < shotX + shotW && shotX < enemyX[i] + enemyW) {
        if (enemyY[i] < shotY + shotH && shotY < enemyY[i] + enemyH) {
          enemyAlive[i] = false
          shotY = -shotH
          score += enemyY[i] * enemyY[i]
        }
      }
      enemyCount[i]--
      if(enemyCount[i] === 0) {
        enemyCount[i] = 200 + Math.floor(Math.random() * 200)
        enemyShotX[i] = enemyX[i] + enemyW / 2 - enemyShotW / 2
        enemyShotY[i] = enemyY[i]
      }
      ctx.drawImage(IMG['Enemy'], enemyX[i], enemyY[i])
    }
  }

  // 敵のいずれかが右の壁に近いとき
  if (enemyRight) {
    for(let i = 0; i < 30; i++) {
      enemyV[i] = -enemyV[i]
      enemyY[i] += 2
    }
  }
  // 敵のいずれかが左の壁に近いとき
  if (enemyLeft) {
    for(let i = 0; i < 30; i++) {
      enemyV[i] = -enemyV[i]
      enemyY[i] += 2
    }
  }
  // 敵の数が0体のとき
  if(enemyNumber === 0) {
    scene = 'GAMECLEAR'
    // ベストスコアよりも今のスコアが大きかったら更新する
    if(bestScore < score) {
      bestScore = score
    }
  }

  // 敵の弾の処理

  for(let i = 0; i < 30; i++) {
    // 画面内にいるとき
    if(enemyShotY[i] <= HEIGHT) {
      enemyShotY[i] += enemyShotV[i]
    }
    ctx.drawImage(IMG['EnemyShot'], enemyShotX[i], enemyShotY[i])
  }

  // 壁の処理
  for(let i = 0; i < 5; i++) {
    // wallがあるとき
    if(wallHP[i] > 0) {
      // shotと衝突したとき
      if (wallX[i] < shotX + shotW && shotX < wallX[i] + wallW) {
        if (wallY[i] < shotY + shotH && shotY < wallY[i] + wallHP[i] * 4) {
          shotY = -shotH
          wallHP[i]--
        }
      }

      // enemyShotと衝突したとき
      for(let j = 0; j < 30; j++) {
        if (wallX[i] < enemyShotX[j] + enemyShotW && enemyShotX[j] < wallX[i] + wallW) {
          if (wallY[i] < enemyShotY[j] + enemyShotH && enemyShotY[j] < wallY[i] + wallHP[i] * 4) {
            enemyShotY[j] = HEIGHT + 100
            wallHP[i]--
          }
        }
      }

      ctx.fillStyle = 'rgb(255,255,255)'
      ctx.fillRect(wallX[i], wallY[i], wallW, wallHP[i] * 4)
    }
  }
}

function gameover () {
  // 画面をリセット
  drawBack('rgb(0,0,0)')

  // 文字列GAME OVERを描画
  ctx.fillStyle = 'rgb(255,255,255)'
  ctx.fillText('GAME OVER', WIDTH / 2, HEIGHT / 2)

  // spaceが押されたとき
  if(spaceKeyOnce()) {
    scene = 'TITLE'
  }
}

function gameclear () {
  // 画面をリセット
  drawBack('rgb(0,0,0)')

  // 文字列GAME CLEARを描画
  ctx.fillStyle = 'rgb(255,255,255)'
  ctx.fillText('GAME CLEAR', WIDTH / 2, HEIGHT / 2)

  ctx.fillText('BEST SCORE : ' + bestScore, 400, 20)

  // spaceが押されたとき
  if(spaceKeyOnce()) {
    scene = 'TITLE'
  }
}

function drawBack (color) {
  ctx.fillStyle = color
  ctx.fillRect(0, 0, WIDTH, HEIGHT)
}
