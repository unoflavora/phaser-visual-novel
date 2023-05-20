import { UIAsset } from "Assets/AssetLibraryUi";
import Image from "Modules/gameobjects/Image";
import ContainerLite from "phaser3-rex-plugins/plugins/containerlite";
import GridSizer from "phaser3-rex-plugins/templates/ui/gridsizer/GridSizer";

export class GridOptions 
{
    private options: GridSizer
    private option_A: ContainerLite;
    private options_B: ContainerLite;
    private options_C: ContainerLite;
    private options_D: ContainerLite;
  
    constructor(scene: Phaser.Scene, textBox: Image, createOption: Function) {
      this.options = new GridSizer(scene, textBox.gameobject.x, textBox.gameobject.y, textBox.gameobject.displayWidth, textBox.gameobject.displayHeight, 
      {
        column: 2,
        row: 2,
        columnProportions: 1,
        rowProportions: 1,
        space: {
          left: 10,
          right: 10,
          top: 10,
          bottom: 10,
          column: 10,
          row: 10,
        },
        align: "center",
        expand: true
      });
  
      this.option_A = new ContainerLite(scene, 0, 0);
      createOption(scene, this.options, this.option_A, UIAsset.bg_text_box.key, "Option A");
  
      this.options_B = new ContainerLite(scene, 0, 0);
      createOption(scene, this.options, this.options_B, UIAsset.bg_text_box.key, "Option B");
  
      this.options_C = new ContainerLite(scene, 0, 0);
      createOption(scene, this.options, this.options_C, UIAsset.bg_text_box.key, "Option C");
  
      this.options_D = new ContainerLite(scene, 0, 0);
      createOption(scene, this.options, this.options_D, UIAsset.bg_text_box.key, "Option D");
    }
  
    public setOption(optionIndex : number, optionText : string, setOptionText: Function) {
      var option = this.options.getChildren()[optionIndex] as ContainerLite;
  
      option.setVisible(optionText != null)
  
      if(optionText != null)
      {
        setOptionText(option, optionText);
      }
    }
  }
  