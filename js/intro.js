let isSpeechUnlocked = false;

function activateVoice() {
    let speech = new SpeechSynthesisUtterance("Voz ativada!");
    speech.lang = "pt-PT";
    window.speechSynthesis.speak(speech);
    
    isSpeechUnlocked = true;

    document.getElementById("voice-icon").style.opacity = "0.6"; 
}

function speakText(element) {
    if (!isSpeechUnlocked) return;

    let text = element.innerText;
    let speech = new SpeechSynthesisUtterance();
    speech.text = text;
    speech.lang = "pt-PT";
    speech.volume = 1;
    speech.rate = 1;
    speech.pitch = 1;

    window.speechSynthesis.speak(speech);
}


