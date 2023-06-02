import AudioController from "Modules/AudioController";
import SettingsView from "./SettingsView";
import EventBus, { GameEvents } from "Modules/GameEventBus";
import IGameData, { gameData, setSettings } from "Modules/GameData";
import { ISettings, LanguageEnum } from "Definitions/Settings";
import { AudioAsset } from "Assets/AssetLibraryAudio";

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

            setSettings({...gameData.settings, isBgmOn: AudioController.instance.bgmOn});
            this.view.setBgmButtonsState(AudioController.instance.bgmOn);
            AudioController.instance.play(AudioAsset.main_button_click.key);
        });

        this.view.registerOnSfxButtonClick(() => {
            AudioController.instance.TurnOnSfx(!AudioController.instance.sfxOn);

            setSettings({...gameData.settings, isSfxOn: AudioController.instance.sfxOn});
            this.view.setSfxButtonsState(AudioController.instance.sfxOn);
            AudioController.instance.play(AudioAsset.main_button_click.key);

        });

        this.view.registerOnLanguageButtonClick(() => {
            AudioController.instance.play(AudioAsset.main_button_click.key);
            setSettings({...gameData.settings, lang: gameData.settings.lang == LanguageEnum.English ? LanguageEnum.Indonesian : LanguageEnum.English});
        });

        EventBus.instance.subscribe(GameEvents.settingsChanged, (data : ISettings) => {
            this.view.onChangeLanguage(data.lang);
        })

    }

    public registerOnClosePopup(callback : Function)
    {
        this.view.registerOnClosePopup(callback);
    }


}