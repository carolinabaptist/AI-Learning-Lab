document.addEventListener("DOMContentLoaded", function() {
    const helpButton = document.querySelector(".help-container"); // Captura a DIV do botão de ajuda
    const messageBoard = document.getElementById("message-board");
    const closeButton = document.getElementById("close-button");

    //o certo eh closeButton = document.querySelector('.close-button')

    // Mostrar o quadro de mensagem ao clicar no botão de ajuda
    helpButton.addEventListener("click", function() {
        messageBoard.classList.remove("hidden");
    });

    // Esconder o quadro de mensagem ao clicar no botão OK
    closeButton.addEventListener("click", function() {
        messageBoard.classList.add("hidden");
    });
});