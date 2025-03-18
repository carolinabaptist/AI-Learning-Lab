document.getElementById("tela-nomes").style.display = "none";
document.getElementById("placar").style.display = "none";

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

document.addEventListener("DOMContentLoaded", function () {
    let score1 = 0;
    let score2 = 0;
    const maxRounds = 2;
    let round = 1;
    let keyPressCount = 0;
    const score1Display = document.getElementById("score1");
    const score2Display = document.getElementById("score2");
    const placar = document.getElementById("placar");

    function isPlacarVisible(){
        return document.getElementById("placar").style.display === "block";
    }

    document.addEventListener("keydown", function (event) {
        if (!isPlacarVisible() || round > maxRounds) return;

        console.log(`Round: ${round}, Max Rounds: ${maxRounds}`);

        keyPressCount++;
        if (keyPressCount === 2 || keyPressCount === 4) return;
        if (event.key === "1") {
                score1++;
                score1Display.textContent = score1;
                round++;
                if (round > maxRounds) {
                    setTimeout(() => {
                        placar.style.display = "none";
                    }, 3000);
                }
                return
        } else if (event.key === "2") {
                score2++;
                score2Display.textContent = score2;
                round++;
                if (round > maxRounds) {
                    setTimeout(() => {
                        placar.style.display = "none";
                    }, 3000);
                }
                return
        }
    });
});
