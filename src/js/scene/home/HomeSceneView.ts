import Button from "Modules/gameobjects/Button";
import Image from "Modules/gameobjects/Image";
import Text from "Modules/gameobjects/Text";
import { FontAsset } from "Assets/AssetLibraryFont";
import { BackgroundAsset, UIAsset } from "Assets/AssetLibraryUi";
import Localizations from "Modules/localization/LocalizationHelper";


export default class HomeSceneView extends Phaser.GameObjects.Container {

    // UI Objects
    startButton : Button;
    startButtonText : Text;

    gameLogButton : Button;
    gameLogButtonText: Text;

    settingButton : Button;
    settingText : Text;

    gameTitle : Image;
    recommendText : Text;

    // Global Variables
    xPos = this.scene.scale.width * 0.5;
    yPos = this.scene.scale.height * 0.5;        

    constructor(scene : Phaser.Scene) {
        super(scene);
        scene.add.existing(this);

        const background = new Image(
            this.scene,
            this.scene.scale.width * 0.5,
            this.scene.scale.height * 0.5,
            BackgroundAsset.background_main.key,
        );
        background.transform.setDisplaySize(this.scene.scale.width, this.scene.scale.height);

        this.gameTitle = new Image (this.scene, this.xPos, this.scene.scale.height * .2, UIAsset.game_title.key);
        this.gameTitle.transform.setDisplayWidth(this.scene.scale.width * 0.25, true);

        this.startButton = new Button (this.scene,this.xPos, this.scene.scale.height * .45, UIAsset.button_frame_primary.key);
        this.startButtonText = new Text (this.scene, this.startButton.gameobject.x, this.startButton.gameobject.y, Localizations.text.mainMenu.startGame);  
        this.startButtonText.gameobject.setOrigin(.5)
        this.startButtonText.gameobject.handleTextSize(this.startButton.gameobject, this.startButton.gameobject.displayHeight * 0.2);

        this.gameLogButton = new Button (this.scene, 0, 0, UIAsset.button_frame_secondary.key);
        this.gameLogButtonText = new Text (this.scene,0,0, Localizations.text.mainMenu.gameLog);
        this.gameLogButtonText.gameobject.setOrigin(.5)
        this.gameLogButtonText.gameobject.handleTextSize(this.gameLogButton.gameobject, this.gameLogButton.gameobject.displayHeight * 0.2);


        this.settingButton = new Button ( this.scene, 0,0 , UIAsset.button_frame_secondary.key);
        this.settingText = new Text(this.scene, 0,0, Localizations.text.mainMenu.settings.title);
        this.settingText.gameobject.setOrigin(.5)
        this.settingText.gameobject.handleTextSize(this.settingButton.gameobject, this.settingButton.gameobject.displayHeight * 0.2);

        
        this.recommendText = new Text (
            this.scene, 0, 0, Localizations.text.mainMenu.recommendation, 
            {
                color: "#3D3D3D",
                align: "center",
                font: "24px"
            }
        );

    }

    create = () => {


        this.startButton.transform.setDisplayWidth(this.scene.scale.width * 0.2, true);
        this.startButtonText.transform.setFontSize(this.startButton.gameobject.displayHeight * .15);
        
        let gameLogButtonPos = { x: this.startButton.gameobject.x, y: this.startButton.gameobject.y + this.startButton.gameobject.displayHeight * .7}
        this.gameLogButton.transform.setPosition(gameLogButtonPos.x, gameLogButtonPos.y);
        this.gameLogButton.transform.setDisplayWidth(this.scene.scale.width * .18, true);
        this.gameLogButtonText.transform.setPosition(this.gameLogButton.gameobject.x, this.gameLogButton.gameobject.y)
        this.gameLogButtonText.transform.setFontSize(this.gameLogButton.gameobject.displayHeight * .12)

        let settingButtonPos = {x: this.gameLogButton.gameobject.x, y: this.gameLogButton.gameobject.y + this.gameLogButton.gameobject.displayHeight * .7}
        this.settingButton.transform.setPosition(settingButtonPos.x, settingButtonPos.y)
        this.settingButton.transform.setDisplayWidth(this.scene.scale.width * 0.18, true);
        this.settingText.transform.setPosition(this.settingButton.gameobject.x, this.settingButton.gameobject.y);
        this.settingText.transform.setFontSize(this.settingButton.gameobject.displayHeight * .12);

        let recommendationPos = {x : this.settingButton.gameobject.x, y: this.settingButton.gameobject.y + this.settingButton.gameobject.displayHeight}
        this.recommendText.transform.setPosition (recommendationPos.x, recommendationPos.y)
        this.recommendText.gameobject.setFontFamily(FontAsset.adobe_caslon_pro_bold.key);
        this.recommendText.gameobject.setFontSize(this.scene.scale.height * 0.025);
        this.recommendText.gameobject.setOrigin(0.5, 0.5);
    }

    
    initButton = (startMissionAction : Function, overviewAction : Function, settingAction : Function) => 
    {
        this.startButton.click.on(startMissionAction);
        this.gameLogButton.click.on(overviewAction);
        this.settingButton.click.on(settingAction);
    }

    setInteractiveListener = (isInteractive : boolean) => {

        if (isInteractive) {
            this.startButton.gameobject.setInteractive();
            this.gameLogButton.gameobject.setInteractive();
            this.settingButton.gameobject.setInteractive();
            return;
        }

        this.startButton.gameobject.disableInteractive();
        this.gameLogButton.gameobject.disableInteractive();
        this.settingButton.gameobject.disableInteractive();
  
    }

    onLanguageChange = () => {
        this.startButtonText.gameobject.setText(Localizations.text.mainMenu.startGame);
        this.gameLogButtonText.gameobject.setText(Localizations.text.mainMenu.gameLog);
        this.settingText.gameobject.setText(Localizations.text.mainMenu.settings.title);
        this.recommendText.gameobject.setText(Localizations.text.mainMenu.recommendation);
    }
}