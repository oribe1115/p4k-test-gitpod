let canvas, ctx
let WIDTH = 480, HEIGHT = 320
let IS_KEY_PRESSED_BEFORE = {}
let IS_KEY_PRESSED = {}

// キーイベントコールバック関数
function keyDown (event) {
  IS_KEY_PRESSED[event.key] = true
}

function keyUp (event) {
  IS_KEY_PRESSED[event.key] = false
}

function keyPressed (key) {
  return IS_KEY_PRESSED[key]
}

function keyPressedOnce (key) {
  return IS_KEY_PRESSED[key] && !IS_KEY_PRESSED_BEFORE[key]
}

function spaceKey () {
  return keyPressed(' ')
}

function enterKey () {
  return keyPressed('Enter')
}

function spaceKeyOnce () {
  return keyPressedOnce(' ')
}

function enterKeyOnce () {
  return keyPressedOnce('Enter')
}

function leftKey () {
  return keyPressed('ArrowLeft')
}

function rightKey () {
  return keyPressed('ArrowRight')
}

function upKey () {
  return keyPressed('ArrowUp')
}

function downKey () {
  return keyPressed('ArrowDown')
}

// 初期化処理
function _init () {
  canvas = document.getElementById('canvas')
  if (!canvas || !canvas.getContext) return
  ctx = canvas.getContext('2d')

  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.imageSmoothingEnabled = false
  ctx.font = '28px monospace'

  window.addEventListener('keydown', keyDown, true)
  window.addEventListener('keyup', keyUp, true)

  if (window.init) {
    window.init()
  }

  setTimeout(function () {
    if (window.main) {
      setInterval(() => {
        main()

        for (const key in IS_KEY_PRESSED) {
          IS_KEY_PRESSED_BEFORE[key] = IS_KEY_PRESSED[key]
        }
      }, 1000 / 60)
    }
  }, 10)
}

window.onload = _init
