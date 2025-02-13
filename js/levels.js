// Seleciona elementos do jogo
let jogador = document.querySelector(".jogador");
let casas = document.querySelectorAll(".casa");
let nivelAtual = 1;
let posicaoX = 50;

// Captura evento de teclado para movimentação do jogador
document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight" && posicaoX < 480) {
        posicaoX += 60;
        jogador.style.left = posicaoX + "px";
    }
    if (event.key === "ArrowLeft" && posicaoX > 50) {
        posicaoX -= 60;
        jogador.style.left = posicaoX + "px";
    }
});

// Adiciona evento de clique nas casas
casas.forEach((casa) => {
    casa.addEventListener("click", () => {
        let nivel = parseInt(casa.dataset.nivel);
        if (nivel <= nivelAtual) {
            alert("Iniciando Jogo " + nivel);
            nivelAtual++; 
            desbloquearCasas();
        } else {
            alert("Complete o nível anterior primeiro!");
        }
    });
});

// Função para desbloquear as casas conforme o jogador avança
function desbloquearCasas() {
    casas.forEach((casa) => {
        let nivel = parseInt(casa.dataset.nivel);
        if (nivel <= nivelAtual) {
            casa.classList.add("desbloqueada");
        }
    });
}
