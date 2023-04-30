import BootSceneController from '../scene/boot/BootSceneController';
import DebugSceneController from '../scene/debug/DebugSceneController';
import GameplaySceneController from '../scene/gameplay/GameplaySceneController';
import LoadingSceneController from '../scene/loading/LoadingSceneController';

export const SceneInfo = {
  bootScene: {
    key: 'BootScene',
    module: BootSceneController,
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
};
