import './css/index.css';
import Phaser from 'phaser'
import { SceneInfo } from 'Definitions/SceneInfo';

const isLandscape = window.innerWidth > window.innerHeight;

const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

function smallResolution() {
    let smallerSide = isLandscape ? window.innerHeight : window.innerWidth;
    return smallerSide < 480;
}

function toEven(number) {
    const result = Math.round(number);
    return result + (result % 2);
}

// Create method to calculate Screen Profile
function calculateScreen() {
    const dprModifier = smallResolution() ? window.devicePixelRatio : 1;
    return {
        width: toEven(window.innerWidth * dprModifier),
        height: toEven(window.innerHeight * dprModifier),
        zoom: 1 / dprModifier,
    };
}


// TODO : keep ratio between 4:3 and 16:9
function ratioConversion(config) {
    let width = config.width;
    let height = config.height;
    let ratio = width / height;

    if (ratio > (16 / 10)) {
        width = height * (16 / 10);
    }
    else if (ratio < (4 / 3)) {
        height = width * (3 / 4);
    }

    return {
        width: toEven(width),
        height: toEven(height),
        zoom: config.zoom
    };
}

// Set to WebGL in Firefox, using Canvas in Firefox somehow create performance / lagging issues
const renderType= isMobileDevice? Phaser.CANVAS : Phaser.WEBGL;

const screenProfile = ratioConversion(calculateScreen());

const phaserConfig = {
    type: renderType,
    parent: 'game',
    scene: Object.values(SceneInfo).map((v) => v.module),
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.NONE,
        width: screenProfile.width,
        height: screenProfile.height,
        zoom: screenProfile.zoom,
    },
    dom: {
        createContainer: true,
    },
    input: {
        mouse: {
            target: "game"
        },
        touch: {
            target: "game"
        },
    },
    render: {
        antiAlias: false,
        pixelArt: false,
        roundPixels: false,
    },
    plugins: {
        global: [],
    },
    autoRound: false,
    // backgroundColor : "#ffffff",
};
const game = new Phaser.Game(phaserConfig);

// Bind Resize Event
if (CONFIG.AUTO_CANVAS_RESIZE) {
    window.addEventListener('resize', () => {
        const screenProfile = ratioConversion(calculateScreen());
        console.log(screenProfile.width)
        game.scale.resize(screenProfile.width, screenProfile.height);
        game.scale.setZoom(screenProfile.zoom);
    });
}
