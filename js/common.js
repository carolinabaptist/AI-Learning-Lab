const $ = (x) => document.querySelectorAll(x);

const waitTime = 5;

function typewriterStep(text, element, i) {
    if (i < text.length) {
        element.innerHTML += text[i];

        setTimeout(() => typewriterStep(text, element, i + 1), waitTime);
    }
}

let globalTexts;


function typewriterContinue(element) {
    text = globalTexts[0];

    element.innerHTML = text;

    element.style.width = element.offsetWidth + 'px';
    element.style.height = element.offsetHeight + 'px';

    element.innerHTML = '';

    console.log(globalTexts.length);

    if (globalTexts.length == 1) {
        console.log('aaaa');
        $('.typewriter-continue')[0].classList.add('disabled');
        $('.typewriter-end')[0].classList.remove('disabled');
    }
    else {
        globalTexts = globalTexts.slice(1, globalTexts.length);
    }

    typewriterStep(text, element, 0);
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
