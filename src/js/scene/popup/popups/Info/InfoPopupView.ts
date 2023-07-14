import Text from 'Modules/gameobjects/Text';
import Button from 'Modules/gameobjects/Button';
import Image from 'Modules/gameobjects/Image';
import { UIAsset } from 'Assets/AssetLibraryUi';
import { FontColors } from 'Assets/AssetLibraryFont';
import { BackgroundAsset } from 'Assets/AssetLibraryUi';
import Localizations from 'Modules/localization/LocalizationHelper';
import UIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';
import ScrollablePanel from 'phaser3-rex-plugins/templates/ui/scrollablepanel/ScrollablePanel';

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
    private scrollableInfoDesc: Text;
    private rexUi : UIPlugin
    
    // Variables
    emailInput: string = "";

    textStyle =  {
        color: FontColors.darkBrown,
        fontStyle: "bold",
        fontSize: this.scene.scale.height * .02
    }
    scrollablePanel: ScrollablePanel;

    constructor(scene: Phaser.Scene) {
        super(scene)
        this.rexUi = new UIPlugin(scene, scene.plugins, "rexUI")


        this.panel = new Image(
            this.scene,
            this.scene.scale.width * 0.5,
            this.scene.scale.height * 0.5,
            UIAsset.popup_background.key,
        );
        this.panel.transform.setDisplayWidth(this.scene.scale.width * 0.35, true);
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
            this.scene,0,0,
            Localizations.text.mainMenu.auth.forgot_password_title,
            {
                color: FontColors.darkBrown,
                fontStyle: "bold",
                fontSize: this.scene.scale.height * .035,
                wordWrap: { width: this.panel.gameobject.displayWidth * 0.8, useAdvancedWrap: true },
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
                font: "300 Adobe Caslon Pro",
                color: FontColors.darkBrown,
                wordWrap: { width: this.panel.gameobject.displayWidth * 0.8, useAdvancedWrap: true },
                align: "center"
            }
        );
        this.infoDesc.gameobject.setFontSize(this.scene.scale.height * .022)

        this.infoDesc.gameobject.setOrigin(0.5);

        this.scrollableInfoDesc = new Text(this.scene, 0, 0, "",  {
            font: "300 Adobe Caslon Pro",
            color: FontColors.darkBrown,
            wordWrap: { width: this.panel.gameobject.displayWidth * 0.75, useAdvancedWrap: true },
            align: "center"
        })
        this.scrollableInfoDesc.gameobject.setFontSize(this.scene.scale.height * .022)
        this.scrollableInfoDesc.gameobject.setOrigin(.5, 0);

        this.scrollableInfoDesc.gameobject.setPosition(
            this.panel.gameobject.x,
            this.infoTitle.gameobject.y + this.infoTitle.gameobject.displayHeight * .8,
        )

        var scrollTrack = this.scene.add.image(0,0, UIAsset.brown_bg.key);
        scrollTrack.setDisplaySize(this.panel.gameobject.displayWidth * .05, scrollTrack.displayHeight)
        var scrollThumb = this.scene.add.image(0,0, UIAsset.ui_slider_thumb.key);
        scrollThumb.setDisplaySize(scrollTrack.displayWidth * 1.5, scrollTrack.displayWidth * 1.5)

        this.scrollablePanel = this.rexUi.add.scrollablePanel({
            x: this.panel.gameobject.x,
            y: this.infoTitle.gameobject.y + this.infoTitle.gameobject.displayHeight,
            width: this.panel.gameobject.displayWidth * .65,
            height: this.panel.gameobject.displayHeight * .35,

            scrollMode: 0,

            panel: {
                child: this.scrollableInfoDesc.gameobject,

                mask: {
                    padding: 1,
                    // layer: this.add.layer()
                },
            },

            slider: {
                track: scrollTrack,
                thumb: scrollThumb
            },
      
            // scroller: true,
            scroller: {
                // pointerOutRelease: false
            },
      
            mouseWheelScroller: {
                focus: false,
                speed: 0.1
            },

            space: {
                left: 70,
                right: 70,
                top: 10,
                bottom: 10,

                panel: 10,
                // slider: { left: 30, right: 30 },
            }
        })
        this.scrollablePanel.setOrigin(0.5, 0)
        
        this.add(this.scrollableInfoDesc.gameobject)
        this.add(this.scrollablePanel)

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
        message: string | string[],
        iconKey: string, 
        OnConfirm : Function, 
        onConfirmText: string, 
        onCancel : Function | null = null, 
        onCancelText: string | null = null)
    {
        var isMessageIsList = Array.isArray(message);

        if(Array.isArray(message))
        {
            let bulletPoint = "\u{2022}"
            message = message.map((mes) => bulletPoint + " " + mes );
            this.infoDesc.gameobject.setFontSize(this.scene.scale.height * .025)
            this.infoDesc.gameobject.setLineSpacing(this.scene.scale.height * .015);
            this.scrollableInfoDesc.gameobject.setFontSize(this.scene.scale.height * .025)
            this.scrollableInfoDesc.gameobject.setLineSpacing(this.scene.scale.height * .015);
        }
        else
        {
            this.infoDesc.gameobject.setFontSize(this.scene.scale.height * .022)
            this.infoDesc.gameobject.setLineSpacing(0);
            this.scrollableInfoDesc.gameobject.setFontSize(this.scene.scale.height * .022)
            this.scrollableInfoDesc.gameobject.setLineSpacing(0);

        }

        this.infoTitle.gameobject.setText(title);
        this.infoDesc.gameobject.setText(message);

        if(this.infoDesc.gameobject.displayHeight <= this.panel.gameobject.displayHeight * .28)
        {
            this.infoTitle.transform.setPosition(this.panel.gameobject.x,this.panel.gameobject.y - this.panel.gameobject.displayHeight * 0.15,)
            this.infoDesc.gameobject.setPosition(
                this.panel.gameobject.x,
                this.panel.gameobject.y + this.panel.gameobject.displayHeight * 0.1,    
            )
            this.infoDesc.gameobject.setOrigin(.5)

        }
        else
        {
            this.infoTitle.transform.setPosition(this.panel.gameobject.x,this.panel.gameobject.y - this.panel.gameobject.displayHeight * 0.15,)
            this.infoDesc.gameobject.setPosition(
                this.panel.gameobject.x,
                this.infoTitle.gameobject.y + this.infoTitle.gameobject.displayHeight,    
            )
            this.infoDesc.gameobject.setOrigin(.5,0)
        }

        if(this.infoDesc.gameobject.displayHeight <= this.panel.gameobject.displayHeight * .33)
        {
            this.infoDesc.gameobject.setVisible(true)
            this.scrollablePanel.setVisible(false)

        }
        else
        {

            this.infoDesc.gameobject.setVisible(false)
            this.scrollablePanel.scrollToTop()
            this.scrollableInfoDesc.gameobject.setText(message)
            this.scrollableInfoDesc.gameobject.setVisible(true);
            this.scrollablePanel.setPosition(this.panel.gameobject.x, this.infoTitle.gameobject.y + this.infoTitle.gameobject.displayHeight * .5)
            this.scrollablePanel.setVisible(true)
            this.scrollablePanel.layout();
        }

        this.infoIcon.gameobject.setTexture(iconKey);

        this.infoIcon.transform.setDisplayHeight(this.panel.gameobject.displayHeight * .15, true)

        this.confirmButton.removeAllListener();
        this.confirmButton.click.on(OnConfirm);
        this.confirmButtonText.gameobject.setText(onConfirmText);
        this.confirmButtonText.gameobject.handleTextSize(this.confirmButton.gameobject, this.confirmButton.transform.displayHeight * .25)


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
