// import { GameData }     from "../gameplay/game/GameData";
// import Main             from "./Main";
// import PopUpController  from "./view/PopUpController";
// import { PopUpType }    from "./view/PopUpMap";
import { SceneInfo } from "Definitions/SceneInfo";

export default class MainSceneController extends Phaser.Scene {
    constructor() {
        super({
            key: SceneInfo.mainScene.key
        });
    }    

    preload() { 
        this.load.plugin(
            'rexinputtextplugin', 
            'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexinputtextplugin.min.js', 
            true
        );
    }

    init() 
    {
        // this.main = new Main();        
    }

    async create() {
        // const popUpController = new PopUpController(this);
        // popUpController.init();        

        // this.main.popUpController = popUpController;

        // window.addEventListener('offline', () => {            
        //     popUpController.isOffline = true;
        //     popUpController.openLostConnectionPopUp(PopUpType.LOST_CONNECTION);
        // });
        // window.addEventListener('online', () => {            
        //     popUpController.isOffline = false;            
        // });
        
        const queryString = window.location.search;

        if (queryString) {
            await this.checkTokenToSetPassword(queryString);
        }
        else {
            await this.startGame();
        }
    }

    async startGame() {        
        var refreshToken = window.localStorage.getItem("refreshToken");

        this.scene.launch(SceneInfo.languageSelectorScene.key);

        return;

        // if (refreshToken) 
        // {                         
        //     const restApi = this.main.apiController;
        //     const asyncHelper = this.main.asyncHelper;

        //     //#region Global Error
		// 	 asyncHelper.setPopUP(this);
		// 	 asyncHelper.popUpController.globalPopup.registerPopUpClose(() => {
        //         // window.localStorage.clear();
        //         this.scene.launch(SceneInfo.loginScene.key);
		// 	 })        
		// 	 //#endregion

        //     const response = await asyncHelper.nonFailingRequestAsync(() => restApi.authLoginFromToken(refreshToken));
            
        //     if (response) {
        //         window.localStorage.setItem("refreshToken", response.data.refreshToken);
                
        //         restApi.authorizationToken = response.data.token;
        //         GameData.PLAYER.fullName = response.data.fullName;
        //         GameData.PLAYER.authorizationToken = response.data.token;
        //         GameData.PLAYER.hasPlayed = response.data.hasPlayed;                
                
        //         var spaceIdx = GameData.PLAYER.fullName.indexOf(' ');
        //         var firstName;
        //         if (spaceIdx != -1) {
        //             firstName = GameData.PLAYER.fullName.substring(0, spaceIdx);
        //         }
        //         else {
        //             firstName = GameData.PLAYER.fullName;
        //         }                
        //         GameData.PLAYER.firstName = firstName;
        //         this.scene.launch(SceneInfo.selectLanguageScene.key);
        //         return;
        //     }
        // }

        // this.scene.launch(SceneInfo.loginScene.key);
    }

    async checkTokenToSetPassword(queryString : string) { 
        /**       
        const restApi = this.main.apiController;
        const asyncHelper = this.main.asyncHelper;        

        const urlParams = new URLSearchParams(queryString);        
        const token = urlParams.get('token');
        const action = urlParams.get('action');
        
        const request = token;        

        //#region Global Error
        asyncHelper.setPopUP(this);        
        asyncHelper.popUpController.globalPopup.registerPopUpClose(() => {
            this.scene.launch(SceneInfo.loginScene.key);
        });
        //#endregion
        const res = await asyncHelper.nonFailingRequestAsync(() => restApi.checkTokenToSetPassword(request));
        
        if (!res) {
            this.scene.launch(SceneInfo.tokenScene.key);
        }
        else {
            GameData.PLAYER.setPasswordToken = token;
            
            if (action === 'SET_PASSWORD' || action === 'RESET_PASSWORD') {
                this.scene.launch(SceneInfo.createNewPasswordScene.key);
            }
        }  
        */              
    }
}