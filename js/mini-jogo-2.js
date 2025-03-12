document.querySelectorAll(".pixel-button").forEach((button) => {

    button.addEventListener("click", () => {
        let modojogo;

        if (button.textContent === "1"){
            modojogo = 1;
        } else if (button.textContent === "2"){
            modojogo = 2;
        }

        /*console.log("Modo de jogo selecionado:", modojogo);*/

        document.getElementById("tela-inicial").style.display = "none";
    });
});
