document.getElementById("tela-jogo").style.display = "none";

let model;

async function carregarModelo() {

    document.getElementById("tela-inicial").style.display = "none";
    document.getElementById("tela-jogo").style.display = "block";

    const modelJson = document.getElementById("modelJson").files[0];
    const weightsBin = document.getElementById("weightsBin").files[0];
    const metadataJson = document.getElementById("metadataJson").files[0];

    try {
        // Carrega o modelo
        const handler = tf.io.browserFiles([modelJson, weightsBin]);
        model = await tf.loadLayersModel(handler);
        console.log("✅ Modelo carregado com sucesso!");

        // Lê o metadata (opcional, mas útil)
        const reader = new FileReader();
        reader.onload = function (event) {
            const metadata = JSON.parse(event.target.result);
            console.log("🧠 Metadata carregado:", metadata);
        };
        reader.readAsText(metadataJson);
        
    } catch (error) {
        console.error("❌ Erro ao carregar o modelo:", error);
        alert("Erro ao carregar o modelo.");
    }
}
