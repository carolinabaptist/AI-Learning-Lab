const DIREITA = "direita";

const ESQUERDA = "esquerda";

const CIMA = "cima";

const CIMA_DIREITA = "cima direita";

const NADA = "nada";


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

document.getElementById("tela-final").style.display = "none";



// the idea is to be able to change those values in the browser console

var scrollVal = 0;
var marioPos = 200;
var marioSpeed = 10;
var marioFacingRight = true;
var marioWalking = false;
var marioWalkingTime = undefined;
var marioCycle = 0;

var leftPressed = false;
var rightPressed = false;
var upPressed = false;


var webcamLeft = false;
var webcamRight = false;
var webcamUp = false;


let startTime = undefined;

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
        console.log("predictedClass não reconhecido", predictedClass);
    }
}


async function loop(timestamp) {
    console.log("a");
    if (startTime === undefined) {
        startTime = timestamp;
        marioWalkingTime = timestamp;
    }
    const elapsedTime = (timestamp - startTime) / 1000;

    if (!debug) {
        await handleWebcam();
    }

    const notPressing = !leftPressed && !rightPressed & !upPressed;


    let movex;

    if (leftPressed || (notPressing && webcamLeft)) {
        movex = -marioSpeed;
        if (!marioWalking) {
            marioWalking = true;
            marioWalkingTime = elapsedTime;
        }
    }
    else if (rightPressed || (notPressing && webcamRight)) {
        movex = marioSpeed;

        if (!marioWalking) {
            marioWalking = true;
            marioWalkingTime = elapsedTime;
        }
    }
    else {
        movex = 0;
        marioWalking = false;
    }

    if (marioWalking) {
        move(movex);

        if (collision()) {
            marioPos += -movex;
            console.log("colidiu", movex);	
        }
    }


    let walkingElapsed = (timestamp - marioWalkingTime) / 1000;


    let formula = walkingElapsed * 5;


    if (marioWalking) {
        marioCycle = 1 + Math.floor(formula) % 3;

    }
    else {  
        marioCycle = 0;
    }

    if (formula < 0) {
        console.log("formula < 0", formula);
    }

    if (marioCycle > 3) {
        console.log("marioCycle > 3", marioCycle);
    }
    if (marioCycle < 0) {
        console.log("marioCycle < 0", marioCycle);
    }
    if (!Number.isInteger(marioCycle)) {
        console.log("marioCycle is not integer", marioCycle);
    }


    ctx.drawImage(background, scrollVal * backgroundScale, 0, canvasWidth * backgroundScale, backgroundHeight, 0, 0, canvasWidth, canvasHeight);

    let oldTrans = ctx.getTransform();

    let marioPosScreen;

    if (marioFacingRight) {
        marioPosScreen = marioPos - scrollVal;
    }
    else {
        ctx.scale(-1, 1);
        marioPosScreen = -marioPos + scrollVal - 16 / backgroundScale; //canvasWidth - (marioPos - scrollVal) - 16 / backgroundScale;
    }
    

    let selectSprite = 16 * marioCycle;


    ctx.drawImage(spriteMario, 80 + selectSprite, 32, 16, 16, marioPosScreen, canvasHeight - 40 / backgroundScale, 16 / backgroundScale, 16 / backgroundScale);


    ctx.setTransform(oldTrans);

    if (marioPos >= 10920) {
        console.log("ganhou");
    }

    window.requestAnimationFrame(loop);
}

function collision() {
    const posx = marioPos * backgroundScale;
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

function move(amount) {
    if (amount < 0) {
        marioFacingRight = false;
    }
    else if (amount > 0) {
        marioFacingRight = true;
    }

    const scrollBorder = 150;
    const scrollAmount = scrollBorder + 100;
    const screenMario = marioPos - scrollVal;

    marioPos += amount;

    if (marioPos < 0) {
        marioPos = 0;
    }

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