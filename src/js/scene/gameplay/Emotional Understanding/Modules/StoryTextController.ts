import { AudioAsset } from "Assets/AssetLibraryAudio";
import { FontAsset, FontColors } from "Assets/AssetLibraryFont";
import { UIAsset } from "Assets/AssetLibraryUi";
import AudioController from "Modules/core/AudioController";
import Image from "Modules/gameobjects/Image";
import Text from "Modules/gameobjects/Text";
import TagText from "phaser3-rex-plugins/plugins/tagtext";

export class StoryTextController extends Phaser.GameObjects.Group {
    private _textBox : Image;
    private _text: Phaser.GameObjects.Text;
    private _nextButton: Text;
    private _onTypingComplete : Function;
	private _padding: number = 10;
    private _isTyping : boolean = false;
    private _typingEffect : NodeJS.Timer | undefined;



    public get IsTyping() : boolean { return this._isTyping; }

    constructor(scene : Phaser.Scene, textBox : Image, onCurrentTextComplete: Function) {
        super(scene)

        this._textBox = textBox;
        this._padding = this._textBox.gameobject.displayWidth * 0.05;

		this._text = new Phaser.GameObjects.Text(scene, 
			this._textBox.gameobject.x - this._textBox.gameobject.displayWidth * this._textBox.gameobject.originX + this._padding, 
			this._textBox.gameobject.y - this._textBox.gameobject.displayHeight * this._textBox.gameobject.originY + this._padding * .75, 
			"Loading...", {
			fontFamily: FontAsset.adobe_caslon_pro_bold.key,
			color: FontColors.darkBrown,	
		});
        this.scene.add.existing(this._text);
        this.add(this._text);
        this._text.setFontSize(textBox.gameobject.displayHeight * .09);
        this._text.setWordWrapWidth(this._textBox.gameobject.displayWidth - this._padding * 2, true)

		this._nextButton = new Text(scene, 
			this._textBox.gameobject.x + this._textBox.gameobject.displayWidth * this._textBox.gameobject.originX - this._padding, 
			this._textBox.gameobject.y + this._textBox.gameobject.displayHeight * this._textBox.gameobject.originY - this._padding * .5, "Next", {
			fontFamily: FontAsset.adobe_caslon_pro_bold.key,
			fontSize: "24px",
			color: FontColors.darkBrown,
			align: "right",
            wordWrap: {
                width: this._textBox.gameobject.displayWidth - 20,
                useAdvancedWrap: true
            }
		});
		this._nextButton.gameobject.setOrigin(1);
		this._nextButton.gameobject.setInteractive({ useHandCursor: true })
        this._nextButton.gameobject.setFontSize(textBox.gameobject.displayHeight * .09);

        this.add(this._nextButton.gameobject);

        this._onTypingComplete = onCurrentTextComplete;

        this.scene.events.on("shutdown", this.clearIntervals, this)
        
    }

    public LoadText(paragraphs: string[], monologue : boolean = false, paragraphIndex: number = 0) {
        this.clearIntervals();
        
        this._text.setFontStyle(monologue ? "italic" : "")
        this._textBox.gameobject.removeAllListeners();
        this._nextButton.gameobject.removeAllListeners();

		this._nextButton.gameobject.once("pointerdown", () => {
            paragraphIndex += 1;
            this.LoadText(paragraphs, monologue, paragraphIndex);
        });

        if(!this._textBox.gameobject.listenerCount("pointerdown")) {
            this._textBox.gameobject.setInteractive({ useHandCursor: true });
            this._textBox.gameobject.on("pointerdown", () => this.handleTextBoxClick(paragraphs[paragraphIndex]));
        }   

		
        if (paragraphIndex < paragraphs.length) 
		{
			this.Type(paragraphs[paragraphIndex]);
            return;
		}

        this.nextButtonVisible = false;

        this._onTypingComplete();

	}
  
    private Type = (textToType : string): void => {
        this._text.setText("");
        this.nextButtonVisible = false;
        this._isTyping = true;
        
        let i = 0;
        this._typingEffect = setInterval(() => {
            this._text.text += textToType[i];
            i += 1;
            if (i >= textToType.length) {
                this.stopTyping(textToType);
            }
        }, 20)	
      
       
    }
  
    private stopTyping(text: string) 
    {
        this.clearIntervals();

        this.nextButtonVisible = true;    

        this._isTyping = false;

        this._text.setText(text);
    }

    private clearIntervals() {
        if (this._typingEffect != undefined) {
            clearInterval(this._typingEffect);

            this._typingEffect = undefined;
        }
    }

    private set nextButtonVisible(value: boolean) {
      this._nextButton.gameobject.visible = value;
    }

    public set OnTextComplete(callback : Function)
    {
        this._onTypingComplete = () => {
            this._nextButton.gameobject.removeAllListeners();
            this._textBox.gameobject.removeAllListeners();
            this._textBox.gameobject.disableInteractive();
            callback();
        };
    }

    private handleTextBoxClick = (text: string) => {
        AudioController.instance.play(AudioAsset.main_button_click.key);
        
        if(this._isTyping) {
            console.log("Skip typing", text);
            this.stopTyping(text);
        }
    }

    

  }
   