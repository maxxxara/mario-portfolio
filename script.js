var canvas = document.getElementById("canvas")
var screenW = window.innerWidth
var screenH = window.innerHeight
canvas.width = screenW
canvas.height = screenH
var ctx = canvas.getContext("2d")
var scrollCount = 0
var scrollCountLink = 0
var currentPage = null
var playerFrameCount = 0
function createImage(src) {
    var image = new Image()
    image.src = src
    return image
}

// player with movement and gravity
class Player {
    constructor({velocity}) {
        this.width = 34
        this.height = 64
        this.position = {
            x: 300,
            y: screenH - this.height
        }
        this.velocity = velocity
        this.image = createImage("./images/playerstandright.png")
        this.cropWidth = 256
        this.frames = 15
        this.imageWidth = 96
    }
    draw() {
        
        ctx.drawImage(
            this.image,
            this.cropWidth * playerFrameCount,
            0,
            this.imageWidth,
            180,
            this.position.x,
            this.position.y,
            this.width,
            this.height
        )
    }
    update() {
        this.draw()
        this.position.y += this.velocity.y
        // gravity
        if(this.position.y + this.height + this.velocity.y <= screenH) {
            this.velocity.y += 2            
        } else {
            this.velocity.y = 0
        }
        // !gravity
        this.position.x += this.velocity.x
    }
}


class Platform {
    constructor(x, y, width, height, word, image) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.word = word
        this.image = image
    }
    draw() {

        var word = this.word.split("")
        var word = word.reverse()

        ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
        ctx.font = 'bold 32px marioFont';
        ctx.strokeStyle = 'red';
        ctx.textAlign = "center"
        ctx.lineWidth = 1;
        for(var i = word.length; i > 0; i--) {
            ctx.fillText(word[i - 1], this.x + this.width / 2, this.y - (i * 32) );
        }
        ctx.restore()
    }
    update() {
        this.draw()
    }
}

class Enemy {
    constructor(image, x, y, width, height) {
        this.image = image
        this.x = x
        this.y = y
        this.width = width
        this.height = height
    }
    draw() {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
    }
}

class AdditionalObject {
    constructor(image, x, y, width, height) {
        this.width = width
        this.height = height
        this.image = image
        this.x = x
        this.y = y
    }

    draw() {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
    }
}

class Link {
    constructor(x, y, image, link, show) {
        this.width = 300
        this.height = 160
        this.x = x
        this.y = y
        this.image = image
        this.link = link
        this.blockImage = createImage("./images/block.png")
        this.show = show
    }
    draw() {
        let blockSize = 20
        if(this.show == true) {
        // top and botside blocks
        for(var i = 0; i < 15; i++) {
            ctx.fillStyle = 'orange';
            ctx.drawImage(this.blockImage, this.x + blockSize * i, this.y - blockSize, blockSize, blockSize)
        }
        for(var i = 0; i < 15; i++) {
            ctx.fillStyle = 'orange';
            ctx.drawImage(this.blockImage, this.x + blockSize * i, this.y + this.height, blockSize, blockSize)
        }
        // right and left side blocks
        for(var i = 0; i < 8; i++) {
            ctx.fillStyle = 'blue';
            ctx.drawImage(this.blockImage, this.x + this.width, this.y + i * blockSize, blockSize, blockSize)
        }
        for(var i = 0; i < 8; i++) {
            ctx.fillStyle = 'blue';
            ctx.drawImage(this.blockImage, this.x - blockSize, this.y + i * blockSize, blockSize, blockSize)
        }
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
        } 
    }
    update() {
        this.draw()
    }
}

class Text {
    constructor(x, y, text) {
        this.x = x
        this.y = y
        this.text = text
    }
    draw() {
        ctx.fillStyle = '#E52521'
        ctx.font = 'bold 12px marioFont';
        ctx.fillText(this.text,  this.x, this.y)
    }
}



// init classes
var player = new Player({
    velocity: {
        x: 0,
        y: -30
    }
})
var platforms = [
    new Platform(0, screenH - 76, 5000, 76, "", createImage("./images/grass.png")),
    new Platform(600, screenH - 88 - 76, 52, 88, "Games", createImage("./images/platform1.png")),
    new Platform(800, screenH - 88 - 76, 52, 88, "Markup", createImage("./images/platform1.png")),
    new Platform(1000, screenH - 88 - 76, 52, 88, "React", createImage("./images/platform1.png")),
]
var additionalObjects = [
    new AdditionalObject(createImage("./images/bg1.png"), 0, 0, screenW, screenH),
    new AdditionalObject(createImage("./images/cloud.png"), 500, 300, 48, 16),
    new AdditionalObject(createImage("./images/cloud.png"), 400, 240, 48, 16),
    new AdditionalObject(createImage("./images/cloud.png"), 800, 200, 48, 16),
    new AdditionalObject(createImage("./images/cloud.png"), 600, 270, 48, 16),
    new AdditionalObject(createImage("./images/star.png"), 800, 90, 14, 14),
    new AdditionalObject(createImage("./images/star.png"), 500, 270, 14, 14),
    new AdditionalObject(createImage("./images/star.png"), 900, 100, 14, 14),
    new AdditionalObject(createImage("./images/plant.png"), 100, screenH - 51 - 76, 21, 51),
    new AdditionalObject(createImage("./images/plant.png"), 900, screenH - 51 - 76, 21, 51),
    new AdditionalObject(createImage("./images/plant.png"), 500, screenH - 51 - 76, 21, 51),
    new AdditionalObject(createImage("./images/plant.png"), 600, screenH - 51 - 76, 21, 51),
    new AdditionalObject(createImage("./images/plant.png"), 700, screenH - 51 - 76, 21, 51),
    new AdditionalObject(createImage("./images/plant.png"), 200, screenH - 51 - 76, 21, 51),
]



// keyboard events
var lastKey = ''
var keys = {
    top: {
        pressed: false
    },
    right: {
        pressed: false
    },
    left: {
        pressed: false
    }
}
window.addEventListener('keydown', (e) => {
    switch(e.code) {
        case "KeyW":
            console.log("W")
            keys.top.pressed = true
            break
        case "KeyD":
            keys.right.pressed = true
            break
        case "KeyA":
            keys.left.pressed = true
            break
    } 
})
window.addEventListener('keyup', (e) => {
    switch(e.code) {
        case "KeyW":
            keys.top.pressed = false
            break
        case "KeyD":
            keys.right.pressed = false
            lastKey = 'right'
            break
        case "KeyA":
            keys.left.pressed = false
            lastKey = 'left'
            break
    } 
})
// !keyboard events

var welcomeTexts = [
    new Text(150, 100, "მოგესალმებით ჩემს პორტფოლიოში!"),
    new Text(207, 130, "გადასაადგილებლად გამოიყენეთ ღილაკები 'W' 'A' 'S' 'D'."),
    new Text(202, 160, "მთავარ გვერდზე დასაბრუნებლად შეეხეთ მონსტრებს.")
]

function InitAdditionalObjects(img, count) {
    additionalObjects.forEach((additionalObject, i) => {
        if(i == 0) {
            additionalObject.image = img
        }
        additionalObject.draw()
    })
    
    additionalObjects.forEach((additionalObject, i) => {
        if(i !== 0) {
            if(player.position.x >= 400 && keys.right.pressed && scrollCount <= count) {
                additionalObject.x -= 2
            } else if(player.position.x <= 100 && keys.left.pressed && scrollCount > 0) {
                additionalObject.x += 2
            }
        }
    })
}

function sprite() {
    if(keys.right.pressed) {
        player.image = createImage("./images/playerrunright.png")
        player.cropWidth = 256
        player.imageWidth = 96
        player.frames = 9
    }
    if(keys.left.pressed) {
        player.image = createImage("./images/playerrunleft.png")
        player.cropWidth = 256
        player.imageWidth = 96
        player.frames = 9
    }
    if(lastKey == 'left' && keys.right.pressed == false && keys.left.pressed == false) {
        player.image = createImage("./images/playerstandleft.png")
        player.cropWidth = 256
        player.frames = 15
        playerFrameCount = 1
    }
    if(lastKey == 'right' && keys.right.pressed == false && keys.left.pressed == false) {
        playerFrameCount = 1
        player.image = createImage("./images/playerstandright.png")
        player.cropWidth = 256
        player.frames = 15
    }

    if(playerFrameCount == player.frames) {
        playerFrameCount = 0
    }
    playerFrameCount++
}

// main function
function init() {


    
    InitAdditionalObjects(createImage("./images/bg1.png"), 3000)

    // collision detection between player and platforms
    platforms.forEach((platform, i) => {
        if(i !== 0) {
            platform.draw()
            if(player.position.y + player.height <= platform.y 
                && player.position.y + player.height + player.velocity.y >= platform.y
                && player.position.x + player.width >= platform.x
                && player.position.x <= platform.x + platform.width) {
                player.velocity.y = 0
                currentPage = platform.word
            }
        } else {
            if(player.position.y + player.height <= platform.y
                && player.position.y + player.height + player.velocity.y >= platform.y) {
                player.velocity.y = 0
            }
        }
    })
    // !collision detection between player and platforms
  

    if(keys.top.pressed) {
        player.velocity.y = -20
    }

    
   

    // player movement & background scroll
 
    platforms.forEach(platform => {    
        if(player.position.x < 400 && keys.right.pressed) {
            player.velocity.x = 5
        } else if(player.position.x > 100 && keys.left.pressed) {
            player.velocity.x = -5
        } else {
            player.velocity.x = 0
            if(keys.right.pressed && scrollCount <= 3000) {
                platform.x -= 5
                scrollCount += 5
            } else if(keys.left.pressed && scrollCount > 0) {
                platform.x += 5
                scrollCount -= 5
            }
        }
    })
    // !player movement & background scroll

    // draw classes
    platforms.forEach(platform => {
        platform.update()
    })

    sprite()

    welcomeTexts.forEach(t => {
        t.draw()
    })
    player.update()
    
    
}
// !main function


var c = 0
var back = new Platform(200, screenH - 42 - 76, 34, 42, "", createImage("./images/enemy1.png"))
var links = [
    new Link(200, 200, createImage("./images/landing1.jpg"), "sdasd.com", true),
    new Link(600, 200, createImage("./images/landing2.png"),"aaa.com", true),
    new Link(1000, 200, createImage("./images/landing1.jpg"),"aaa.com", true),
    new Link(1400, 200, createImage("./images/landing1.jpg"),"aaa.com", false),
]
function page(p) {

    InitAdditionalObjects(createImage("./images/bg2.png"), 200)


    if(p == "Games") {
        var t1 = new Text(100, 100, "Games")
        t1.draw()
        links[0].image = createImage("./portfolio/Guess.JPG")     
        links[0].link = "https://harmonious-marshmallow-ef84ad.netlify.app/"
        links[1].image = createImage("./portfolio/pacman.png")     
        links[1].link = "https://maxxxara.github.io/pacman/"
        links[2].image = createImage("./portfolio/pingpong.png")
        links[2].link = "https://maxxxara.github.io/pingpong/"     
        links[3].show = true
        links[3].image = createImage("./portfolio/Memory-2.JPG")
        links[3].link = "https://starlit-frangipane-7a5879.netlify.app/"
    } else if (p == "Markup") {
        var t1 = new Text(100, 100, "Markup")
        t1.draw()
        links[0].image = createImage("./portfolio/JobBoard.JPG")
        links[0].link = "https://maxxxara.github.io/JobBoard/"
        links[1].image = createImage("./portfolio/Landing.png")
        links[1].link = "https://maxxxara.github.io/landing-2/"
        links[2].show = false
    } else if (p == "React") {
        var t1 = new Text(100, 100, "React")
        t1.draw()
        links[0].image = createImage("./portfolio/Advice.JPG")
        links[0].link = "https://maxxxara.github.io/advice/"
        links[1].image = createImage("./portfolio/githubApi.JPG")
        links[1].link = "https://maxxxara.github.io/github-api/"
        links[2].image = createImage("./portfolio/Todo.JPG")
        links[2].link = "https://statuesque-syrniki-353ade.netlify.app/"
    }

    platforms.forEach((platform, i) => {
        if(i == 0) {
            platform.draw()
            if(player.position.y + player.height <= platform.y
                && player.position.y + player.height + player.velocity.y >= platform.y) {
                player.velocity.y = 0
            }
        } 
    })
    

    sprite()

    links.forEach(link => {
        link.draw()
    })
    
    back.update()
    if(keys.top.pressed) {
        player.velocity.y = -20
    }

    if(keys.right.pressed) {
        player.velocity.x = 5
    } else if(keys.left.pressed) {
        player.velocity.x = -5
    } else {
        player.velocity.x = 0
    }


    
    links.forEach(link => {
        if(player.position.x < 400 && keys.right.pressed) {
            player.velocity.x = 5
        } else if(player.position.x > 100 && keys.left.pressed) {
            player.velocity.x = -5
        } else {
            player.velocity.x = 0
            if(keys.right.pressed && scrollCountLink <= 3800) {
                console.log(link)
                link.x -= 5
                back.x -= 2
                scrollCountLink += 4
            } else if(keys.left.pressed && scrollCountLink > 0) {
                back.x += 2
                link.x += 5
                scrollCountLink -= 4
            }
        }
    })

    links.forEach(link => {
        if(player.position.x + player.width >= link.x &&
            player.position.x <= link.x + link.width &&
            player.position.y + player.height >= link.y &&
            player.position.y <= link.y + link.height && link.show) {
                window.open(link.link, "_blank")
                keys.right.pressed = false
                keys.left.pressed = false
                player.position.y = screenH - 150
            }
    })
    if(player.position.x + player.width >= back.x &&
        player.position.x <= back.x + back.width &&
        player.position.y + player.height >= back.y &&
        player.position.y <= back.y + back.height) {
            links[3].show = false
            links[2].show = true
            player.velocity.y = 0
            player.position.y = 10
            currentPage = null
    }
    player.update()

}


function animate() {
    requestAnimationFrame(animate)
    ctx.clearRect(0, 0, screenW, screenH)
    if(currentPage == null) {
        init()
    } else if(currentPage != null){
        page(currentPage)
    }
  

}
animate()
