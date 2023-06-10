import Text from 'Modules/gameobjects/Text';
import Button from 'Modules/gameobjects/Button';
import Image from 'Modules/gameobjects/Image';
import { UIAsset } from 'Assets/AssetLibraryUi';
import { FontColors } from 'Assets/AssetLibraryFont';
import { BackgroundAsset } from 'Assets/AssetLibraryUi';
import Localizations from 'Modules/localization/LocalizationHelper';

export default class InfoPopupView extends Phaser.GameObjects.Group  {
    // UI OBJECTS
    private panel: Image;
    private backButton: Button;
    private backButtonText: Text;
    private confirmButtonText: Text;
    private confirmButton: Button;
    private infoIcon: Image;

    private infoTitle : Text;
    private infoDesc : Text;
    
    // Variables
    emailInput: string = "";

    textStyle =  {
        color: FontColors.darkBrown,
        fontStyle: "bold",
        fontSize: this.scene.scale.height * .02
    }

    constructor(scene: Phaser.Scene) {
        super(scene)


        this.panel = new Image(
            this.scene,
            this.scene.scale.width * 0.5,
            this.scene.scale.height * 0.5,
            UIAsset.popup_background.key,
        );
        this.panel.transform.setDisplayWidth(this.scene.scale.width * 0.32, true);
        this.add(this.panel.gameobject)

        this.infoIcon = new Image(this.scene, 0, 0, UIAsset.icon_close.key);
        this.infoIcon.transform.setDisplayWidth(this.panel.gameobject.displayWidth * 0.1, true);
        this.infoIcon.transform.setPosition(this.panel.gameobject.x, this.panel.gameobject.y - this.panel.gameobject.displayHeight * 0.315)
        this.add(this.infoIcon.gameobject);
        
        this.backButton = new Button(this.scene,0,0,UIAsset.button_frame_secondary.key);
        this.backButtonText = new Text(this.scene,0,0,Localizations.text.interactions.back);
        this.add(this.backButton.gameobject)
        this.add(this.backButtonText.gameobject)

        this.confirmButton = new Button(this.scene,0,0,UIAsset.button_frame_primary.key);
        this.confirmButtonText = new Text(this.scene,0,0, "OK");
        this.add(this.confirmButton.gameobject)
        this.add(this.confirmButtonText.gameobject)

        this.infoTitle = new Text(
            this.scene,
            this.panel.gameobject.x,
            this.panel.gameobject.y - this.panel.gameobject.displayHeight * 0.1,
            Localizations.text.mainMenu.auth.forgot_password_title,
            {
                color: FontColors.darkBrown,
                fontStyle: "bold",
                fontSize: this.scene.scale.height * .035,
                wordWrap: { width: this.panel.gameobject.displayWidth * 0.6, useAdvancedWrap: true },
                align: "center"

            }
        );
        this.infoTitle.gameobject.setOrigin(0.5);
        this.add(this.infoTitle.gameobject)

        
        this.infoDesc = new Text(
            this.scene,
            this.panel.gameobject.x,
            this.panel.gameobject.y + this.panel.gameobject.displayHeight * 0.1,
            Localizations.text.mainMenu.auth.forgot_password_desc,
            {
                color: FontColors.darkBrown,
                fontSize: this.scene.scale.height * .022,
                wordWrap: { width: this.panel.gameobject.displayWidth * 0.78, useAdvancedWrap: true },
                align: "center"
            }
        );

        this.infoDesc.gameobject.setOrigin(0.5);
        this.add(this.infoDesc.gameobject)
    }

    public layoutDefault = () => 
    {   
        this.backButton.transform.setPosition(this.panel.gameobject.x - this.panel.gameobject.displayWidth * .2,this.panel.gameobject.y + this.panel.gameobject.displayHeight * .32)
        this.backButton.transform.setDisplayWidth(this.panel.gameobject.displayWidth * 0.35, true);
        this.backButtonText.transform.setPosition(this.backButton.gameobject.x, this.backButton.gameobject.y)   
        this.backButtonText.gameobject.setOrigin(.5)

        this.confirmButton.transform.setPosition(this.panel.gameobject.x + this.panel.gameobject.displayWidth * .2,this.panel.gameobject.y + this.panel.gameobject.displayHeight * .32)
        this.confirmButton.transform.setDisplayWidth(this.backButton.transform.displayWidth, true);
        this.confirmButtonText.transform.setPosition(this.confirmButton.gameobject.x, this.confirmButton.gameobject.y)
        this.confirmButtonText.gameobject.setOrigin(.5)
    }
        
    addOnConfirmListeners(onConfirm: () => void) {
        this.confirmButton.click.on(onConfirm);
    }

    addOnBackButtonListeners(backAction: () => void) {
        this.backButton.click.on(backAction);
    }

    setupInfo(
        title: string, 
        message: string,
        iconKey: string, 
        OnConfirm : Function, 
        onConfirmText: string, 
        onCancel : Function | null = null, 
        onCancelText: string | null = null)
    {
        this.infoTitle.gameobject.setText(title);
        this.infoDesc.gameobject.setText(message);
        this.infoIcon.gameobject.setTexture(iconKey);

        this.infoIcon.transform.setDisplayHeight(this.panel.gameobject.displayHeight * .15, true)

        this.confirmButton.removeAllListener();
        this.confirmButton.click.on(OnConfirm);
        this.confirmButtonText.gameobject.setText(onConfirmText);

        if(onCancel != null && onCancelText != null)
        {
            this.layoutDefault();
            this.backButton.removeAllListener();
            this.backButton.click.on(onCancel);
            this.backButtonText.gameobject.setText(onCancelText);
        }
        else
        {
            this.backButton.gameobject.setVisible(false);
            this.backButtonText.gameobject.setVisible(false);
            
            this.confirmButton.transform.setPosition(this.panel.gameobject.x, this.panel.gameobject.y + this.panel.gameobject.displayHeight * .32)
            this.confirmButtonText.transform.setPosition(this.confirmButton.gameobject.x, this.confirmButton.gameobject.y)
        }
    }



}
