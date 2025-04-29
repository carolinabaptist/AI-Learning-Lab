document.getElementById("tela-jogo").style.display = "none";

const canvas = document.getElementById("jogo-canvas");
const ctx = canvas.getContext("2d");

const canvasWidth = 1024;
const canvasHeight = 768;

const backgroundWidth = 3392;
const backgroundHeight = 223;

//const aspectRatio = canvasWidth / canvasHeight;
const backgroundScale = backgroundHeight / canvasHeight;

const backgroundShow = canvasWidth / backgroundScale;


const scrollVal = 0;

canvas.width = canvasWidth;
canvas.height = canvasHeight;


// Cria uma nova imagem
const background = new Image();
background.src = "../../assets/images/mario-bc.png";

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

    window.requestAnimationFrame(loop);

    // append elements to the DOM
    document.getElementById("webcam-container").appendChild(webcam.canvas);
    labelContainer = document.getElementById("label-container");
    for (let i = 0; i < maxPredictions; i++) { // and class labels
        labelContainer.appendChild(document.createElement("div"));
    }

}

async function loop() {
    webcam.update(); // update the webcam frame
    let prediction = await predict();

    let predictedClass = getClass(prediction);

    //console.log(predictedClass);

    //console.log("vou desenhar");

    ctx.drawImage(background, scrollVal, 0, scrollVal, backgroundHeight);

    //console.log("ok");

    window.requestAnimationFrame(loop);
}

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


//let model;
/*
async function carregarModelo_() {

    document.getElementById("tela-inicial").style.display = "none";
    document.getElementById("tela-jogo").style.display = "block";

    const modelJson = document.getElementById("modelJson").files[0];
    const weightsBin = document.getElementById("weightsBin").files[0];
    const metadataJson = document.getElementById("metadataJson").files[0];

    try {
        // Carrega o modelo
        const handler = tf.io.browserFiles([modelJson, weightsBin]);
        model = await tf.loadLayersModel(handler);
        console.log("✅ Modelo carregado com sucesso!");

        // Lê o metadata (opcional, mas útil)
        const reader = new FileReader();
        reader.onload = function (event) {
            const metadata = JSON.parse(event.target.result);
            console.log("🧠 Metadata carregado:", metadata);
        };
        reader.readAsText(metadataJson);
        
    } catch (error) {
        console.error("❌ Erro ao carregar o modelo:", error);
        alert("Erro ao carregar o modelo.");
    }
}
*/