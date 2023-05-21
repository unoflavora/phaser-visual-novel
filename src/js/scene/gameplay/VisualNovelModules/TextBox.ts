import { FontAsset } from "Assets/AssetLibraryFont";
import Image from "Modules/gameobjects/Image";
import Text from "Modules/gameobjects/Text";
import TagText from "phaser3-rex-plugins/plugins/tagtext";

export class TextBox extends Phaser.GameObjects.Group {
    private _textBox : Image;
    private _text: TagText;
    private _nextButton: Text;
    private _onTypingComplete : Function;
	private _padding: number = 10;
    private _isTyping : boolean = false;
    private _typingEffect : NodeJS.Timer | undefined;
    
    public get IsTyping() : boolean { return this._isTyping; }

    constructor(scene : Phaser.Scene, textBox : Image, onCurrentTextComplete: Function) {
        super(scene)

        this._textBox = textBox;
        this._padding = this._textBox.gameobject.displayWidth * 0.02;

		this._text = new TagText(scene, 
			this._textBox.gameobject.x - this._textBox.gameobject.displayWidth * this._textBox.gameobject.originX + this._padding, 
			this._textBox.gameobject.y - this._textBox.gameobject.displayHeight * this._textBox.gameobject.originY + this._padding, 
			"Loading...", {
			fontFamily: FontAsset.adobe_caslon_pro_bold.key,
			fontSize: "24px",
			color: "#ffffff",	
		});
        this.scene.add.existing(this._text);
        this.add(this._text);
        this._text.setWordWrapWidth(this._textBox.gameobject.displayWidth - this._padding * 2)
        this._text.setWrapMode("word");

		this._nextButton = new Text(scene, 
			this._textBox.gameobject.x + this._textBox.gameobject.displayWidth * this._textBox.gameobject.originX - 10, 
			this._textBox.gameobject.y + this._textBox.gameobject.displayHeight * this._textBox.gameobject.originY - 10, "Next", {
			fontFamily: FontAsset.adobe_caslon_pro_bold.key,
			fontSize: "24px",
			color: "#ffffff",
			align: "right",
            wordWrap: {
                width: this._textBox.gameobject.displayWidth - 20,
                useAdvancedWrap: true
            }
		});
		this._nextButton.gameobject.setOrigin(1);
		this._nextButton.gameobject.setInteractive({ useHandCursor: true })
        this.add(this._nextButton.gameobject);

        this._onTypingComplete = onCurrentTextComplete;
    }

    public LoadText(text: string, monologue : boolean = false, paragraphIndex: number = 0) {

        this._text.setFontStyle(monologue ? "italic" : "")

		this._nextButton.gameobject.once("pointerdown", () => {
            paragraphIndex += 1;
            this._textBox.gameobject.removeAllListeners();
            this.LoadText(text, monologue, paragraphIndex);
        });

        if(!this._textBox.gameobject.listenerCount("pointerdown")) {
            this._textBox.gameobject.setInteractive({ useHandCursor: true });
            this._textBox.gameobject.on("pointerdown", () => this.handleTextBoxClick(paragraphs[paragraphIndex]));
        }   

		var paragraphs = text.split("\n\n");  // Split paragraphs
		
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
        if(this._typingEffect != undefined)
        {
            clearInterval(this._typingEffect);
            
            this._typingEffect = undefined;
        }

        this.nextButtonVisible = true;    

        this._isTyping = false;

        this._text.setText(text);
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
        if(this._isTyping) {
            console.log("Skip typing", text);
            this.stopTyping(text);
        } else {
            this._nextButton.gameobject.emit("pointerdown");
        }
    }
  }
  