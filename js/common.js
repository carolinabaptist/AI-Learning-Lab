const $ = (x) => document.querySelectorAll(x);

function playSound() {
    $('#click-sound')[0].play();
}

const waitTimeCharacter = 60;
const waitTimeParagraph = 200;

let currentPage = null;

let textEnded = false;
let speechEnded = false;

let speechFn = null;

function removeEmoji(text) {
    return text.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '');

}

function shouldSpeak() {
    let screen = $('#typewriter-screen')[0];
    return screen.classList.contains('typewriter-speech');
}

function speakText(originalText) {
    const text = removeEmoji(originalText);


    console.log('aaa', originalText, text, speechEnded);
    let speech = new SpeechSynthesisUtterance(text);

    speech.lang = "pt-PT";

    if (shouldSpeak()) {
        speech.volume = 3;
    }
    else {
        speech.volume = 0;
    }

    speech.rate = 0.7;
    speech.pitch = 2;


    speech.addEventListener('end', (event) => {
        console.log('Speech ended after', event.elapsedTime, 'ms');
        
        speechEnded = true;

        if (speechFn != null) {
            speechFn();
            speechFn = null;
        }
    });

    speechSynthesis.speak(speech);
    console.log('qqq');
}

function typewriterStep(playingPage, playingParagraph, i) {
    const pages = $('#typewriter-screen .typewriter-page');
    const page = pages[playingPage];
    const paragraphs = page.querySelectorAll('.typewriter-effect');
    const paragraph = paragraphs[playingParagraph];
    const text = paragraph.getAttribute('typewriter-text');

    textEnded = false;

    if (playingPage == 0 && playingParagraph == 0 && i == 0) {
        $('.typewriter-continue')[0].textContent = 'CONTINUAR';
    }

    if (playingPage != currentPage) {
        return;
    }

    //if (playingParagraph == 0 && i == 0) {
    //    speakText(text);
    //}

    if (i < text.length) {
        paragraph.innerText = text.slice(0, i + 1);

        setTimeout(() => typewriterStep(playingPage, playingParagraph, i + 1), waitTimeCharacter);
    }
    else if (playingParagraph + 1 < paragraphs.length) {
        textEnded = true;

        const nextParagraph = () => {
            textEnded = false;
            speechEnded = false;

            const nextParagraph = playingParagraph + 1;
            const nextText = paragraphs[nextParagraph].getAttribute('typewriter-text');

            speakText(nextText);
            typewriterStep(playingPage, nextParagraph, 0);
        };

        if (speechEnded) {
            setTimeout(nextParagraph, waitTimeParagraph);
        }
        else {
            speechFn = nextParagraph;
        }
    }
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
        speechEnded = false;

        currentPage++;
    }

    const page = pages[currentPage];
    page.classList.remove('disabled');

    if (currentPage + 1 >= pages.length) {
        $('.typewriter-continue')[0].classList.add('disabled');
        $('.typewriter-end')[0].classList.remove('disabled');
    }

    const text = page.querySelector('.typewriter-effect').getAttribute('typewriter-text');
    console.log('Speaking:', text, window.speechSynthesis.getVoices().length);

    speakText(text);

    typewriterStep(currentPage, 0, 0);
}

function begin() {
    document.addEventListener('keydown', (event) => {
        if (event.key == ' ') {
            $('.pixel-button:not(.disabled)')[0].click();
        }
    });

    if (!shouldSpeak()) {
        typewriterContinue();
    }
}

window.addEventListener('load', () => {
    let screen = $('#typewriter-screen')[0];
    console.log(screen);

    if (!screen) {
        console.log("We don't have a typewriteer effect here");
        return;
    }

    for (const paragraph of $('#typewriter-screen .typewriter-page .typewriter-effect')) {
        const text = paragraph.innerText;
        paragraph.innerText = '';
        paragraph.setAttribute('typewriter-text', text);
    }

    if (window.speechSynthesis.getVoices().length == 0) {
        console.log('Waiting for voices to load');
        window.speechSynthesis.addEventListener('voiceschanged', () => {
                begin();
        });
    }
    else {
        begin();
    }
});

