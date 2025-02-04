import AudioController from "Modules/core/AudioController";
import SettingsView from "./SettingsView";
import EventBus, { GameEvents } from "Modules/core/GameEventBus";
import { ISettings, LanguageEnum } from "Definitions/Settings";
import { AudioAsset } from "Assets/AssetLibraryAudio";
import { SceneInfo } from "Definitions/SceneInfo";
import MainSceneController from "Scenes/MainSceneController";

export default class SettingsController
{
    
    view : SettingsView;
    scene : Phaser.Scene
    
    constructor(popupContainer: Phaser.GameObjects.Container)
    {
        this.scene = popupContainer.scene;

        this.view = new SettingsView(this.scene);

        this.view.setPosition(this.scene.scale.width * .5, this.scene.scale.height * .5);
        this.view.create();
        this.view.setVisible(false);

        popupContainer.add(this.view);
        this.scene.add.existing(this.view);

    }

    public init()
    {
        this.view.registerOnBgmButtonClick(() => {
            AudioController.instance.TurnOnBgm(!AudioController.instance.bgmOn) 
            MainSceneController.instance.settings.setBgmSettings(AudioController.instance.bgmOn);

            this.view.setBgmButtonsState(AudioController.instance.bgmOn);
            AudioController.instance.play(AudioAsset.main_button_click.key);
        });

        this.view.registerOnSfxButtonClick(() => {
            AudioController.instance.TurnOnSfx(!AudioController.instance.sfxOn);

            MainSceneController.instance.settings.setSfxSettings(AudioController.instance.sfxOn);

            this.view.setSfxButtonsState(AudioController.instance.sfxOn);
            AudioController.instance.play(AudioAsset.main_button_click.key);

        });

        this.view.registerOnLanguageButtonClick(() => {
            AudioController.instance.play(AudioAsset.main_button_click.key);
            MainSceneController.instance.settings.setGameLanguage(MainSceneController.instance.gameData.settings.lang == LanguageEnum.English ? LanguageEnum.Indonesian : LanguageEnum.English);
        });

        this.view.registerOnLogout(MainSceneController.instance.Logout.bind(MainSceneController.instance))

        EventBus.instance.subscribe(GameEvents.languageChanged, () => {
            this.view.onChangeLanguage();
        })

    }

    public registerOnClosePopup(callback : Function)
    {
        this.view.registerOnClosePopup(callback);
    }

    OpenPopup() {
        this.view.setVisible(true);
    }


}