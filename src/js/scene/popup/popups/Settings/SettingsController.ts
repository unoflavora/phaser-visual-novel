import AudioController from "Modules/AudioController";
import SettingsView from "./SettingsView";
import EventBus, { GameEvents } from "Modules/GameEventBus";
import { ISettings, LanguageEnum } from "Definitions/Settings";
import { AudioAsset } from "Assets/AssetLibraryAudio";
import { SceneInfo } from "Definitions/SceneInfo";
import { gameData, setBgmSettings, setGameLanguage, setSfxSettings } from "Modules/GameData";

export default class SettingsController extends Phaser.GameObjects.Group
{
    view : SettingsView;
    
    constructor(scene : Phaser.Scene)
    {
        super(scene);

        this.view = new SettingsView(scene);
        this.scene.add.existing(this);
        this.scene.add.existing(this.view);
        this.add(this.view);

        this.view.setPosition(this.scene.scale.width * .5, this.scene.scale.height * .5);
        this.view.create();
        this.view.setVisible(false);
    }

    public init()
    {
        this.view.registerOnBgmButtonClick(() => {
            AudioController.instance.TurnOnBgm(!AudioController.instance.bgmOn) 
            setBgmSettings(AudioController.instance.bgmOn);

            this.view.setBgmButtonsState(AudioController.instance.bgmOn);
            AudioController.instance.play(AudioAsset.main_button_click.key);
        });

        this.view.registerOnSfxButtonClick(() => {
            AudioController.instance.TurnOnSfx(!AudioController.instance.sfxOn);

            setSfxSettings(AudioController.instance.sfxOn);

            this.view.setSfxButtonsState(AudioController.instance.sfxOn);
            AudioController.instance.play(AudioAsset.main_button_click.key);

        });

        this.view.registerOnLanguageButtonClick(() => {
            AudioController.instance.play(AudioAsset.main_button_click.key);
            setGameLanguage(gameData.settings.lang == LanguageEnum.English ? LanguageEnum.Indonesian : LanguageEnum.English);
        });

        this.view.registerOnLogout(() => {
            var scenes = this.scene.scene.manager.getScenes();

            var loadedScene = scenes.filter(scene => scene.scene.key != SceneInfo.mainScene.key && scene.scene.key != SceneInfo.debugScene.key)

            // remove the currently loaded scene
            loadedScene.forEach(scene => this.scene.scene.stop(scene.scene.key))

            AudioController.instance.stopBGM();
            // load the login scene
            this.scene.scene.launch(SceneInfo.loginScene.key);
        })

       

        EventBus.instance.subscribe(GameEvents.languageChanged, (data : ISettings) => {
            this.view.onChangeLanguage(data.lang);
        })

    }

    public registerOnClosePopup(callback : Function)
    {
        this.view.registerOnClosePopup(callback);
    }


}