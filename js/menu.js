document.addEventListener("DOMContentLoaded", function () {
    let isSpeechUnlocked = sessionStorage.getItem("speechUnlocked") === "true";

    if (isSpeechUnlocked) {
        console.log("A voz já está ativada. Nenhuma ação necessária.");
    } else {
        console.log("A voz ainda não foi ativada. Mostrando o botão de ativação.");
        document.getElementById("enableVoiceButton").style.display = "block";
    }
});

function speakText(element) {
    let isSpeechUnlocked = sessionStorage.getItem("speechUnlocked") === "true";

    if (!isSpeechUnlocked) return; // Se a voz não estiver ativada, não fala nada

    let text = element.innerText;
    let speech = new SpeechSynthesisUtterance(text);
    speech.lang = "pt-PT";
    speech.volume = 1;
    speech.rate = 1;
    speech.pitch = 1;

    window.speechSynthesis.speak(speech);
}
