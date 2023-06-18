import SelectLanguageController from '../scene/languageSelect/SelectLanguageController';
import BootSceneController from '../scene/boot/BootSceneController';
import DebugSceneController from '../scene/debug/DebugSceneController';
import GameplaySceneController from '../scene/gameplay/GameplaySceneController';
import LoadingSceneController from '../scene/loading/LoadingSceneController';
import MainSceneController from '../scene/MainSceneController';
import HomeSceneController from '../scene/home/HomeSceneController';
import CreatePasswordController from '../scene/auth/createPassword/CreatePasswordController';
import LoginSceneController from '../scene/auth/login/LoginSceneController';
import ForgotPasswordController from '../scene/auth/forgotPassword/ForgotPasswordController';
import GamelogSceneController from '../scene/legacy(unused)/logGame/GamelogSceneController';
import ResultSceneController from '../scene/legacy(unused)/result/ResultSceneController';
import CompleteSceneController from 'Scenes/completed/CompletedSceneController';

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
  languageSelectorScene : {
    key: 'SelectLanguageScene',
    module: SelectLanguageController,
  },
  homeScene: {
    key: 'HomeScene',
    module: HomeSceneController
  },
  createPassword: {
    key: 'CreatePassword',
    module: CreatePasswordController
  },
  loginScene: {
    key: 'LoginScene',
    module: LoginSceneController
  },
  forgotPasswordScene: {
    key: 'ForgotPasswordScene',
    module: ForgotPasswordController
  },
  completedScene: {
    key: 'CompletedScene',
    module: CompleteSceneController
  },

  // #Region Development Scene
  debugScene: {
    key: 'DebugScene',
    module: DebugSceneController,
  },
  // #endregion

  // #Region Legacy Scenes (Unused)
  gamelogScene: {
    key: 'GamelogScene',
    module: GamelogSceneController
  },
  resultScene: {
    key: 'ResultScene',
    module: ResultSceneController
  }
  // #endregion

};
