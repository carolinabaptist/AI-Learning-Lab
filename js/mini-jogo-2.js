document.getElementById("placar").style.display = "none";
document.getElementById("msg").style.display = "none";

document.querySelectorAll(".play-button-1").forEach((button) => {

    button.addEventListener("click", () => {
        document.getElementById("tela-nomes").style.display = "none";
        document.getElementById("placar").style.display = "block";
    });
});

let jogador1 = "";
let jogador2 = "";
let jogador = "";
let pontuacao1 = 0;
let pontuacao2 = 0;

function iniciarJogo() {
    /*jogo em dupla*/
    jogador1 = document.getElementById("nome-jogador1").value || "Fora de jogo";
    jogador2 = document.getElementById("nome-jogador2").value || "Fora de jogo";// Se for vazio, usa um padrão

    document.getElementById("tela-nomes").style.display = "none";
    document.getElementById("placar").style.display = "block";
}

function tocarSomChegada() {
    console.log("Tentando tocar som...");
    const audio = new Audio("../../assets/audio/winner-sound.mp3");
    audio.play();
}

function falar(texto) {
    const voz = new SpeechSynthesisUtterance(texto);
    voz.lang = "pt-PT";
    voz.volume = 1.1;
    speechSynthesis.speak(voz);
}

document.addEventListener("DOMContentLoaded", function () {
    let score1 = 0;
    let score2 = 0;
    const maxRounds = 3;
    let round = 1;
    let keyPressCount = 0;
    const score1Display = document.getElementById("score1");
    const score2Display = document.getElementById("score2");
    const placar = document.getElementById("placar");
    const msg = document.getElementById("msg");

    function isPlacarVisible(){
        return document.getElementById("placar").style.display === "block";
    }

    document.addEventListener("keydown", function (event) {
        if (!isPlacarVisible() || round > maxRounds) return;

        console.log(`Round: ${round}, Max Rounds: ${maxRounds}`);

        keyPressCount++;
        if (event.key === "1") {
                score1++;
                score1Display.textContent = score1;
                tocarSomChegada();
                falar(`Ponto para ${jogador1}!`);
                round++;
                if (round > maxRounds) {
                    setTimeout(() => {
                        placar.style.display = "none";
                        msg.style.display = "block";
                    }, 4000);
                }
                return
        } else if (event.key === "2") {
                score2++;
                score2Display.textContent = score2;
                tocarSomChegada();
                falar(`Ponto para ${jogador2}!`);
                round++;
                if (round > maxRounds) {
                    setTimeout(() => {
                        placar.style.display = "none";
                        msg.style.display = "block";
                    }, 4000);
                }
                return
        }
    });
});

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
 
    speech.lang = "pt-PT"
    speech.rate = 0.5;
    
    if (shouldSpeak()) {
        speech.volume = 1;
    }
    else {
        speech.volume = 0;
    }
 
    //speech.rate = 0.7;
    //speech.pitch = 3;
 
 
    speech.addEventListener('end', (event) => {
        console.log('Speech ended after', event.elapsedTime, 'ms');
        speechEnded = true;
 
        if (speechFn != null) {
            speechFn();
            speechFn = null;
        }
    });
 
    speechSynthesis.speak(speech);
}
 
function typewriterStep(playingPage, playingParagraph, i) {
    const pages = $('#typewriter-screen .typewriter-page');
    const page = pages[playingPage];
    const paragraphs = page.querySelectorAll('.typewriter-effect');
    const paragraph = paragraphs[playingParagraph];
    const text = paragraph.getAttribute('typewriter-text');
 
    textEnded = false;
 
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
        $('#typewriter-continue')[0].classList.add('disabled');
        $('#typewriter-end')[0].classList.remove('disabled');
    }
 
    const text = page.querySelector('.typewriter-effect').getAttribute('typewriter-text');
    console.log('Speaking:', text, window.speechSynthesis.getVoices().length);
 
    speakText(text);
 
    typewriterStep(currentPage, 0, 0);
}
 
function typewriterBegin() {
    $('#msg')[0].style.display = 'none';
    $('#typewriter-screen')[0].classList.remove('disabled');
    typewriterContinue();
}
 
window.addEventListener('load', () => {
    for (const paragraph of $('#typewriter-screen .typewriter-page .typewriter-effect')) {
        const text = paragraph.innerText;
        paragraph.innerText = '';
        paragraph.setAttribute('typewriter-text', text);
    }
});