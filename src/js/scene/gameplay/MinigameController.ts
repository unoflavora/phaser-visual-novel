import { IMinigameData, MinigameTypes } from "Definitions/Minigame";
import { LanguageEnum } from "Definitions/Settings";
import { gameData, setBgmSettings, setSfxSettings } from "Modules/core/GameData";
import { EventEmitter }     from "events";

export default class MiniGameController {
    public eventNames: { onFinishMiniGame: string; };

    private event: EventEmitter;    
    private scene: Phaser.Scene;
    private minigames = [ "puzzle-block", "memory-of-spades", "guess-the-word"]
    private playedMinigames!: MinigameTypes;

    constructor(scene: Phaser.Scene) {
        this.event = new EventEmitter();

        this.scene = scene;

        this.eventNames = {
            onFinishMiniGame: 'onFinishMiniGame',
        }
         
        window.addEventListener('message', this.receiveMessage, false);
    }



    public registerOnFinishMiniGame = (events : (minigameType: MinigameTypes) => void) => {
        this.event.on(this.eventNames.onFinishMiniGame, events);
    }

    public loadMiniGame = (src : MinigameTypes) => {   
        this.playedMinigames = src;
        var minigame = this.minigames[src];

        var url = `${CONFIG.BASE_GAME_URL}minigames/${minigame}/` +
            `?language=${gameData.settings.lang == LanguageEnum.English ? "en" : "id"}` +
            `&sound=${gameData.settings.isSfxOn}` +
            `&music=${gameData.settings.isBgmOn}`;

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
                setSfxSettings(data.sound);

                setBgmSettings(data.music);

                this.event.emit(this.eventNames.onFinishMiniGame, this.playedMinigames);
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

