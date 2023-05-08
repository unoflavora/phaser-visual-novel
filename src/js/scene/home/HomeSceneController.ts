import { SceneInfo }            from "Definitions/SceneInfo";
import HomeSceneView            from "./HomeSceneView";
import { AudioAsset }           from "Assets/AssetLibraryAudio";
import { UIAsset }              from "Assets/AssetLibraryUi";


export default class HomeSceneController extends Phaser.Scene {

    view : HomeSceneView | undefined

    constructor() {
        super({
            key: SceneInfo.homeScene.key,
        });
    }

    init = () => {        
    //     this.main = Main.getInstance();
    //     this.audioController = AudioController.getInstance();        
    //     if (!GameData.SETTING.isMusicMute) {            
    //         if (!this.audioController.bgm) {                
    //             this.audioController.playBGM(AudioAsset.bgm_joy.key, false);
    //             this.audioController.setBGMVolume(0.2, false);
    //         }
    //     }		
        // this.view = new HomeSceneView(this);
        // this.view.create();        

    //     //#region PopUp
    //     this.main.popUpController.lostConnectionPopup.registerPopUpOpen(() => {
    //         this.view.setInteractiveListener(false);
    //     });

    //     this.main.popUpController.lostConnectionPopup.registerPopUpClose(() => {
    //         this.main.popUpController.lostConnectionPopup.hide();
    //         new Promise((resolve) => {
    //             setTimeout(() => {
    //                 if (this.main.popUpController.isOffline) {
    //                     this.main.popUpController.lostConnectionPopup.show();
    //                 }
    //                 else {                        
    //                     this.view.setInteractiveListener(true);
    //                 }
    //             }, 200);
    //         });            
    //     });

    //     this.popUpController = new PopUpController(this);
    //     this.popUpController.init();       

    //     this.popUpController.infoPopup.registerPopUpClose(() => {
    //         this.view.setInteractiveListener(true);
    //     });

    //     this.popUpController.beginPopup.registerOnBegin(() => {            
    //         this.scene.start(SceneInfo.avatarSelectionScene.key);
    //     });
    //     //#endregion        

    //     if (CONFIG.DEMO) {
    //         this.popUpController.openInfoPopUp(PopUpType.DEMO);
    //     }

    //     //#region Pause
    //     this.pauseController = new PauseController(this);
    //     this.pauseController.init();        

    //     this.pauseController.view.registerOnCloseButton(() => {
    //         if (!GameData.SETTING.isSoundMute) this.audioController.play(AudioAsset.main_button_click.key);
    //         this.view.setInteractiveListener(true);
    //     });

    //     this.pauseController.view.registerOnChangeMusic(() => {            
    //         if (!GameData.SETTING.isMusicMute) {
    //             this.audioController.playBGM(AudioAsset.bgm_joy.key, false);
    //             this.audioController.setBGMVolume(0.2, false);
    //         }
    //         else {
    //             this.audioController.stopBGM(true);
    //         }
    //     });

    //     this.pauseController.view.registerOnChooseLanguage(() => {
    //         this.view.changeLanguage(GameData.SETTING.isEnglish);
    //         this.pauseController.view.pauseTitleText.gameobject.setTexture(
    //             (GameData.SETTING.isEnglish) ? UIAsset.text_options_mainmenu.key : UIAsset.text_options_mainmenu_id.key
    //         );
    //     });
    //     //#endregion
        

    //     let startMissionAction = () => {            
    //         if (!GameData.SETTING.isSoundMute) this.audioController.play(AudioAsset.main_button_click.key);                        
    //         ScreenUtilityController.getInstance().isAutoChangeOrientation = false;

    //         if (GameData.PLAYER.hasPlayed) {                
    //             this.popUpController.openInfoPopUp(PopUpType.PLAYER_HAS_PLAYED);
    //         }
    //         else {
    //             this.popUpController.openBeginPopUp();
    //         }            
    //         this.view.setInteractiveListener(false);
            
    //     }

    //     let overviewAction = () => {            
    //         if (!GameData.SETTING.isSoundMute) this.audioController.play(AudioAsset.main_button_click.key);

    //         if (CONFIG.DEMO) {
    //             this.popUpController.openInfoPopUp(PopUpType.DEMO);
    //             return;
    //         }
            
    //         this.main.popUpController.removeLostConnectionPopUpListener();
            
    //         this.scene.start(SceneInfo.overviewScene.key);
    //     }

    //     let settingAction = () => {            
    //         if (!GameData.SETTING.isSoundMute) this.audioController.play(AudioAsset.main_button_click.key);                        
            
    //         this.pauseController.view.pauseTitleText.gameobject.setTexture(
    //             (GameData.SETTING.isEnglish) ? UIAsset.text_options_mainmenu.key : UIAsset.text_options_mainmenu_id.key
    //         );
    //         this.pauseController.show();
    //         this.view.setInteractiveListener(false);
    //     }

    //     let logoutAction = async () => {                  
    //         window.localStorage.clear();
    //         this.main.popUpController.removeLostConnectionPopUpListener();
    //         this.scene.start(SceneInfo.loginScene.key);
    //         this.audioController.stopBGM();

    //         GameData.SETTING.isEnglish = true;
    //         GameData.SETTING.isSoundMute = false;
    //         GameData.SETTING.isMusicMute = false;
            
    //         var restApi = this.main.apiController;
    //         var response = await restApi.logout();            
    //     }

    //     this.view.initButton(startMissionAction, overviewAction, settingAction, logoutAction);        
    }
}