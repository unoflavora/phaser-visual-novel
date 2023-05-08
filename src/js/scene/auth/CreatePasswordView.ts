import Text from 'Modules/gameobjects/Text';
import Button from 'Modules/gameobjects/Button';
import Image from 'Modules/gameobjects/Image';
import { UIAsset } from 'Assets/AssetLibraryUi';
import { FontAsset } from 'Assets/AssetLibraryFont';
import { BackgroundAsset } from 'Assets/AssetLibraryUi';
import CreatePasswordController from './CreatePasswordController';
import RexInputText from 'Modules/a3extension/extension/text_extension';
import InputText from 'phaser3-rex-plugins/plugins/inputtext';

export default class CreateNewPasswordView extends Phaser.GameObjects.Container  {

    // UI OBJECTS
    private panel: Image;
    private newPasswordText: Image;
    private newPasswordBox: Image;
    private confirmNewPasswordBox: Image;
    private passwordMissMatchText: Text;
    private updatePasswordButton: Button;
    private confirmationText: Text;
    private confirmNewPasswordText: Text;

    // DOM ELEMENTS
    private passwordInput!: Phaser.GameObjects.DOMElement;
    private confirmPasswordInput!: Phaser.GameObjects.DOMElement;
    
    // Variables
    newPassword: string = "";
    confirmPassword: string = "";

    constructor(scene: Phaser.Scene) {
        super(scene)

        const background = new Image(
            this.scene,
            this.scene.scale.width * 0.5,
            this.scene.scale.height * 0.5,
            BackgroundAsset.background_main.key,
        );
        background.transform.setDisplaySize(this.scene.scale.width, this.scene.scale.height);

        this.panel = new Image(
            this.scene,
            this.scene.scale.width * 0.5,
            this.scene.scale.height * 0.5,
            UIAsset.login_brown_box.key,
        );
        this.panel.transform.setDisplayWidth(this.scene.scale.width * 0.35, true);

        this.confirmNewPasswordBox = new Image(this.scene,0,0, UIAsset.red_text_box.key);

        this.newPasswordBox = new Image (this.scene,0,0,UIAsset.red_text_box.key);
        this.newPasswordBox.transform.setDisplayWidth(this.panel.gameobject.displayWidth * 0.7, true);

        this.newPasswordText = new Image (this.scene,0,0,UIAsset.new_password_text.key);

        this.passwordMissMatchText = new Text(
            this.scene,0,0,
            "Password and Confirm Password didn't match",
            {
                color: '#3F2506',
                align: 'left',
                font: '24px bold',
            },
        ); 

            
        this.updatePasswordButton = new Button(this.scene,0,0,UIAsset.update_password_button.key);

        this.confirmationText = new Text(this.scene,0,0,"RESET");


        this.confirmNewPasswordText = new Text(
            this.scene,0,0,
            UIAsset.confirm_newPassword_text.key,
        );
    

    }

    public create = () => {

        const createNewPasswordTitle = new Image(
            this.scene,
            this.panel.gameobject.x,
            this.panel.gameobject.y - this.panel.gameobject.displayHeight * 0.315,
            UIAsset.create_newPassword_text.key,
        );
        createNewPasswordTitle.transform.setDisplayWidth(this.panel.gameobject.displayWidth * 0.525, true);
        createNewPasswordTitle.gameobject.setOrigin(0.5);

        this.newPasswordText.transform.setPosition(this.panel.gameobject.x - this.panel.gameobject.displayWidth * 0.35,
            createNewPasswordTitle.gameobject.y + createNewPasswordTitle.gameobject.displayHeight * 1.25)
        this.newPasswordText.transform.setDisplayWidth(this.panel.gameobject.displayWidth * 0.225, true);
        this.newPasswordText.gameobject.setOrigin(0, 0.5);

        this.newPasswordBox.transform.setPosition(this.panel.gameobject.x - this.panel.gameobject.displayWidth * 0.35,
            this.newPasswordText.gameobject.y + this.newPasswordText.gameobject.displayHeight * 2.5)
        this.newPasswordBox.gameobject.setOrigin(0, 0.5);

        this.confirmNewPasswordText.transform.setPosition(this.panel.gameobject.x - this.panel.gameobject.displayWidth * 0.35,this.newPasswordBox.gameobject.y + this.newPasswordBox.gameobject.displayHeight)
        this.confirmNewPasswordText.transform.setDisplayWidth(this.panel.gameobject.displayWidth * 0.35, true);
        this.confirmNewPasswordText.gameobject.setOrigin(0, 0.5);
    
        this.confirmNewPasswordBox.transform.setPosition(this.panel.gameobject.x - this.panel.gameobject.displayWidth * 0.35, this.confirmNewPasswordText.gameobject.y + this.confirmNewPasswordText.gameobject.displayHeight * 2.5)
        this.confirmNewPasswordBox.transform.setDisplayWidth(this.panel.gameobject.displayWidth * 0.7, true);
        this.confirmNewPasswordBox.gameobject.setOrigin(0, 0.5);

        this.passwordMissMatchText.gameobject.setWordWrapWidth(this.newPasswordBox.gameobject.displayWidth)
        this.passwordMissMatchText.transform.setPosition(this.confirmNewPasswordBox.gameobject.x,
            this.confirmNewPasswordBox.gameobject.y + this.confirmNewPasswordBox.gameobject.displayHeight * 0.75)
        this.passwordMissMatchText.gameobject.setFontFamily(FontAsset.adobe_caslon_pro_bold.key);
        this.passwordMissMatchText.gameobject.setFontSize(this.panel.gameobject.displayHeight * 0.03);
        this.passwordMissMatchText.gameobject.visible = false;
    

        this.updatePasswordButton.transform.setPosition(this.panel.gameobject.x,this.panel.gameobject.y + this.panel.gameobject.displayHeight * 0.275)
        this.updatePasswordButton.transform.setDisplayWidth(this.panel.gameobject.displayWidth * 0.45, true);
    
    

        // #region DOM Elements
        // DOM Elements should be declared on Phaser-Induced 'Create' Functions since it should be placed after UI Layouts.
        this.passwordInput = this.createPasswordInput(this.scene, this.newPasswordBox, (inputText, e) => {
            this.newPassword = inputText.text;
        });
        
        this.confirmPasswordInput = this.createPasswordInput(this.scene, this.confirmNewPasswordBox, (inputText, e) => {
            this.confirmPassword = inputText.text;
        });

        this.confirmationText.transform.setPosition(this.confirmPasswordInput.x, this.confirmPasswordInput.y + this.confirmPasswordInput.displayHeight * 1.5)   
        this.confirmationText.gameobject.setOrigin(.5)
        // #endregion
    }
        
    initButton(updatePasswordAction: () => void, backToLoginButtonAction: () => void) {
        this.updatePasswordButton.click.on(updatePasswordAction);
    }

    // Create Password Input DOM Element using RexUI 
    createPasswordInput(scene : Phaser.Scene, inputBackground : Image, onTextChange: (i: InputText, e: Event) => void) {
        const input = new RexInputText(
            scene,
            inputBackground.gameobject.x + inputBackground.gameobject.displayWidth * 0.5,
            inputBackground.gameobject.y,
            inputBackground.gameobject.displayWidth,
            inputBackground.gameobject.displayHeight * 0.7,
            {
                type: 'password',
                fontFamily: FontAsset.adobe_caslon_pro_bold.key,
                text: '',
                fontSize: '1.7rem',
                align: "left",
                color: '#F6C167',
                paddingRight: '1.25em',
            },
        ).on('textchange', onTextChange);
        
        input.setOrigin(0.5, 0.3);
    
        const visibilityButton = scene.add.dom(input.x + input.displayWidth * 0.5, input.y, "i", null, "RTES");
        visibilityButton.setOrigin(1, 0.5);
        visibilityButton.addListener('click');
        visibilityButton.on("click", () => {
            const type = input.node.attributes.getNamedItem("type")!.value;
            input.node.setAttribute("type", type == "text" ? "password" : "text");
        });
    
        return input;
    }        
    }
