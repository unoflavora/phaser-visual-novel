import ScreenUtilityController from "Modules/ScreenUtilityController";
import Text from "Modules/gameobjects/Text";
import Image from "Modules/gameobjects/Image";

import { UIAsset } from "Assets/AssetLibraryUi";
import { EventEmitter } from "events";
import { FontAsset, FontColors } from "Assets/AssetLibraryFont";
import { BackgroundAsset } from "Assets/AssetLibraryUi";
import { LanguageEnum } from "Definitions/Settings";
import { assertUnreachable } from "Modules/helpers/TsHelper";
import Phaser from "phaser";
import Localizations from "Modules/localization/LocalizationHelper";

export default class SelectLanguageView extends Phaser.GameObjects.Container {

    // Controllers
    screenUtility : ScreenUtilityController = ScreenUtilityController.getInstance();
    events : EventEmitter = new EventEmitter();

    // UI Objects
    objectContainer : Phaser.GameObjects.Container
    textContainer : Phaser.GameObjects.Container
    languageContainer : Phaser.GameObjects.Container
    flagId : Image
    flagEn : Image

    // fields
    eventKeys = {
        OnLogin: 'OnLogin',
        OnForgotPassword: 'OnForgotPassword',
        OnEnglishClicked: 'OnEnglishClick',
        OnIndonesiaClicked: 'OnIndonesiaClicked'
    }
    email : string = '';
    password : string = '';

    constructor(scene : Phaser.Scene) 
    {        
        super(scene);

        scene.add.existing(this)

        this.objectContainer = this.scene.add.container(0, 0);
        this.textContainer = this.scene.add.container(0, 0);        
        this.languageContainer = this.scene.add.container(0,0);
    
        let xPos = this.scene.scale.width * 0.5;

        let yPos = this.scene.scale.height * 0.25;

        this.flagId = new Image(this.scene, xPos + this.scene.scale.width * .15, yPos * 2, UIAsset.language_flag_id.key)

        this.flagEn = new Image(this.scene, xPos - this.scene.scale.width * .15, yPos  * 2, UIAsset.language_flag_en.key)

        var title = new Text( this.scene, xPos, yPos * 1.2, Localizations.text.select_language, {
            fontFamily: FontAsset.adobe_caslon_pro_bold.key,
            color: FontColors.lightBrown
        });

        title.gameobject.setOrigin(.5)

        title.gameobject.setFontSize(this.scene.scale.height * 0.08);  
    }


    create = () => {        
        this.add([this.objectContainer, this.textContainer, this.languageContainer]);

        var background = new Image(
            this.scene,
            this.scene.scale.width * 0.5,
            this.scene.scale.height * 0.5,
            BackgroundAsset.background_main.key
        );

        this.objectContainer.add(background.gameobject);

        background.transform.setDisplaySize(this.scene.scale.width, this.scene.scale.height);     

        this.setupFlag(this.flagEn, () => this.events.emit(this.eventKeys.OnEnglishClicked), "English");

        this.setupFlag(this.flagId, () => this.events.emit(this.eventKeys.OnIndonesiaClicked), "Indonesian");
    }

    registerOnLanguageClicked (callback : (language : LanguageEnum) => void)
    {
        this.events.on(this.eventKeys.OnEnglishClicked, () => { callback(LanguageEnum.English) });
        
        this.events.on(this.eventKeys.OnIndonesiaClicked, () => { callback(LanguageEnum.Indonesian) })
    }
        
    private setupFlag(flag : Image, onClickCallback : () => void, text: string) 
    {
        flag.transform.setDisplaySize(this.scene.scale.width * .225, 0);
        flag.transform.setDisplayHeightToAspectRatio();
        flag.gameobject.setInteractive();
        flag.gameobject.on('pointerdown', onClickCallback);
        
        var textObj = new Text(
            this.scene,
            flag.gameobject.x,
            flag.gameobject.y + flag.gameobject.displayHeight * .6,
            text,
            {
                fontFamily: FontAsset.minion_variable_concept.key,
                color: FontColors.lightBrown
                
            }
        );
    
        textObj.gameobject.setOrigin(.5, 0);
        textObj.gameobject.setFontSize(this.scene.scale.height * 0.04);
        textObj.gameobject.setInteractive();
        textObj.gameobject.on('pointerdown', onClickCallback);
    }
    
}