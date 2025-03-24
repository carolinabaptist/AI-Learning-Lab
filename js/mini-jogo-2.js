document.getElementById("tela-nomes").style.display = "none";
document.getElementById("placar").style.display = "none";
document.getElementById("msg").style.display = "none";

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

function iniciarSaudacao() {
    const saudacao = `Bem-vindos à corrida de robôs! Hoje na pista temos ${jogador1} contra ${jogador2}. Que vença quem conseguir montar o caminho mais rápido!`;
    falar(saudacao);
}

function iniciarJogo() {

    /*jogando sozinha*/
    jogador = document.getElementById("nome-jogador").value || "Fora de jogo";
    console.log("Jogador:", jogador);

    /*jogo em dupla*/
    jogador1 = document.getElementById("nome-jogador1").value || "Fora de jogo";
    jogador2 = document.getElementById("nome-jogador2").value || "Fora de jogo";// Se for vazio, usa um padrão

    document.getElementById("tela-nomes").style.display = "none";
    document.getElementById("placar").style.display = "block";

    iniciarSaudacao();
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
        if (keyPressCount === 2 || keyPressCount === 4 || keyPressCount ==6) return;
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
                    }, 3000);
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
                    }, 3000);
                }
                return
        }
    });
});
