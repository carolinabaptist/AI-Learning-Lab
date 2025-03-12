document.getElementById("tela-nomes").style.display = "none";

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
        document.getElementById("tela-nomes").style.display = "block";

        if (modojogo === 1) {
            document.getElementById("um-jogador").style.display = "flex";
            document.getElementById("dois-jogadores").style.display = "none"; 
        } else {
            document.getElementById("um-jogador").style.display = "none";
            document.getElementById("dois-jogadores").style.display = "flex";
        }
    });
});

let jogador1 = "";
let jogador2 = "";
let jogador = "";
let pontuacao1 = 0;
let pontuacao2 = 0;

function iniciarJogo() {

    /*jogando sozinha*/
    jogador = document.getElementById("nome-jogador").value || "Fora de jogo";
    console.log("Jogador:", jogador);

    /*jogo em dupla*/
    jogador1 = document.getElementById("nome-jogador1").value || "Fora de jogo";
    console.log("Jogador 1:", jogador1);
    jogador2 = document.getElementById("nome-jogador2").value || "Fora de jogo";// Se for vazio, usa um padrão
    console.log("Jogador 2:", jogador2);

    document.getElementById("tela-nomes").style.display = "none";
    document.getElementById("placar").style.display = "block";
}