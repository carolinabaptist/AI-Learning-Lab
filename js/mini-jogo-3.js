document.getElementById("tela-jogo").style.display = "none";
document.getElementById("tela-final").style.display = "none";

// the idea is to be able to change those values in the browser console

var scrollVal = 0;
var marioPos = 200;
var marioSpeed = 10;

var leftPressed = false;
var rightPressed = false;
var upPressed = false;

const canvas = document.getElementById("jogo-canvas");
const ctx = canvas.getContext("2d");

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


    document.getElementById("tela-inicial").style.display = "none";
    document.getElementById("tela-jogo").style.display = "block";

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
}


document.getElementById("tela-inicial").style.display = "none";
document.getElementById("tela-jogo").style.display = "block";
window.requestAnimationFrame(loop);

async function loop() {
    //webcam.update(); // update the webcam frame
    //let prediction = await predict();

    //let predictedClass = getClass(prediction);

    //console.log(predictedClass);

    //console.log("vou desenhar");´

    //console.log(scrollVal);

    if (leftPressed) {
        move(-marioSpeed);
    }
    else if (rightPressed) {
        move(marioSpeed);
    }

    ctx.drawImage(background, scrollVal * backgroundScale, 0, canvasWidth * backgroundScale, backgroundHeight, 0, 0, canvasWidth, canvasHeight);

    ctx.drawImage(spriteMario, 80, 32, 16, 16, marioPos - scrollVal, canvasHeight - 40 / backgroundScale, 16 / backgroundScale, 16 / backgroundScale);
    //console.log("ok");

    if (marioPos >= 10920) {
        console.log("ganhou");
    }

    window.requestAnimationFrame(loop);
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
});

document.addEventListener("keyup", function (event) {
    if (event.key === "ArrowRight") {
        rightPressed = false;
    } else if (event.key === "ArrowLeft") {
        leftPressed = false;
    } else if (event.key === "ArrowUp") {
        upPressed = false;
    }
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