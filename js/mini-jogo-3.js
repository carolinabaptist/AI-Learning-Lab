const DIREITA = "direita";

const ESQUERDA = "esquerda";

const CIMA = "cima";

const CIMA_DIREITA = "cima direita";

const NADA = "nada";

let maxGameDuration = 4*60; // 4 minutes
//maxGameDuration = 5;

// the idea is to be able to change those values in the browser console

let enemy = {
    goomba: []
};

var scrollVal;
var marioPosx;
var marioPosy;
var marioSpeed;
var marioJumpSpeed;
var marioJumpTime;
var marioFacingRight;
var marioWalking;
var marioWalkingTime;
var marioJumping;
var marioJumpingUp;
var marioJumpingTime;
var marioGround;
var marioCycle;
var marioDying;
var marioDyingTime;
var marioWinning;
var marioWinningTime;

var audioPlaying;
var elapsedTime;

function init() {
    scrollVal = 0;
    marioPosx = 200;
    marioPosy = -12.8; // was 0;
    marioSpeed = 600;
    marioJumpSpeed = 1000;
    marioJumpTime = 0.3; // seconds
    marioFacingRight = true;
    marioWalking = false;
    marioWalkingTime = undefined;
    marioJumping = false;
    marioJumpingUp = true;
    marioJumpingTime = undefined;
    marioGround = true;
    marioCycle = 0;
    marioDying = false;
    marioDyingTime = undefined;
    marioWinning = false;
    marioWinningTime = undefined;
    audioPlaying = false;
    elapsedTime = 0;

    goombaInit();
}

init();

var leftPressed = false;
var rightPressed = false;
var upPressed = false;


var webcamLeft = false;
var webcamRight = false;
var webcamUp = false;


let startTime = undefined;

const endPos = 10879;


var debug = (new URL(window.location)).searchParams.get('debug') !== null;
if (debug) {
    document.getElementById("tela-inicial").style.display = "none";

    var css = document.getElementsByTagName("link")[0];
    css.parentNode.removeChild(css);

    window.requestAnimationFrame(loop);
}
else {
    document.getElementById("tela-jogo").style.display = "none";
    document.getElementById("background-debug").style.display = "none";
}

document.getElementById("modal-final").style.display = "none";

const canvas = document.getElementById("jogo-canvas");
const ctx = canvas.getContext("2d");

const canvasBitmap = document.getElementById("background-debug"); // document.createElement("canvas");
canvasBitmap.width = 3392;
canvasBitmap.height = 223;
const ctxBitmap = canvasBitmap.getContext("2d", { willReadFrequently: true });


const bitmap = new Image();
bitmap.src = "../../assets/images/mario-collision-mask.png";
bitmap.onload = function () {
    ctxBitmap.drawImage(bitmap, 0, 0, bitmap.width, bitmap.height, 0, 0, canvasBitmap.width, canvasBitmap.height);
}
// draw bitmap in ctxBitmap


const canvasWidth = 1024;
const canvasHeight = 768;

const backgroundWidth = 3392;
const backgroundHeight = 223;

//const aspectRatio = canvasWidth / canvasHeight;
const backgroundScale = backgroundHeight / canvasHeight;

const backgroundShow = canvasWidth / backgroundScale;

canvas.width = canvasWidth;
canvas.height = canvasHeight;


// Cria uma nova imagem
const background = new Image();
background.src = "../../assets/images/mario-bc.png";
const spriteMario = new Image();
spriteMario.src = "../../assets/images/sprite-sheet-mario.png";

const spriteEnemy = new Image();
spriteEnemy.src = "../../assets/images/enemy.png";

const audioDie = new Audio("../../assets/audio/sounds_mariodie.wav");
const audioJump = new Audio("../../assets/audio/sounds_jump-small.wav");
const audioBackground = new Audio("../../assets/audio/sounds_aboveground_bgm.ogg");
const audioFlagpole = new Audio("../../assets/audio/sounds_flagpole.wav");
const audioBump = new Audio("../../assets/audio/sounds_bump.wav");

let playAudioBackground = true;
audioBackground.volume = 0.05;

function mute(flag) {
    playAudioBackground = !playAudioBackground;
}

if (debug) {
    mute();
}

// carrega imagem de fundo no canvas
async function carregarBg() {
    await new Promise((resolve) => {
        background.onload = function () {
            resolve();
        };
    });
}


let model, webcam, labelContainer, maxPredictions;

// Load the image model and setup the webcam
async function carregarModelo() {
    const modelJson = document.getElementById("modelJson").files[0];
    const weightsBin = document.getElementById("weightsBin").files[0];
    const metadataJson = document.getElementById("metadataJson").files[0];

    // load the model and metadata
    // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
    // or files from your local hard drive
    // Note: the pose library adds "tmImage" object to your window (window.tmImage)
    model = await tmImage.loadFromFiles(modelJson, weightsBin, metadataJson);
    maxPredictions = model.getTotalClasses();

    // Convenience function to setup a webcam
    const flip = true; // whether to flip the webcam
    webcam = new tmImage.Webcam(200, 200, flip); // width, height, flip
    await webcam.setup(); // request access to the webcam
    await webcam.play();


    //await carregarBg();

    // append elements to the DOM
    document.getElementById("webcam-container").appendChild(webcam.canvas);
    labelContainer = document.getElementById("label-container");
    for (let i = 0; i < maxPredictions; i++) { // and class labels
        labelContainer.appendChild(document.createElement("div"));
    }

    
    window.requestAnimationFrame(loop);

    
    document.getElementById("tela-inicial").style.display = "none";
    document.getElementById("tela-jogo").style.display = "block";
}

async function handleWebcam() {
    webcam.update(); // update the webcam frame
    let prediction = await predict();

    let predictedClass = getClass(prediction);

    console.log(predictedClass);

    if (predictedClass === DIREITA) {
        webcamLeft = false;
        webcamRight = true;
        webcamUp = false;
    }
    else if (predictedClass === ESQUERDA) {
        webcamLeft = true;
        webcamRight = false;
        webcamUp = false;
    }
    else if (predictedClass === CIMA) {
        webcamLeft = false;
        webcamRight = false;
        webcamUp = true;
    }
    else if (predictedClass === CIMA_DIREITA) {
        webcamLeft = false;
        webcamRight = true;
        webcamUp = true;
    }
    else if (predictedClass === NADA) {
        webcamLeft = false;
        webcamRight = false;
        webcamUp = false;
    }
    else {
        console.log("bug predictedClass não reconhecido", predictedClass);
    }
}

let previousTimestamp = undefined;

function checkMarioGround() {
    marioPosy -= 1;

    if (collision(marioPosx, marioPosy, 14)) {
        marioGround = true;
        //console.log("mario esta no chao", marioPosy);
    }
    else {
        marioGround = false;
        //console.log("mario esta no ar", marioPosy);
    }

    

    marioPosy -= -1;
}

if (debug) {
    //console.log(marioPosx, marioPosy, scrollVal, backgroundWidth / backgroundScale, backgroundHeight, canvasWidth, canvasHeight);
    collisionDebug(marioPosx, marioPosy, 14);
    //console.log("foi");
    //collisionDebug();
}

function endGame() {
    console.log("fim de jogo, vai pra tela inicial");
    audioFlagpole.pause();
    audioBackground.pause();
    document.getElementById("modal-final").style.display = "block";
}

function killMario(timestamp) {
    marioDying = true;
    marioDyingTime = timestamp;

    audioBackground.pause();
    audioDie.play();
}



async function loop(timestamp) {
    if (playAudioBackground) {
        audioBackground.volume = 0.05;
    }
    else {
        audioBackground.volume = 0.0;
    }

    if (startTime === undefined) {
        startTime = timestamp;
        previousTimestamp = timestamp;
        marioWalkingTime = timestamp;

    }
    elapsedTime = (timestamp - startTime) / 1000;
    const dt = (timestamp - previousTimestamp) / 1000;
    previousTimestamp = timestamp;

    if ((maxGameDuration - elapsedTime) < 0) {
        console.log("tempo esgotado, vai pra tela de fim como se tivesse ganhado");
        endGame();

        return;
    }

    if (!audioPlaying) {
        try {
            
            await audioBackground.play();
            audioBackground.loop = true;
            audioPlaying = true;
        }
        catch (error) {
        }
    }


    if (marioPosy < -90 && !marioDying) {
        console.log("tou morrendo, mario caiu do mapa", marioPosy);
        killMario(timestamp);
    }

    if (marioDying) {
        const dyingElapsed = (timestamp - marioDyingTime) / 1000;
        if (dyingElapsed > 2.5) {
            console.log("mario terminou de morrer, vai voltar pra posicao inicial");
            init();
        }
        
        marioCycle = 6;
        draw(elapsedTime);
        window.requestAnimationFrame(loop);

        return;
    }

    
    if (!marioWinning && marioPosx >= endPos) {
        console.log("ganhou");
        marioWinning = true;
        marioWinningTime = timestamp;

        audioBackground.pause();
        audioFlagpole.currentTime = 0;
        audioFlagpole.play();

        // play audio win
    }

    if (marioWinning) {
        const winningElapsed = (timestamp - marioWinningTime) / 1000;

        const poleDownSpeed = 90;

        marioPosx = endPos + 16 / backgroundScale;

        marioPosy -= poleDownSpeed * dt;

        marioFacingRight = false;

        draw(elapsedTime);


        if (marioPosy < 50) {
            console.log("ganhou, vai pra tela de fim");
            endGame();

            return;
        }

        window.requestAnimationFrame(loop);

        return;
    }


    if (collision(marioPosx, marioPosy, 14)) {
        console.log("mario ficou preso na parede ou chao, vai voltar pra posicao inicial");


        init();
    }



    if (!debug) {
        await handleWebcam();
    }
    

    const notPressing = !leftPressed && !rightPressed & !upPressed;

    let movex = 0;
    let movey = 0;

    if (leftPressed || (notPressing && webcamLeft)) {
        movex = -marioSpeed * dt;
        if (!marioWalking) {
            marioWalking = true;
            marioWalkingTime = elapsedTime;
        }
    }
    else if (rightPressed || (notPressing && webcamRight)) {
        movex = marioSpeed * dt;

        if (!marioWalking) {
            marioWalking = true;
            marioWalkingTime = elapsedTime;
        }
    }
    else {
        marioWalking = false;
    }
    
    if (upPressed || (notPressing && webcamUp)) {   
        if (!marioJumping) {
            console.log("pulando");
            marioJumping = true;
            marioGround = false;
            marioJumpingUp = true;
            marioJumpingTime = timestamp;

            // play sound even if another sound is playing

            audioJump.currentTime = 0; // reset the audio to the beginning
            audioJump.play();
        }
    }

    let jumpingElapsed = (timestamp - marioJumpingTime) / 1000;

    if (marioWalking) {
        move(movex);

        if (collision(marioPosx, marioPosy, 14)) {
            marioPosx += -movex;

            //console.log("colidiu horizontal", movex);
        }

        checkMarioGround();
    
        if (!marioGround  && !marioJumping) {
            console.log("pulando");
            marioJumping = true;
            marioJumpingUp = false;
        }
    }

    if (goombaCollidePlayer(timestamp)) {
        console.log("colidiu");
    }

    goombaUpdate(dt, timestamp);

    if (marioJumping) {
        if (marioJumpingUp) {
            movey = marioJumpSpeed * dt;
            //console.log("marioJumpingUp", movey);
            if (jumpingElapsed > marioJumpTime) {
                marioJumpingUp = false;
            }
        }
        else {
            movey = -marioJumpSpeed * dt;
            //console.log("marioJumpingDown", movey);
        }

        marioPosy += movey;

        let collided = false;

        while (collision(marioPosx, marioPosy, 14)) {
            collided = true;
            marioPosy += -movey / Math.abs(movey);

            //console.log("movi",  -movey / Math.abs(movey))
        }

        if (collided) {
            if (marioJumpingUp) {
                //console.log("colidiu vertical pra cima", movey);
                marioJumpingUp = false;
            }
            else {
                //console.log("colidiu vertical pra baixo", movey);
                console.log("nao esta mais pulando");
                marioJumping = false;
                marioJumpingUp = false;
                marioGround = true;
            }
        }

    }


    let walkingElapsed = (timestamp - marioWalkingTime) / 1000;


    let formula = walkingElapsed * 5;


    if (marioJumping) {
        marioCycle = 5;
    }
    else if (marioWalking) {
        marioCycle = 1 + Math.floor(formula) % 3;
    }
    else {  
        marioCycle = 0;
    }

    if (formula < 0) {
        console.log("bug formula < 0", formula);
    }

    if (marioCycle > 5) {
        console.log("bug marioCycle > 5", marioCycle);
    }
    if (marioCycle < 0) {
        console.log("bug marioCycle < 0", marioCycle);
    }

    if (!Number.isInteger(marioCycle)) {
        console.log("bug marioCycle is not integer", marioCycle);
    }

    draw(elapsedTime);

    window.requestAnimationFrame(loop);
}


function text(x, y, text) {
    ctx.font = "24px 'Press Start 2P'";
    ctx.fillStyle = "white";
    ctx.fillText(text, x, y);
}

function tempo(elapsedTime) {
    const minutes = Math.floor(elapsedTime / 60);
    const seconds = Math.floor(elapsedTime % 60);
    const timeString = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    return timeString;
}

myMarioCycle = undefined;

function draw(elapsedTime) {
    ctx.drawImage(background, scrollVal * backgroundScale, 0, canvasWidth * backgroundScale, backgroundHeight, 0, 0, canvasWidth, canvasHeight);

    text(canvasWidth - 200, 50, "TEMPO");
    text(canvasWidth - 200 + 24, 80, tempo(maxGameDuration - elapsedTime));

    goombaDraw(elapsedTime);

    let oldTrans = ctx.getTransform();

    let marioPosScreen;

    if (marioFacingRight) {
        marioPosScreen = marioPosx - scrollVal;
    }
    else {
        ctx.scale(-1, 1);
        marioPosScreen = -marioPosx + scrollVal - 16 / backgroundScale; //canvasWidth - (marioPos - scrollVal) - 16 / backgroundScale;
    }

    if (myMarioCycle !== undefined) {
        marioCycle = myMarioCycle;
    }

    let selectSprite = 16 * marioCycle;

    const marioPosVertical = (canvasHeight - 40 / backgroundScale) - marioPosy - 5;


    ctx.drawImage(spriteMario, 80 + selectSprite, 32, 16, 16, marioPosScreen, marioPosVertical, 16 / backgroundScale, 16 / backgroundScale);


    ctx.setTransform(oldTrans);
}

function goombaDraw(elapsedTime) {
    let formula = elapsedTime * 5;

    goombaCycle = Math.floor(formula) % 2;

    const goombaWidth = 16 / backgroundScale;
    const goombaHeight = 16 / backgroundScale;

    for (let i = 0; i < enemy.goomba.length; i++) {
        const meuGoomba = enemy.goomba[i];

        ctx.drawImage(spriteEnemy, goombaCycle * 16, 16, 16, 16, meuGoomba.x - scrollVal, (canvasHeight - 40 / backgroundScale) - meuGoomba.y - 5, goombaWidth, goombaHeight);
    }
}

function goombaInit() {
    enemy = { goomba: [] };
    goomba(1200);

}

function collidingEnemy(goombax, goombay, hitbox_size) {
    return !(goombax > marioPosx + hitbox_size ||
        goombax + hitbox_size < marioPosx  ||
        goombay > marioPosy + hitbox_size ||
        goombay + hitbox_size < marioPosy);
}

function goombaCollidePlayer(timestamp) {
    let killed = [];

    for (let i = 0; i < enemy.goomba.length; i++) {
        const meuGoomba = enemy.goomba[i];

        const goombax = meuGoomba.x;
        const goombay = meuGoomba.y;

        if (marioJumping && !marioJumpingUp && collidingEnemy(goombax, goombay, 50)) {
            console.log("mario estava pulando e portando matou o goomba");
            audioBump.play();
            killed.push(i);
        }
        else if (collidingEnemy(goombax, goombay, 14)) {
            console.log("colidiu goomba com mario", goombax, goombay, marioPosx, marioPosy, "jumping?", marioJumping);
            killMario(timestamp);
            return true;
        }
    }

    for (let i = 0; i < killed.length; i++) {
        console.log("removendo goomba", i);
        enemy.goomba.splice(i, 1);
    }

    if (killed.length > 0) {
        return true;
    }
    else {
        return false;
    }
}

function goombaUpdate(dt, timestamp) {
    for (let i = 0; i < enemy.goomba.length; i++) {
        const meuGoomba = enemy.goomba[i];

        let amount = 200 * dt;

        if (meuGoomba.facingRight) {
            meuGoomba.x += amount;
        }
        else {
            meuGoomba.x -= amount;
        }

        if (collision(meuGoomba.x, meuGoomba.y, 14)) {
            meuGoomba.facingRight = !meuGoomba.facingRight;
        }
    }
}

function goomba(x) {
    let meuGoomba = {};

    meuGoomba.x = x;
    meuGoomba.y = -12.8;
    meuGoomba.facingRight = false;
    
    enemy.goomba.push(meuGoomba);
}

function collision(charPosx, charPosy, charSide) {
    //console.log("collision()");
    if (debug) {
        return collisionDebug(charPosx, charPosy, charSide);
    }
    else {
        return collisionDebug(charPosx, charPosy, charSide); // collisionNormal() has a bug
    }
}


function collisionDebug(charPosx, charPosy, charSide) {
    ctxBitmap.drawImage(bitmap, 0, 0, bitmap.width, bitmap.height, 0, 0, canvasBitmap.width, canvasBitmap.height);

    const posx = charPosx * backgroundScale;
    const posy = (canvasHeight - 40 / backgroundScale) * backgroundScale - charPosy * backgroundScale;


    const imageData = ctxBitmap.getImageData(posx, posy, charSide, charSide);

    let collided = false;

    // change color (white to yellow, black to red)
    for (let i = 0; i < imageData.data.length; i += 4) {
        const r = imageData.data[i];
        const g = imageData.data[i + 1];
        const b = imageData.data[i + 2];
        const a = imageData.data[i + 3];

        if (r === 255 && g === 255 && b === 255) {
            imageData.data[i] = 255;
            imageData.data[i + 1] = 255;
            imageData.data[i + 2] = 0;
            //console.log("branco");
        } else if (r === 0 && g === 0 && b === 0) {
            imageData.data[i] = 255;
            imageData.data[i + 1] = 0;
            imageData.data[i + 2] = 0;
            //console.log("preto");
            collided = true;
            break;
            //console.log("colidiu", posx, posy, side, side);
        }
        else {
            console.log(r, g, b);
        }
    }

    ctxBitmap.putImageData(imageData, posx, posy);

    return collided;

}

function collisionNormal() {
    const posx = marioPosx * backgroundScale;
    const posy = (canvasHeight - 40 / backgroundScale) * backgroundScale;

    const side = 14; // square is 16x16 but there is transparency around mario

    const imageData = ctxBitmap.getImageData(posx, posy, side, side);

    for (let i = 0; i < imageData.data.length; i += 4) {
        const r = imageData.data[i];
        const g = imageData.data[i + 1];
        const b = imageData.data[i + 2];
        if (r === 0 && g === 0 && b === 0) {
            return true;
        }
        else if (!(r === 255 && g === 255 && b === 255)) {
            console.log("nem preto nem branco", r, g, b);
        }
    }

    return false;
}

function scroll(amount) {
    scrollVal += amount;

    if (scrollVal < 0) {
        scrollVal = 0;
    }

    if (scrollVal > backgroundWidth / backgroundScale) {
        scrollVal = backgroundWidth / backgroundScale;
    }
}

function end() {
    teleport(10860);
}

function teleport(x) {
    if (x < marioPosx) {
        marioFacingRight = false;
    }
    else if (x > marioPosx) {
        marioFacingRight = true;
    }

    const scrollBorder = 150;
    const scrollAmount = scrollBorder + 100;

    marioPosx = x;

    if (marioPosx < 0) {
        marioPosx = 0;
    }

    let screenMario = marioPosx - scrollVal;

    while (screenMario < scrollBorder) { 
        scroll(-scrollAmount);
        screenMario = marioPosx - scrollVal;
    }

    while (screenMario > canvasWidth - scrollBorder - 16 / backgroundScale) {
        scroll(scrollAmount);
        screenMario = marioPosx - scrollVal;
    }
}

function move(amount) {
    if (amount < 0) {
        marioFacingRight = false;
    }
    else if (amount > 0) {
        marioFacingRight = true;
    }

    const scrollBorder = 150;
    const scrollAmount = scrollBorder + 100;

    marioPosx += amount;

    if (marioPosx < 0) {
        marioPosx = 0;
    }

    const screenMario = marioPosx - scrollVal;

    if (screenMario < scrollBorder) { 
        scroll(-scrollAmount);
    }
    if (screenMario > canvasWidth - scrollBorder - 16 / backgroundScale) {
        scroll(scrollAmount);
    }
}

document.addEventListener("keydown", function (event) {
    if (event.key === "ArrowRight") {
        rightPressed = true;
    } else if (event.key === "ArrowLeft") {
        leftPressed = true;
    } else if (event.key === "ArrowUp") {
        upPressed = true;
    }
    else {
        return;
    }

    event.preventDefault();
});

document.addEventListener("keyup", function (event) {
    if (event.key === "ArrowRight") {
        rightPressed = false;
    } else if (event.key === "ArrowLeft") {
        leftPressed = false;
    } else if (event.key === "ArrowUp") {
        upPressed = false;
    }
    else {
        return;
    }

    event.preventDefault();
});

function getClass(prediction) {
    let maxProb = 0;
    let classIndex = -1;
    for (let i = 0; i < prediction.length; i++) {
        if (prediction[i].probability > maxProb) {
            maxProb = prediction[i].probability;
            classIndex = i;
        }
    }
    return prediction[classIndex].className;
}

// run the webcam image through the image model
async function predict() {
    // predict can take in an image, video or canvas html element
    const prediction = await model.predict(webcam.canvas);
    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction =
            prediction[i].className + ": " + prediction[i].probability.toFixed(2);
        labelContainer.childNodes[i].innerHTML = classPrediction;
    }

    return prediction;
}