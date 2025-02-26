const $ = (x) => document.querySelectorAll(x);

const waitTime = 50;

function typewriterStep(text, element, i) {
    if (i < text.length) {
        element.innerHTML += text[i];

        setTimeout(() => typewriterStep(text, element, i + 1), waitTime);
    }
}

function typewriter(element) {
    text = element.innerHTML;

    console.log(element.offsetWidth);

    element.style.width = element.offsetWidth + 'px';
    element.style.height = element.offsetHeight + 'px';

    element.innerHTML = '';

    typewriterStep(text, element, 0);
}

window.addEventListener('load', () => {
    $('.effect-typewriter').forEach((element) => {
        typewriter(element);
    });
});
