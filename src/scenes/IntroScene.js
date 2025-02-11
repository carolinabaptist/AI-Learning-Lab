class IntroScene extends Phaser.Scene {
    constructor() {
        super({ key: 'IntroScene' });
    }

    create() {
        console.log("IntroScene carregada!")
        this.add.text(200, 100, "Laboratório de IA", {
            fontSize: '60px',
            fontFamily: '"Chewy", cursive',
            color: '#ff4081'
        });
    }
}


export default IntroScene;