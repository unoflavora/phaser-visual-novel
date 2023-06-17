import { IMinigameData, MinigameTypes } from "Definitions/Minigame";
import { LanguageEnum } from "Definitions/Settings";
import MainSceneController from "Scenes/MainSceneController";
import { EventEmitter }     from "events";

export default class MiniGameController {
    public eventNames: { onFinishMiniGame: string; };

    private event: EventEmitter;    
    private scene: Phaser.Scene;
    private minigames = [ "memory-of-spades","puzzle-block", "guess-the-word"]

    private playedMinigames!: MinigameTypes;

    constructor(scene: Phaser.Scene) {
        this.event = new EventEmitter();

        this.scene = scene;

        this.eventNames = {
            onFinishMiniGame: 'onFinishMiniGame',
        }
         
        window.addEventListener('message', this.receiveMessage, false);
    }

    public loadMiniGame = (src : MinigameTypes) => {   
        this.playedMinigames = src;
        var minigame = this.minigames[src];

        var url = `${CONFIG.BASE_GAME_URL}minigames/${minigame}/` +
            `?language=${MainSceneController.instance.gameData.settings.lang == LanguageEnum.English ? "en" : "id"}` +
            `&sound=${MainSceneController.instance.gameData.settings.isSfxOn}` +
            `&music=${MainSceneController.instance.gameData.settings.isBgmOn}`;

        console.log(url)
        this.openWindow(url);
    }

    private receiveMessage = (e : MessageEvent) => {                
        
        this.sendMessage(e.data);
    }

    private sendMessage = (data : IMinigameData) => {    
        switch(data.state) {
            case 'start':
                break;
            case 'end':
                this.closeWindow();

                // this.calculateMiniGameScore(data.game, data.score, data.accuracy, data.timeLeft);
                MainSceneController.instance.settings.setSfxSettings(data.sound);

                MainSceneController.instance.settings.setBgmSettings(data.music);

                MainSceneController.instance.AddMinigameScore(this.playedMinigames, {
                    performance: data.score,
                    accuracy: data.accuracy
                })

                this.scene.events.emit(this.eventNames.onFinishMiniGame, this.playedMinigames);
                break;
        }        
    }

    private openWindow(url: string) 
    {
        var el = document.createElement('iframe');
        el.id = "mini-game";
        el.name = "mini-game";        
        el.width = this.scene.scale.width.toString();
        el.height = this.scene.scale.height.toString();
        el.style.border = "none";
                
        this.scene.add.dom(this.scene.scale.width * 0.5, this.scene.scale.height * 0.5, el); 
        
        window.open(url, "mini-game");

    }

    private closeWindow = () => {
        const iframe = document.querySelector('iframe');
        iframe?.remove();
    }
}

