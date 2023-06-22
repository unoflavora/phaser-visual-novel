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
    private _prevButton: Text;
    private _previousAvailable: boolean = false;



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
        this.add(this._nextButton.gameobject)


        this._prevButton = new Text(scene, 
			this._textBox.gameobject.x - this._textBox.gameobject.displayWidth * this._textBox.gameobject.originX + this._padding, 
			this._nextButton.gameobject.y, "Previous", {
			fontFamily: FontAsset.adobe_caslon_pro_bold.key,
			fontSize: "24px",
			color: FontColors.darkBrown,
			align: "right",
            wordWrap: {
                width: this._textBox.gameobject.displayWidth - 20,
                useAdvancedWrap: true
            }
		});

        
		this._prevButton.gameobject.setOrigin(0, 1);
		this._prevButton.gameobject.setInteractive({useHandCursor: true})
        this._prevButton.gameobject.setFontSize(textBox.gameobject.displayHeight * .09);

        var prevButtonClickArea = scene.add.image(this._prevButton.gameobject.x, this._prevButton.gameobject.y, "");
        prevButtonClickArea.setDisplaySize(this._prevButton.gameobject.displayWidth * 3, this._prevButton.gameobject.displayHeight * 3);
        prevButtonClickArea.setOrigin(0, 1);
        prevButtonClickArea.setInteractive({useHandCursor: true});
        prevButtonClickArea.setAlpha(0.00000000000000000000000001);
        prevButtonClickArea.on("pointerdown", () => {
            this._prevButton.gameobject.emit("pointerdown");
        })

        
        var nextButtonClickArea = scene.add.image(this._nextButton.gameobject.x, this._nextButton.gameobject.y, "");
        nextButtonClickArea.setDisplaySize(this._prevButton.gameobject.displayWidth * 3, this._prevButton.gameobject.displayHeight * 3);
        nextButtonClickArea.setOrigin(1);
        nextButtonClickArea.setInteractive({useHandCursor: true});
        nextButtonClickArea.setAlpha(0.00000000000000000000000001);
        nextButtonClickArea.on("pointerdown", () => {
            this._nextButton.gameobject.emit("pointerdown");
        })


        this.add(this._prevButton.gameobject);

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

        this._prevButton.gameobject.removeAllListeners();
        if(paragraphIndex > 0) {
            this._prevButton.gameobject.once("pointerdown", () => {
                paragraphIndex -= 1;
                this.LoadText(paragraphs, monologue, paragraphIndex);
            });
        }    
        this._previousAvailable = paragraphIndex > 0;

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

    public LoadTextResponse(response : ResponseContext[], monologue : boolean = false, responseIndex: number = 0, paragraphIndex: number = 0) {
        this.clearIntervals();
        this._text.setFontStyle(monologue ? "italic" : "")
        this._textBox.gameobject.removeAllListeners();

        var paragraphs = response[responseIndex].text;

        this._nextButton.gameobject.removeAllListeners();
		this._nextButton.gameobject.once("pointerdown", () => {
            paragraphIndex += 1;
            this.LoadTextResponse(response, monologue, responseIndex, paragraphIndex);
        });

        this._prevButton.gameobject.removeAllListeners();
        this._previousAvailable = responseIndex > 0 || (responseIndex == 0 && paragraphIndex > 0);
        if(this._previousAvailable) {
            this._prevButton.gameobject.once("pointerdown", () => {
                paragraphIndex -= 1;
                this.LoadTextResponse(response, monologue, responseIndex, paragraphIndex);
            });
        }    
        this._prevButton.gameobject.visible = this._previousAvailable;

        if(!this._textBox.gameobject.listenerCount("pointerdown")) {
            this._textBox.gameobject.setInteractive({ useHandCursor: true });
            this._textBox.gameobject.on("pointerdown", () => this.handleTextBoxClick(response[responseIndex].text[paragraphIndex]));
        }   

        if(paragraphIndex < 0)
        {
            responseIndex--;
            paragraphIndex = response[responseIndex].text.length - 1;
            this.LoadTextResponse(response, monologue, responseIndex, paragraphIndex);
            return;
        }

        else if (paragraphIndex < paragraphs.length) 
		{
			this.Type(paragraphs[paragraphIndex]);
            return;
		}
        else
        {
            responseIndex++;
            paragraphIndex = 0;
            if(responseIndex < response.length)
            {
                this.LoadTextResponse(response, monologue, responseIndex, paragraphIndex);
                return;
            }
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
      this._prevButton.gameobject.visible = value && this._previousAvailable;
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
            this.stopTyping(text);
        }
    }
  }
   