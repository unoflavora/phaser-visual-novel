import SelectLanguageController from '../scene/languageSelect/SelectLanguageController';
import BootSceneController from '../scene/boot/BootSceneController';
import DebugSceneController from '../scene/debug/DebugSceneController';
import GameplaySceneController from '../scene/gameplay/GameplaySceneController';
import LoadingSceneController from '../scene/loading/LoadingSceneController';
import MainSceneController from '../scene/MainSceneController';

export const SceneInfo = {
  bootScene: {
    key: 'BootScene',
    module: BootSceneController,
  },
  mainScene: {
    key: "MainScene",
    module: MainSceneController
  },
  loadingScene: {
    key: 'LoadingScene',
    module: LoadingSceneController,
  },
  gameplayScene: {
    key: 'GameplayScene',
    module: GameplaySceneController,
  },
  debugScene: {
    key: 'DebugScene',
    module: DebugSceneController,
  },
  languageSelectorScene : {
    key: 'SelectLanguageScene',
    module: SelectLanguageController,
  }
};
