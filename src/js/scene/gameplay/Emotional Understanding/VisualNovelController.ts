import EventBus, { GameEvents } from "Modules/core/GameEventBus";
import VisualNovelView from "./VisualNovelView";
import { GameplayAsset } from "Assets/AssetLibraryGameplay";
import { EventHandler, assertUnreachable } from "Modules/helpers/TsHelper";
import { LanguageEnum } from "Definitions/Settings";
import GameplaySceneController from "../GameplaySceneController";
import AudioController from "Modules/core/AudioController";
import MainSceneController from "Scenes/MainSceneController";
import { PopupType } from "Scenes/popup/PopupController";
import {
  IEmotionalUnderstandingProgress,
  SceneState,
} from "Definitions/GameProgress";
import LoadingSceneView from "Scenes/loading/LoadingSceneView";
import { UIAsset } from "Assets/AssetLibraryUi";
import Localizations from "Modules/localization/LocalizationHelper";
import ConsoleHelper from "Modules/helpers/ConsoleHelper";

export default class VisualNovelController {
  view: VisualNovelView;

  eventKey: string = "";

  parentScene: GameplaySceneController;

  audioController: AudioController = AudioController.instance;

  public onFinishNovel: string = "VisualNovelIsFinished";

  public onProgress: string = "OnSceneComplete";

  private _playerAskedForResponse: boolean = false;

  constructor(scene: GameplaySceneController) {
    this.parentScene = scene;

    this.view = new VisualNovelView(scene);

    this.view.create();

    this.view.setVisible(false);

    this.view.registerOnPauseButtonClicked(() =>
      MainSceneController.instance.OpenTemplatePopup(PopupType.Settings)
    );
  }

  public play(progress: IEmotionalUnderstandingProgress | null = null) {
    this.startDummyLoading();

    this.view.setVisible(true);

    var scenes: Scene[] = this.parentScene.cache.json.get(
      GameplayAsset.story.key
    );
    var currentInteraction: EventHandler = () => {};
    this.eventKey = EventBus.instance.subscribe(
      GameEvents.languageChanged,
      () => currentInteraction()
    );

    this.parentScene.scene.scene.events.on("shutdown", () => {
      EventBus.instance.unsubscribe(GameEvents.languageChanged, this.eventKey);
    });

    //#region Scene State
    var currentSceneIndex: number = progress?.currentSceneIndex ?? -1;

    var scene = scenes.find((s) => s.scene == currentSceneIndex)!;

    ConsoleHelper.Log(scene, progress);

    startScene.call(this);

    this.view.on(this.view.events.OnIntroComplete, onFinishIntro.bind(this));

    this.view.on(
      this.view.events.OnPlayerChooseAnswer,
      onPlayerChooseAnswer.bind(this)
    );

    this.view.on(this.view.events.OnResponseFinished, goToNextScene.bind(this));

    function startScene(this: VisualNovelController) {
      const lang = MainSceneController.instance.gameData.settings.lang;

      if (currentSceneIndex == -1) {
        currentSceneIndex = -2;

        goToNextScene.call(this);

        return;
      }

      this.view.SetBackground(scene.background);

      this.audioController.playBGM(scene.audio);

      switch (progress?.currentSceneState) {
        case SceneState.Intro:
          currentInteraction = () =>
            this.view.ShowIntroText(
              scene.scene,
              MainSceneController.instance.gameData.settings.lang ==
                LanguageEnum.English
                ? scene.intro_en
                : scene.intro_id
            );
          currentInteraction();
          break;
        case SceneState.AskEmotion:
          currentInteraction = () => {
            var interaction =
              MainSceneController.instance.gameData.settings.lang ==
              LanguageEnum.English
                ? scene.emotions_en
                : scene.emotions_id;
            this.randomize(interaction);
            this.view.showPrompt(Localizations.text.prompts.emotion);
            this.view.AskPlayerForAnswer(interaction);
          };
          currentInteraction();
          break;
        case SceneState.AskResponse:
          currentInteraction = () => {
            this._playerAskedForResponse = true;
            var interaction =
              MainSceneController.instance.gameData.settings.lang ==
              LanguageEnum.English
                ? scene.response_en
                : scene.response_id;
            this.randomize(interaction);
            this.view.showPrompt(Localizations.text.prompts.response);
            this.view.AskPlayerForAnswer(interaction);
          };
          currentInteraction();
          break;
        case SceneState.ResponseContext:
          this.view.HideOptions();

          // The code finds the index of a selected option by comparing the user's response with text values in response arrays,
          // taking into account different languages.
          var optionValue =
            progress.userResponses[progress.userResponses.length - 1];
          var optionIndex: number;

          var optionIndexEn = scene.response_en.findIndex(
            (res) => res.text == optionValue
          );

          // If previous response are in english
          if (optionIndexEn > -1) {
            optionIndex = optionIndexEn;
            // But current game language is Indonesian
            if (lang == LanguageEnum.Indonesian) {
              // Find the equivalent response in Indonesian
              optionIndex = scene.response_id.findIndex(
                (res) => res.score == scene.response_en[optionIndex].score
              );
            }
          }
          // Else, previous response are in Indonesian
          else {
            optionIndex = scene.response_id.findIndex(
              (res) => res.text == optionValue
            );

            // If the current game language are in English
            if (lang == LanguageEnum.English) {
              // Find the equivalent response in English
              optionIndex = scene.response_en.findIndex(
                (res) => res.score == scene.response_id[optionIndex].score
              );
            }
          }

          var responseContexts =
            lang == LanguageEnum.English
              ? scene.response_en_contexts
              : scene.response_id_contexts;
          currentInteraction = () =>
            this.view.ShowCharacterResponses(responseContexts[optionIndex]);
          currentInteraction();
          break;
        default:
          goToNextScene.call(this);
      }
    }

    function onFinishIntro(this: VisualNovelController) {
      if (scene.has_quest) {
        this.parentScene.events.emit(
          this.onProgress,
          scene,
          SceneState.AskEmotion
        );
        currentInteraction = () => {
          var emotions =
            MainSceneController.instance.gameData.settings.lang ==
            LanguageEnum.English
              ? scene.emotions_en
              : scene.emotions_id;
          this.view.showPrompt(Localizations.text.prompts.emotion);
          this.view.AskPlayerForAnswer(this.randomize(emotions));
        };

        currentInteraction();

        return;
      }

      goToNextScene.call(this);
    }

    function onPlayerChooseAnswer(
      this: VisualNovelController,
      optionValue: string
    ) {
      ConsoleHelper.Log("user choosing this response: " + optionValue);

      if (!this._playerAskedForResponse) {
        // Submit scores and then emit progressing event MUST be in this order.
        // Otherwise score will not be saved.

        askForResponse.call(this, optionValue);

        this.parentScene.events.emit(
          this.onProgress,
          scene,
          SceneState.AskResponse,
          optionValue
        );

        return;
      }

      showNpcResponse.call(this, optionValue);
    }

    function askForResponse(this: VisualNovelController, optionValue: string) {
      var emotionData =
        MainSceneController.instance.gameData.settings.lang ==
        LanguageEnum.English
          ? scene.emotions_en
          : scene.emotions_id;
      var optionIndex = emotionData.findIndex((e) => e.text == optionValue);
      var score = emotionData[optionIndex].score;

      MainSceneController.instance.AddEmotionScore(score);

      currentInteraction = () => {
        var interaction =
          MainSceneController.instance.gameData.settings.lang ==
          LanguageEnum.English
            ? scene.response_en
            : scene.response_id;
        this.view.showPrompt(Localizations.text.prompts.response);
        this.view.AskPlayerForAnswer(this.randomize(interaction));
      };
      currentInteraction();

      this._playerAskedForResponse = true;
    }

    function showNpcResponse(this: VisualNovelController, optionValue: string) {
      // Submit scores and then emit progressing event MUST be in this order.
      // Otherwise score will not be saved.
      var responseData =
        MainSceneController.instance.gameData.settings.lang ==
        LanguageEnum.English
          ? scene.response_en
          : scene.response_id;
      var optionIndex = responseData.findIndex((e) => e.text == optionValue);
      var score = responseData[optionIndex].score;

      var score =
        MainSceneController.instance.gameData.settings.lang ==
        LanguageEnum.English
          ? scene.response_en[optionIndex].score
          : scene.response_id[optionIndex].score;

      MainSceneController.instance.AddRespondScore(score);

      this.parentScene.events.emit(
        this.onProgress,
        scene,
        SceneState.ResponseContext,
        optionValue
      );

      this.view.HideOptions();

      currentInteraction = () =>
        this.view.ShowCharacterResponses(
          MainSceneController.instance.gameData.settings.lang ==
            LanguageEnum.English
            ? scene.response_en_contexts[optionIndex]
            : scene.response_id_contexts[optionIndex]
        );
      currentInteraction();
    }

    function goToNextScene(this: VisualNovelController) {
      currentSceneIndex++;
      this._playerAskedForResponse = false;

      // + 1 for tutorial scene
      if (currentSceneIndex < scenes.length - 1) {
        scene = scenes.find((s) => s.scene == currentSceneIndex)!;

        if (currentSceneIndex > 0)
          this.parentScene.events.emit(
            this.onProgress,
            scene,
            SceneState.Intro
          );

        this.view.ShowCharacter(-1);

        this.view.SetCurrentSceneNumber(scene.scene);

        this.view.SetBackground(scene.background);

        /**
         * scene 4 required different audio from audio index & asset it self
         */
        if (scene.scene === 4) {
          this.audioController.playBGM("bgm-emotion_understanding-sc_04");
        } else {
          this.audioController.playBGM(scene.audio);
        }

        currentInteraction = () =>
          this.view.ShowIntroText(
            scene.scene,
            MainSceneController.instance.gameData.settings.lang ==
              LanguageEnum.English
              ? scene.intro_en
              : scene.intro_id
          );

        currentInteraction();

        return;
      }

      EventBus.instance.unsubscribe(GameEvents.languageChanged, this.eventKey);

      this.parentScene.events.emit(this.onFinishNovel);
    }
  }

  private startDummyLoading() {
    var loading = new LoadingSceneView(
      this.parentScene,
      Localizations.text.loading.minigame,
      false
    );

    var loadingValue = 0;
    var s = setInterval(() => {
      loading.setLoadingValue(loadingValue);
      loadingValue += 0.1;

      if (loadingValue >= 1) {
        clearTimeout(s);
        loading.destroy();
      }
    }, 100);
  }

  private randomize(array: any[]) {
    var tempArray = [...array];

    for (var i = tempArray.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = tempArray[i];
      tempArray[i] = tempArray[j];
      tempArray[j] = temp;
    }

    return tempArray;
  }
}
