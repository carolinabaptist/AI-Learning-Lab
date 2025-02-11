/*responsável por inicializar o Phaser e registrar todas as cenas do jogo*/

import Phaser from "phaser";
import IntroScene from './src/scenes/IntroScene.js';
import LanguageScene from './src/scenes/LanguageMenu.js';
import MapScene from './src/scenes/MapScene.js';
import MiniGame1Scene from './src/scenes/Game1Scene.js';
import MiniGame2Scene from './src/scenes/Game2Scene.js';

const config = {
    
    width: window.innerWidth,
    height: window.innerHeight,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        },
    autoRound: false,
    physics: {
        default: "arcade",
        arcade: {
        gravity: { y: 350 },
        },
    },
    scene: [ // Adiciona todas as cenas ao jogo
        IntroScene,
        LanguageScene,
        MapScene,
        MiniGame1Scene,
        MiniGame2Scene
    ]
};

const game = new Phaser.Game(config)