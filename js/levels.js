document.addEventListener("DOMContentLoaded", () => {
    let progresso = JSON.parse(localStorage.getItem("progresso")) || { casa1: true, casa2: false, casa3: false };

    function atualizarCasas() {
        Object.keys(progresso).forEach(casa => {
            if (progresso[casa]) {
                document.getElementById(casa).classList.remove("bloqueada");
                document.getElementById(casa).classList.add("desbloqueada");
            }
        });
    }

    function entrarNoJogo(num) {
        alert(`Entrando no Jogo ${num}...`);

        if (num === 1) progresso.casa2 = true; // Ao completar jogo 1, desbloqueia casa 2
        if (num === 2) progresso.casa3 = true; // Ao completar jogo 2, desbloqueia casa 3

        localStorage.setItem("progresso", JSON.stringify(progresso));
        atualizarCasas();
    }

    atualizarCasas();
});

