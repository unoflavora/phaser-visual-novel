import { GameplayAsset } from "Assets/AssetLibraryGameplay";
import { BackgroundAsset } from "Assets/AssetLibraryUi";
import Image from "Modules/gameobjects/Image";
import MainSceneController from "Scenes/MainSceneController";

export default class CharacterController extends Phaser.GameObjects.Group {
  private character: Image;

  private tweens: ((value: void | PromiseLike<void>) => void)[] = [];

  private m_key: string;

  constructor(scene: Phaser.Scene) {
    super(scene);
    scene.add.existing(this);

    this.m_key = "";

    const GAME_DATA = MainSceneController.instance.gameData;
    const SCENE_INDEX = GAME_DATA.progress.emotionalUnderstanding.currentSceneIndex;

    let imageChar = "";

    /**
     * @BUG character back to Ifuly when reload the game after enduser reload the browser
     * @author Prana Ron
     * @brief
     * - 4th param of new Image(...) need to be check
     * - why specify 4th param when object wasn't on the memory?
     * - using MainSceneController instance for current scene index resulting missing image
     * @note
     * - please fixed this later when you found better solution
     * - current solution may not secure, although the data is not sensitive
    */
    if (SCENE_INDEX <= 1)
    {
        imageChar = `char-story-sc_01`;
    }
    else
    {
        imageChar = `char-story-sc_0${SCENE_INDEX.toString()}`;
    }
    this.character = new Image(
        scene,
        scene.scale.width * 0.5,
        scene.scale.height * 0.5,
        imageChar
    );

    this.add(this.character.gameobject);
  }

  public LoadCharacter = (currentSceneIndex: number) => {
    this.m_key = "char-story-sc_0" + currentSceneIndex;

    this.character.transform.setDisplaySize(
      this.scene.scale.width * 1.5,
      this.scene.scale.height * 1.5
    );
    if (GameplayAsset[this.m_key as keyof typeof GameplayAsset] == undefined) {
      this.setVisible(false);
      this.character.gameobject.setTexture(BackgroundAsset.background_main.key);
      return;
    }

    if (this.character.gameobject.texture.key === this.m_key) return;

    this.fadeIn(this.m_key);
  };

  private async fadeIn(key: string) {
    this.character.gameobject.setTexture(key);

    // await this.fadeOut();

    this.character.transform.setPosition(this.scene.scale.width * 0.5, 0);

    await new Promise<void>((resolve) => {
      this.tweens.push(resolve);

      var targetY = this.scene.scale.height * 0.75;

      this.scene.tweens.add({
        targets: this.character.gameobject,
        y: targetY,
        duration: 500,
        ease: "Power2",
        onStart: () => {
          this.character.gameobject.setVisible(true);
        },
      });
    });
  }

  private async fadeOut() {
    let character = this.character;

    if (character == undefined) return;
    let targetY: number = 0;

    await new Promise<void>((resolve) => {
      this.tweens.push(resolve);

      this.scene.tweens.add({
        targets: character?.gameobject,
        y: targetY,
        duration: 1000,
        ease: "Power2",
        onComplete: () => {
          character?.gameobject.setVisible(false);
          this.tweens.splice(this.tweens.indexOf(resolve), 1);
          resolve();
        },
      });
    });
  }

  private initCharacterPosition()
  {
    this.character.transform.setPosition(
        this.scene.scale.width * 0.5,
        (this.scene.scale.width * 0.5) + 64
    );
  }

  public FinishTween = () => {
    this.tweens.filter((resolve) => {
      resolve();
      return false;
    });
  };
}
