const sprites = new Image()
sprites.src = './sprites.png'

const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')


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
    ctx.fillRect(0,0, canvas.width, canvas.height)

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

// [Chao]
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
}

const flappyBird = {
  spriteX: 0,
  spriteY: 0,
  largura: 33,
  altura: 24,
  x: 10,
  y: 50,
	gravidade: 0.25,
	velocidade: 0,
  updateSprite(){
		flappyBird.velocidade = flappyBird.velocidade + flappyBird.gravidade
		flappyBird.y = flappyBird.y + flappyBird.velocidade
  },
  draw() {
    ctx.drawImage(
      sprites,
      flappyBird.spriteX, flappyBird.spriteY, // Sprite X, Sprite Y
      flappyBird.largura, flappyBird.altura, // Tamanho do recorte na sprite
      flappyBird.x, flappyBird.y,
      flappyBird.largura, flappyBird.altura,
    )
  }
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

let activeScreen = {}
function changeScreen(screen) {
  activeScreen = screen
}

const screens =  {
  START: {
    draw() {
      planoDeFundo.draw()
      chao.draw()
      flappyBird.draw()
      getReadyMessage.draw()

    },
    action() {
      changeScreen(screens.GAME)
    },
    update() {
      
    }
  }
}

screens.GAME = {
  draw() {
    planoDeFundo.draw()
    chao.draw()
    flappyBird.draw()
  },
  update() {
    flappyBird.updateSprite()
  }
}

function loop() {
  activeScreen.draw()
  activeScreen.update()

  requestAnimationFrame(loop)
}

window.addEventListener('keyup', function(e) {
  if (e.key == ' ') {
    if(activeScreen.action) {
      activeScreen.action()
    }
  }
})

changeScreen(screens.START)
loop()