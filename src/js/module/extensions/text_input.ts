import Image from "Modules/gameobjects/Image";
import RexInputText from "./text_extension";
import InputText from "phaser3-rex-plugins/plugins/gameobjects/dom/inputtext/InputText";
import { FontAsset } from "Assets/AssetLibraryFont";

// Create Password Input DOM Element using RexUI 
export function createPasswordInput(
    scene : Phaser.Scene, 
    inputBackground : Image, 
    onTextChange: (i: InputText, e: Event) => void) 
{
        const input = new RexInputText(
            scene,
            inputBackground.gameobject.x,
            inputBackground.gameobject.y,
            inputBackground.gameobject.displayWidth,
            inputBackground.gameobject.displayHeight,
            {
                type: 'password',
                fontFamily: FontAsset.adobe_caslon_pro_bold.key,
                text: '',
                fontSize: '1.4rem',
                align: "left",
                color: '#F6C167',
                paddingRight: '1.25em',
            },
        ).on('textchange', onTextChange).setClassName("phaser-dom-elements");
        
        const visibilityButton = scene.add.dom(
            inputBackground.gameobject.x + inputBackground.gameobject.displayWidth * .45, input.y, 
            "i", "font-size: 1.15rem; color: #EFEBD9; cursor: pointer;")
            visibilityButton.setClassName("fas fa-eye phaser-dom-elements");
            visibilityButton.setOrigin(1, 0.5);
            visibilityButton.addListener('click');
            visibilityButton.on("click", () => {
            const type = input.node.attributes.getNamedItem("type")!.value;
            input.node.setAttribute("type", type == "text" ? "password" : "text");
            visibilityButton.setClassName(type == "text" ? "fas fa-eye" : "fas fa-eye-slash");
        });

        input.visibilityButton = visibilityButton;
    
        return input;
}

export function createTextInput(
  scene: Phaser.Scene,
  inputBackground: Image,
  onTextChange: (input: RexInputText, event: Event) => void
): RexInputText {
  const input = new RexInputText(
    scene,
    inputBackground.gameobject.x,
    inputBackground.gameobject.y,
    inputBackground.gameobject.displayWidth,
    inputBackground.gameobject.displayHeight,
    {
      type: 'text', // Set the input type to 'text' for username input
      fontFamily: FontAsset.adobe_caslon_pro_bold.key,
      text: '',
      fontSize: '1.4rem',
      align: 'left',
      color: '#F6C167',
      paddingRight: '1.25em',
    }
  ).on('textchange', onTextChange).setClassName("phaser-dom-elements");;

  input.setOrigin(0.5, 0.5);

  return input;
}
