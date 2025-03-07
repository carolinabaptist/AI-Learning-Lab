const waitTime = 50;

let globalTexts;

let shouldPlayNum = null;

function typewriterStep(playingNum, element, i) {
    const text = globalTexts[playingNum];
    const cancelled = (currentPage != playingNum);
    if (i < text.length && !cancelled) {
        element.innerHTML += text[i];

        setTimeout(() => typewriterStep(playingNum, element, i + 1), waitTime);
    }
    /*
    if (i >= text.length) {
        console.log("Terminei a animacao do", playingNum);
    }

    if (cancelled) {
        console.log("Estou cancelando o", playingNum, "porque comeceu a tocar", shouldPlayNum);
    }
    */
}


function typewriterContinue(element) {
    if (currentPage == null) {
        currentPage = 0;
    }
    else {
        currentPage++;
    }


    text = globalTexts[currentPage];

    element.innerHTML = text;

    element.style.width = element.offsetWidth + 'px';
    element.style.height = element.offsetHeight + 'px';

    element.innerHTML = '';

    if (currentPage + 1 >= globalTexts.length) {
        $('.typewriter-continue')[0].classList.add('disabled');
        $('.typewriter-end')[0].classList.remove('disabled');
    }

    typewriterStep(currentPage, element, 0);
}

function typewriter(element) {
    globalTexts = element.innerHTML.split('===');

    typewriterContinue(element);
}

window.addEventListener('load', () => {
    $('.effect-typewriter').forEach((element) => {
        typewriter(element);
    });
});