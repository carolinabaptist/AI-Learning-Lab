const waitTimeUsual = 50;
const waitTimeNewline = 100;

let currentPage = null;

let currentParagraph = null;

function speakText(text) {
    let speech = new SpeechSynthesisUtterance(text);

    speech.lang = "pt-PT";
    speech.volume = 1;
    speech.rate = 1;
    speech.pitch = 2;

    console.log("aaa");
    speechSynthesis.speak(speech);
}

function typewriterStep(playingPage, element, text, i) {
    const cancelled = (currentPage != playingPage);
    if (i < text.length && !cancelled) {
        const insertedChar = text[i];

        element.innerText += insertedChar;

        let waitTime;

        if (insertedChar == '\n') {
            waitTime = waitTimeNewline;
        }
        else {
            waitTime = waitTimeUsual;
        }

        setTimeout(() => typewriterStep(playingPage, element, text, i + 1), waitTime);
    }
    /*
    if (i >= text.length) {
        console.log("Terminei a animacao do", playingPage);
    }

    if (cancelled) {
        console.log("Estou cancelando o", playingPage, "porque comeceu a tocar", shouldPlayPage);
    }
    */
}

function typewriterStepPage(lement) {

}


function typewriterContinue() {
    const pages = $('#typewriter-screen .typewriter-page');

    if (currentPage == null) {
        currentPage = 0;
    }
    else {
        const previousPage = pages[currentPage];
        previousPage.classList.add('disabled');
        window.speechSynthesis.cancel();

        currentPage++;
    }

    const page = pages[currentPage];
    page.classList.remove('disabled');

    const elements = $('#typewriter-screen .typewriter-page pre.effect-typewriter');
    const element = elements[currentPage];

    text = element.innerText;

    text = text.split('\n').map((s) => s.trim()).join('\n');

    element.innerText = '';

    if (currentPage + 1 >= elements.length) {
        $('.typewriter-continue')[0].classList.add('disabled');
        $('.typewriter-end')[0].classList.remove('disabled');
    }

    console.log("vou tocar o texto", text);

    speakText(text);

    console.log("toquei");
    typewriterStep(currentPage, element, text, 0);
}

window.addEventListener('load', () => {
    typewriterContinue();

    document.addEventListener('keydown', (event) => {
        if (event.key == ' ') {
            $('.pixel-button:not(.disabled)')[0].click();
        }
    });
});

