import './css/index.css';
import 'phaser/plugins/spine/dist/SpinePlugin';
import { SceneInfo } from 'Definition/SceneInfo';

const isFirefox = /Firefox/i.test(navigator.userAgent);

function smallResolution() {
  return window.innerWidth < 480;
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

// TODO : communicate this convert landscape width and height to portrait with ratio 3:4
function portraitConversion(config) {
  let width = config.width;
  const height = config.height;
  const isLandscape = width > height;

  width = !isLandscape ? width : height * (3 / 4);

  return {
    width: toEven(width),
    height: toEven(height),
    zoom: config.zoom,
  };
}

// Set to WebGL in Firefox, using Canvas in Firefox somehow create performance / lagging issues
const renderType = isFirefox ? Phaser.WEBGL : Phaser.CANVAS;

const screenProfile = portraitConversion(calculateScreen());

const phaserConfig = {
  type: renderType,
  parent: 'game',
  scene: Object.values(SceneInfo).map((v) => v.module),
  scale: {
    mode: Phaser.Scale.NONE,
    autoCenter: Phaser.Scale.Center.CENTER_HORIZONTALLY,
    width: screenProfile.width,
    height: screenProfile.height,
    zoom: screenProfile.zoom,
  },
  dom: {
    createContainer: true,
  },
  render: {
    antiAlias: false,
    pixelArt: false,
    roundPixels: false,
  },
  plugins: {
    scene: [{ key: 'SpinePlugin', plugin: window.SpinePlugin, mapping: 'spine' }],
  },
  autoRound: false,
  // backgroundColor : "#ffffff",
};

const game = new Phaser.Game(phaserConfig);
// Bind Resize Event
if (CONFIG.AUTO_CANVAS_RESIZE) {
  window.addEventListener('resize', () => {
    const screenProfile = portraitConversion(calculateScreen());
    game.scale.resize(screenProfile.width, screenProfile.height);
    game.scale.setZoom(screenProfile.zoom);
  });
}
