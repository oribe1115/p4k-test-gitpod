// 画像のための変数
let IMG = {}
IMG['Player'] = new Image()
IMG['Player'].src = 'img/player.png'
IMG['Shot'] = new Image()
IMG['Shot'].src = 'img/shot.png'
IMG['Enemy'] = new Image()
IMG['Enemy'].src = 'img/enemy.png'
IMG['EnemyShot'] = new Image()
IMG['EnemyShot'].src = 'img/enemyShot.png'
// 音のための変数
let SE = {}
SE['Shot'] = new Audio()
SE['Shot'].src = 'se/shot.mp3'
SE['Shot'].volume = 0.5
SE['Shot'].playbackRate = 2 // 2倍速で再生する
SE['Shot2'] = new Audio()
SE['Shot2'].src = 'se/shot2.mp3'
SE['Shot2'].volume = 0.5
SE['Shot2'].playbackRate = 2 // 2倍速で再生する
SE['Hit'] = new Audio()
SE['Hit'].src = 'se/hit.mp3'
SE['Hit'].volume = 0.5
SE['Hit'].playbackRate = 2 // 2倍速で再生する
SE['Press'] = new Audio()
SE['Press'].src = 'se/press.mp3'
SE['Press'].volume = 0.5
SE['BGM'] = new Audio()
SE['BGM'].src = 'se/bgm_s.mp3'
SE['BGM'].volume = 0.5

// BGMが終わったら、BGMをループ用に変更する
SE['BGM'].addEventListener('ended', function() {
  SE['BGM'].pause()
  SE['BGM'].src = 'se/bgm_l.mp3'
  SE['BGM'].loop = true
})

// シーンの変数
let scene = 'TITLE'
// プレイヤー用のオブジェクト
let player = {}
player.w = 24
player.h = 16
player.x = 0
player.y = HEIGHT - player.h
// 敵用のオブジェクト
let enemy = new Array(5)
// 弾用のオブジェクト
let shot = {}
shot.w = 8
shot.h = 16
shot.x = 0
shot.y = -100
shot.v = -8
// 敵の弾用のオブジェクト
let enemyShot = new Array(5)
// 障害物用のオブジェクト
let wall = new Array(5)
function game () {
  SE['BGM'].play()

  ctx.clearRect(0, 0, WIDTH, HEIGHT)
  ctx.fillStyle = 'black'
  ctx.fillRect(0, 0, WIDTH, HEIGHT)

  // 敵の弾の描画
  for (let i = 0; i < 5; i += 1) {
    ctx.drawImage(IMG['EnemyShot'], enemyShot[i].x, enemyShot[i].y)
  }
  // 敵の描画
  for (let i = 0; i < 5; i += 1) {
    if (enemy[i].Alive) {
      ctx.drawImage(IMG['Enemy'], enemy[i].x, enemy[i].y)
    }
  }
  // 弾の描画
  ctx.drawImage(IMG['Shot'], shot.x, shot.y)
  // プレイヤーの描画
  ctx.drawImage(IMG['Player'], player.x, player.y)
  // 障害物の描画
  for (let i = 0; i < 5; i += 1) {
    ctx.fillStyle = 'green'
    ctx.fillRect(wall[i].x, wall[i].y, wall[i].w, wall[i].hp * 4)
  }

  // 障害物の処理
  for (let i = 0; i < 5; i += 1) {
    if (wall[i].hp > 0) {
      // 弾と接触したとき
      if (wall[i].x < shot.x + shot.w &&
            shot.x < wall[i].x + wall[i].w) {
        if (wall[i].y < shot.y + shot.h &&
              shot.y < wall[i].y + wall[i].hp * 4) {
          shot.y = -100
          wall[i].hp -= 1
        }
      }
      // 敵の弾と接触したとき
      for (let j = 0; j < 5; j += 1) {
        if (wall[i].x < enemyShot[j].x + enemyShot[j].w &&
            enemyShot[j].x < wall[i].x + wall[i].w) {
          if (wall[i].y < enemyShot[j].y + enemyShot[j].h &&
            enemyShot[j].y < wall[i].y + wall[i].hp * 4) {
            enemyShot[j].y = HEIGHT + 100
            wall[i].hp -= 1
          }
        }
      }
    }
  }

  // 弾が発射されているとき
  if (shot.y + shot.h > 0) {
    // 弾の移動
    shot.y += shot.v
  } else { // 弾が発射されていないとき
    // スペースキーが押されたとき
    if (spaceKey()) {
      shot.x = player.x + player.w / 2 - shot.w / 2
      shot.y = player.y

      // 発射音を鳴らす
      SE['Shot'].play()
    }
  }

  // 敵の弾が発射されているとき
  for (let i = 0; i < 5; i += 1) {
    if (enemyShot[i].y < HEIGHT) {
      // 敵の弾の移動
      enemyShot[i].y += enemyShot[i].v
    }
  }

  let enemyLeft = false, enemyRight = false, enemyNum = 0
  for (let i = 0; i < 5; i += 1) {
    if (enemy[i].Alive) {
      enemyNum += 1
      // 敵を移動
      enemy[i].x += enemy[i].v
      // 右の壁に接触したとき
      if (enemy[i].x > WIDTH - enemy[i].w) {
        enemyRight = true
      }
      // 左の壁に接触したとき
      if (enemy[i].x < 0) {
        enemyLeft = true
      }
      // 弾と衝突したとき
      if (collide(enemy[i], shot)) {
        // 被弾音を鳴らす
        SE['Hit'].play()

        enemy[i].Alive = false
        shot.y = -100
      }

      // 一定間隔で弾を撃つ
      enemy[i].count -= 1
      if (enemy[i].count === 0) {
        enemy[i].count = 300
        enemyShot[i].x = enemy[i].x + enemy[i].w / 2 - enemyShot[i].w / 2
        enemyShot[i].y = enemy[i].y

        // 発射音を鳴らす
        SE['Shot2'].play()
      }
    }
  }
  if (enemyLeft) {
    for (let i = 0; i < 5; i += 1) {
      enemy[i].v = 2
      enemy[i].y += 5
    }
  }
  if (enemyRight) {
    for (let i = 0; i < 5; i += 1) {
      enemy[i].v = -2
      enemy[i].y += 5
    }
  }
  if (enemyNum === 0) {
    scene = 'GAMECLEAR'
  }

  // 右が押されているとき
  if (rightKey()) {
    player.x += 2
  }
  // 左が押されているとき
  if (leftKey()) {
    player.x -= 2
  }
  // 左の壁に接触したとき
  if (player.x < 0) {
    player.x = 0
  }
  // 右の壁に接触したとき
  if (player.x > WIDTH - player.w) {
    player.x = WIDTH - player.w
  }
  // 敵の弾と接触したとき
  for (let i = 0; i < 5; i += 1) {
    if (collide(player, enemyShot[i])) {
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

    // ボタンを押した音を鳴らす
    SE['Press'].play()
  }
}

function gameover () {
  ctx.clearRect(0, 0, WIDTH, HEIGHT)
  // 画面を黒く
  ctx.fillStyle = 'black'
  ctx.fillRect(0, 0, WIDTH, HEIGHT)

  // 音楽を停止
  SE['BGM'].pause()
  SE['BGM'].currentTime = 0
  SE['BGM'].src = 'se/bgm_s.mp3'

  // 「GAMEOVER」を描画
  ctx.fillStyle = 'white'
  ctx.fillText('GAMEOVER', WIDTH / 2, HEIGHT / 2)

  // スペースキーが押されたとき
  if (spaceKeyOnce()) {
    // シーンをタイトルにする
    scene = 'TITLE'

    // ボタンを押した音を鳴らす
    SE['Press'].play()
  }
}

function gameclear () {
  ctx.clearRect(0, 0, WIDTH, HEIGHT)
  // 画面を黒く
  ctx.fillStyle = 'black'
  ctx.fillRect(0, 0, WIDTH, HEIGHT)

  // 音楽を停止
  SE['BGM'].pause()
  SE['BGM'].currentTime = 0
  SE['BGM'].src = 'se/bgm_s.mp3'

  // 「GAMECLEAR」を描画
  ctx.fillStyle = 'white'
  ctx.fillText('GAMECLEAR', WIDTH / 2, HEIGHT / 2)

  // スペースキーが押されたとき
  if (spaceKeyOnce()) {
    // シーンをタイトルにする
    scene = 'TITLE'

    // ボタンを押した音を鳴らす
    SE['Press'].play()
  }
}

function reset () {
  // プレイヤーの初期位置
  player.x = WIDTH / 2 - player.w / 2
  player.y = HEIGHT - player.h
  // 弾の初期化
  shot.x = 0
  shot.y = -100
  // 敵の初期化
  for (let i = 0; i < 5; i += 1) {
    enemy[i] = {}
    enemy[i].w = 24
    enemy[i].h = 16
    enemy[i].x = i * 50
    enemy[i].y = 0
    enemy[i].v = 2
    enemy[i].Alive = true
    enemy[i].count = 300
  }
  // 敵の弾の初期化
  for (let i = 0; i < 5; i += 1) {
    enemyShot[i] = {}
    enemyShot[i].w = 8
    enemyShot[i].h = 16
    enemyShot[i].x = 0
    enemyShot[i].y = HEIGHT + 100
    enemyShot[i].v = 2
  }
  // 障害物の初期化
  for (let i = 0; i < 5; i += 1) {
    wall[i] = {}
    wall[i].w = 32
    wall[i].x = WIDTH / 2 - wall[i].w / 2 - 200 + i * 100
    wall[i].y = HEIGHT - 64
    wall[i].hp = 4
  }
}

// 当たり判定の関数
function collide (obj1, obj2) {
  if (obj1.x < obj2.x + obj2.w && obj2.x < obj1.x + obj1.w) {
    if (obj1.y < obj2.y + obj2.h && obj2.y < obj1.y + obj1.h) {
      return true
    }
  }
  return false
}
