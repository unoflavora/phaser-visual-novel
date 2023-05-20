import Text from "Modules/gameobjects/Text";

export class TextBox {
    private textObject: Text;
    private nextButton: Text;
    
    constructor(textObject: Text, nextButton: Text) {
      this.textObject = textObject;
      this.nextButton = nextButton;
    }
  
    public Type = (textToType : string): void => {
      this.textObject.gameobject.setText("");
      this.nextButtonVisible = false;
  
      let i = 0;
      const typingEffect = setInterval(() => {
        this.textObject.gameobject.text += textToType[i];
        i += 1;
        if (i >= textToType.length) {
          clearInterval(typingEffect);
          this.nextButtonVisible = true;
        }
      }, 20)		
    }
  
    public get nextButtonVisible() {
      return this.nextButton.gameobject.visible;
    }
  
    public set nextButtonVisible(value: boolean) {
      this.nextButton.gameobject.visible = value;
    }
    
  }
  