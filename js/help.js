
const waitTimeCharacter = 60;
const waitTimeParagraph = 200;

let currentPage = null;

let textEnded = false;
let speechEnded = false;

let speechFn = null;

let dateAccessToken = null;
let accessToken = null;

function removeEmoji(text) {
    return text.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '');

}

// get access token from refresh token
async function getAccessToken() {
    if (dateAccessToken != null && Date.now() - dateAccessToken < 300) {
        return;
    }
    
    dateAccessToken = Date.now();

    const credentials = null;

    const response = await fetch('https://accounts.google.com/o/oauth2/token', {
        body: `client_id=${credentials.client_id}&client_secret=${credentials.client_secret}&refresh_token=${credentials.refresh_token}&grant_type=refresh_token`,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        method: 'POST'
    });

    const responseJson = await response.json();
    
    accessToken = responseJson.access_token;
}


// converts base64 string to blob
function base64toblob(string) {
    var binary = atob(string);
    var array = [];
    for (var i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], { type: 'audio/mp3' });
}

async function speakGoogle(textWithoutEmoji) {
    await getAccessToken();

    const result = await fetch('https://texttospeech.googleapis.com/v1/text:synthesize/', {
        body: JSON.stringify({
            "input": { "text": textWithoutEmoji },
            "voice": {    
                "languageCode": "pt-pt", 
                // ver https://cloud.google.com/text-to-speech/docs/voices?hl=pt-br&cloudshell=false
                "name": "pt-PT-Standard-A",
                "ssmlGender": "FEMALE" 
            },
            "audioConfig" : {"audioEncoding":"MP3"}
        }),
        headers: {
            "Authorization": "Bearer " + accessToken,
            "x-goog-user-project": "eminent-quasar-443718-k3",
            "Content-Type": 'application/json; charset=utf-8'
        },
        method: 'POST'
    });

    const resultJson = await result.json();

    var blob = base64toblob(resultJson.audioContent);

    $('#speech')[0].src = URL.createObjectURL(blob);

    $('#speech')[0].play();
}

function shouldSpeak() {
    let screen = $('#typewriter-screen')[0];
    return screen.classList.contains('typewriter-speech');
}

async function speakText(originalText) {
    const text = removeEmoji(originalText);

    begin = Date.now();

    await speakGoogle(text);

    end = Date.now();


    console.log('Speech ended after', begin - end, 'ms');
        
    speechEnded = true;

    if (speechFn != null) {
        speechFn();
        speechFn = null;
    }
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

    if (i < text.length) {
        paragraph.innerText = text.slice(0, i + 1);

        setTimeout(() => typewriterStep(playingPage, playingParagraph, i + 1), waitTimeCharacter);
    }
    else if (playingParagraph + 1 < paragraphs.length) {
        textEnded = true;

        const nextParagraph = async () => {
            textEnded = false;
            speechEnded = false;

            const nextParagraph = playingParagraph + 1;
            const nextText = paragraphs[nextParagraph].getAttribute('typewriter-text');

            await speakText(nextText);
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
