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
let enemy = {}
enemy.alive = true
enemy.w = 24
enemy.h = 16
enemy.x = 0
enemy.y = 0
enemy.v = 2
enemy.count = 300
// 弾用のオブジェクト
let shot = {}
shot.w = 8
shot.h = 16
shot.x = 0
shot.y = -100
shot.v = -8
// 敵の弾用のオブジェクト
let enemyShot = {}
enemyShot.w = 8
enemyShot.h = 16
enemyShot.x = 0
enemyShot.y = HEIGHT + 100
enemyShot.v = 2
// 障害物用のオブジェクト
let wall = {}
wall.w = 32
wall.hp = 4
wall.x = WIDTH / 2 - wall.w / 2
wall.y = HEIGHT - 64
function game () {
  SE['BGM'].play()

  ctx.clearRect(0, 0, WIDTH, HEIGHT)
  ctx.fillStyle = 'black'
  ctx.fillRect(0, 0, WIDTH, HEIGHT)

  // 敵の弾の描画
  ctx.drawImage(IMG['EnemyShot'], enemyShot.x, enemyShot.y)
  // 敵の描画
  if (enemy.alive) {
    ctx.drawImage(IMG['Enemy'], enemy.x, enemy.y)
  }
  // 弾の描画
  ctx.drawImage(IMG['Shot'], shot.x, shot.y)
  // プレイヤーの描画
  ctx.drawImage(IMG['Player'], player.x, player.y)
  // 障害物の描画
  ctx.fillStyle = 'green'
  ctx.fillRect(wall.x, wall.y, wall.w, wall.hp * 4)

  // 障害物の処理
  if (wall.hp > 0) {
    // 弾と接触したとき
    if (wall.x < shot.x + shot.w && shot.x < wall.x + wall.w) {
      if (wall.y < shot.y + shot.h && shot.y < wall.y + wall.hp * 4) {
        shot.y = -100
        wall.hp -= 1
      }
    }
    // 敵の弾と接触したとき
    if (wall.x < enemyShot.x + enemyShot.w &&
          enemyShot.x < wall.x + wall.w) {
      if (wall.y < enemyShot.y + enemyShot.h &&
            enemyShot.y < wall.y + wall.hp * 4) {
        enemyShot.y = HEIGHT + 100
        wall.hp -= 1
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
  if (enemyShot.y < HEIGHT) {
    // 敵の弾の移動
    enemyShot.y += enemyShot.v
  }

  if (enemy.alive) {
    // 敵を移動
    enemy.x += enemy.v
    // 右の壁に接触したとき
    if (enemy.x > WIDTH - enemy.w) {
      enemy.x = WIDTH - enemy.w
      enemy.y += 4
      enemy.v = -2
    }
    // 左の壁に接触したとき
    if (enemy.x < 0) {
      enemy.x = 0
      enemy.y += 4
      enemy.v = 2
    }
    // 弾と衝突したとき
    if (collide(enemy, shot)) {
      // 被弾音を鳴らす
      SE['Hit'].play()

      // シーンをゲームクリアにする
      scene = 'GAMECLEAR'
      enemy.alive = false
      shot.y = -100
    }

    // 一定間隔で弾を撃つ
    enemy.count -= 1
    if (enemy.count === 0) {
      enemy.count = 300
      enemyShot.x = enemy.x + enemy.w / 2 - enemyShot.w / 2
      enemyShot.y = enemy.y

      // 発射音を鳴らす
      SE['Shot2'].play()
    }
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
  if (collide(player, enemyShot)) {
    // シーンをゲームオーバーにする
    scene = 'GAMEOVER'
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
  enemy.x = 0
  enemy.y = 0
  enemy.v = 2
  enemy.alive = true
  enemy.count = 300
  // 敵の弾の初期化
  enemyShot.x = 0
  enemyShot.y = HEIGHT + 100
  // 障害物の初期化
  wall.hp = 4
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
