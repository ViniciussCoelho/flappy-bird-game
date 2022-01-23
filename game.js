const sprites = new Image()
sprites.src = './sprites.png'

let frames = 0
const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

const hitSound = new Audio()
hitSound.src = './soundEffects/hit.wav'
const jumpSound = new Audio()
jumpSound.src = './soundEffects/pulo.wav'

// [Plano de Fundo]
const planoDeFundo = {
  spriteX: 390,
  spriteY: 0,
  largura: 275,
  altura: 204,
  x: 0,
  y: canvas.height - 204,
  draw() {
    ctx.fillStyle = '#70c5ce'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.drawImage(
      sprites,
      planoDeFundo.spriteX, planoDeFundo.spriteY,
      planoDeFundo.largura, planoDeFundo.altura,
      planoDeFundo.x, planoDeFundo.y,
      planoDeFundo.largura, planoDeFundo.altura,
    )

    ctx.drawImage(
      sprites,
      planoDeFundo.spriteX, planoDeFundo.spriteY,
      planoDeFundo.largura, planoDeFundo.altura,
      (planoDeFundo.x + planoDeFundo.largura), planoDeFundo.y,
      planoDeFundo.largura, planoDeFundo.altura,
    )
  },
}

function createPipes() {
  const canos = {
    largura: 52,
    altura: 400,
    chao: {
      spriteX: 0,
      spriteY: 169,
    },
    ceu: {
      spriteX: 52,
      spriteY: 169,
    },
    espaco: 80,
    draw() {
      canos.pares.forEach(function (par) {
        const spaceBetweenPipes = 90
        const random = par.y
        const canoCeuX = par.x
        const canoCeuY = random
        ctx.drawImage(
          sprites,
          canos.ceu.spriteX, canos.ceu.spriteY,
          canos.largura, canos.altura,
          canoCeuX, canoCeuY,
          canos.largura, canos.altura)

        const canoChaoX = par.x;
        const canoChaoY = canos.altura + spaceBetweenPipes + random;
        ctx.drawImage(
          sprites,
          canos.chao.spriteX, canos.chao.spriteY,
          canos.largura, canos.altura,
          canoChaoX, canoChaoY,
          canos.largura, canos.altura,
        )
        par.canoCeu = {
          x: canoCeuX,
          y: canos.altura + canoCeuY
        }
        par.canoChao = {
          x: canoChaoX,
          y: canoChaoY
        }
      })
    },
    collisionWithBird(p) {
      const flappyBirdTop = globals.flappyBird.y
      const flappyBirdBottom = globals.flappyBird.y + globals.flappyBird.altura

      if(globals.flappyBird.x >= p.x) {
        if(flappyBirdTop <= p.canoCeu.y || flappyBirdBottom >= p.canoChao.y) {
          return true
        }
      }
      else return false
    },
    pares: [],
    update() {
      const framesEqual100 = frames % 100 == 0
      if (framesEqual100) {
        canos.pares.push({ x: canvas.width, y: -150 * (Math.random() + 1) })
      }

      canos.pares.forEach(function (par) {
        par.x = par.x - 2

        if(canos.collisionWithBird(par)) {
          changeScreen(screens.START)
        }

        if(par.x + canos.largura <= 0) {
          canos.pares.shift()
        }
      })
    }
  }
  return canos
}


function createGround() {
  const chao = {
    spriteX: 0,
    spriteY: 610,
    largura: 224,
    altura: 112,
    x: 0,
    y: canvas.height - 112,
    draw() {
      ctx.drawImage(
        sprites,
        chao.spriteX, chao.spriteY,
        chao.largura, chao.altura,
        chao.x, chao.y,
        chao.largura, chao.altura,
      )

      ctx.drawImage(
        sprites,
        chao.spriteX, chao.spriteY,
        chao.largura, chao.altura,
        (chao.x + chao.largura), chao.y,
        chao.largura, chao.altura,
      )
    },
    update() {
      const groundMovement = 1
      const repeatGround = chao.largura / 2
      const move = chao.x - groundMovement

      chao.x = move % repeatGround
    }
  }
  return chao
}


function collision(flappyBird, chao) {
  const flappyBirdY = flappyBird.y + flappyBird.altura
  const chaoY = chao.y

  if (flappyBirdY >= chaoY) {
    return true
  }
  else return false
}

function createFlappy() {
  const flappyBird = {
    spriteX: 0,
    spriteY: 0,
    largura: 33,
    altura: 24,
    x: 10,
    y: 50,
    gravidade: 0.25,
    velocidade: 0,
    pulo: 4.6,
    jump() {
      flappyBird.velocidade = flappyBird.velocidade - flappyBird.pulo
    },
    updateSprite() {
      if (collision(flappyBird, globals.chao)) {
        hitSound.play()

        setTimeout(() => {
          changeScreen(screens.START)
        }, 200)
        return
      }
      flappyBird.velocidade = flappyBird.velocidade + flappyBird.gravidade
      flappyBird.y = flappyBird.y + flappyBird.velocidade
    },
    moviments: [
      { spriteX: 0, spriteY: 0 },
      { spriteX: 0, spriteY: 26 },
      { spriteX: 0, spriteY: 52 },
      { spriteX: 0, spriteY: 26 }
    ],
    actualFrame: 0,
    updateFrame() {
      const frameInterval = 10
      const interval = frames % frameInterval === 0
      if (interval) {
        const i = 1
        const aux = i + flappyBird.actualFrame
        const repeatNumber = flappyBird.moviments.length
        flappyBird.actualFrame = aux % repeatNumber
      }
    },
    draw() {
      flappyBird.updateFrame()
      const { spriteX, spriteY } = flappyBird.moviments[flappyBird.actualFrame]

      ctx.drawImage(
        sprites,
        spriteX, spriteY, // Sprite X, Sprite Y
        flappyBird.largura, flappyBird.altura, // Tamanho do recorte na sprite
        flappyBird.x, flappyBird.y,
        flappyBird.largura, flappyBird.altura,
      )
    }
  }
  return flappyBird
}



const getReadyMessage = {
  sX: 134,
  sY: 0,
  w: 174,
  h: 152,
  x: (canvas.width / 2) - 174 / 2,
  y: 50,
  draw() {
    ctx.drawImage(
      sprites,
      getReadyMessage.sX, getReadyMessage.sY, // Sprite X, Sprite Y
      getReadyMessage.w, getReadyMessage.h, // Tamanho do recorte na sprite
      getReadyMessage.x, getReadyMessage.y,
      getReadyMessage.w, getReadyMessage.h,
    )
  }
}

const globals = {}
let activeScreen = {}
function changeScreen(screen) {
  activeScreen = screen
  if (activeScreen.initialize) {
    activeScreen.initialize()
  }
}

const screens = {
  START: {
    initialize() {
      globals.flappyBird = createFlappy()
      globals.chao = createGround()
      globals.canos = createPipes()
    },
    draw() {
      planoDeFundo.draw()
      globals.chao.draw()
      globals.flappyBird.draw()
      getReadyMessage.draw()

    },
    action() {
      changeScreen(screens.GAME)
    },
    update() {
      globals.chao.update()
    }
  }
}

screens.GAME = {
  draw() {
    planoDeFundo.draw()
    globals.chao.draw()
    globals.canos.draw()
    globals.flappyBird.draw()
  },
  action() {
    globals.flappyBird.jump()
  },
  update() {
    globals.canos.update()
    globals.chao.update()
    globals.flappyBird.updateSprite()
  }
}

function loop() {
  activeScreen.draw()
  activeScreen.update()

  frames += 1
  requestAnimationFrame(loop)
}

window.addEventListener('keyup', function (e) {
  if (e.key == ' ') {
    if (activeScreen.action) {
      activeScreen.action()
    }
  }
})

window.addEventListener('click', function (e) {
    if (activeScreen.action) {
      activeScreen.action()
    }
})

changeScreen(screens.START)
loop()