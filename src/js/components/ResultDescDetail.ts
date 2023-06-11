import { FontColors } from "Assets/AssetLibraryFont";
import { UIAsset } from "Assets/AssetLibraryUi";
import Image from "Modules/gameobjects/Image";
import Text from "Modules/gameobjects/Text";
import Container from "phaser3-rex-plugins/templates/ui/container/Container";
import GridSizer from "phaser3-rex-plugins/templates/ui/gridsizer/GridSizer";
import ProgressBar from "./ProgressBar";
import MainSceneController from "Scenes/MainSceneController";
import { GameResults } from "Definitions/GameResults";
import { IResults } from "Definitions/Settings";

export default class ResultDescDetail extends Container
{
    // UI Body
    titleText: Text;
    dateText : Text;
    descText: Text;
    color: typeof FontColors[keyof typeof FontColors];

    // Results
    resultGrid: GridSizer;
    results : ProgressBar[] = []

    textStyle = {
        color: FontColors.darkBrown,
        fontStyle: "bold",
        fontSize: this.scene.scale.height * .04
    }

    constructor(scene : Phaser.Scene, x : number, y : number, width : number, height : number, color : typeof FontColors[keyof typeof FontColors] )
    {
        super(scene, x, y, width, height);
        scene.add.existing(this);
        this.color = color;

        // Body
        this.titleText = new Text(scene, 0, 0, "Result", this.textStyle);
        this.add(this.titleText.gameobject)

        this.dateText = new Text(scene, 0, 0, "Test Taken: 01 February 2023 ", this.textStyle);
        this.add(this.dateText.gameobject)

        this.descText = new Text(this.scene, 0, 0, "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.", {
            color: FontColors.darkBrown,
            font: "400 Adobe Caslon Pro",
            lineSpacing: this.scene.scale.height * .005
        });
        this.add(this.descText.gameobject)

        // Results
        this.resultGrid = new GridSizer(scene, this.x, this.y, {
            column: 2,
            row: 4,
            space: {
                column: this.displayWidth * .015,
                row: this.displayHeight * .05,
            }
        });
        this.add(this.resultGrid)
    
        this.layout();    
    }

    public layout() {
        this.SetupText();
        this.setupGrid();
    }

    public setScores(scores : IResults) 
    {        
        for (var i = 0; i < 8; i++) 
        {
            var key = Object.keys(MainSceneController.instance.gameData.results)[i] as keyof IResults;
            
            var value = scores[key];

            this.results[i].setProgress(key, value);
        }
    }

    private setupGrid() {
        for (var i = 0; i < 8; i++) {
            var progress = new ProgressBar(this.scene, 0, 0, this.displayWidth * .47, this.scene.scale.height * .06, this.color);
            progress.setProgress(
                Object.keys(MainSceneController.instance.gameData.results)[i],
                Math.random()
            )
            this.results.push(progress);

            this.resultGrid.add(progress, {
                align: "center",
                expand: true,
            });
        }

        this.resultGrid.setOrigin(0, 0);
        this.resultGrid.setPosition(this.descText.gameobject.x - this.descText.gameobject.displayWidth * .25, this.descText.gameobject.y + this.descText.gameobject.displayHeight * 1.5);
        this.resultGrid.layout();
    }

    private SetupText() {
        this.titleText.transform.setPosition(this.x, this.y);
        this.titleText.gameobject.setOrigin(0, .5);
        this.titleText.gameobject.setColor(this.color);
        this.titleText.gameobject.setFontSize(this.scene.scale.height * .03);

        this.dateText.transform.setPosition(this.titleText.gameobject.x, this.titleText.gameobject.y + this.titleText.gameobject.displayHeight * 1.1);
        this.dateText.gameobject.setOrigin(0, .5);
        this.dateText.gameobject.setColor(this.color);
        this.dateText.gameobject.setFontSize(this.scene.scale.height * .02);

        this.descText.gameobject.setFontSize(this.scene.scale.height * .02);
        this.descText.transform.setPosition(this.dateText.gameobject.x, this.dateText.gameobject.y + this.dateText.gameobject.displayHeight * 1.5);
        this.descText.gameobject.setOrigin(0, 0);
        this.descText.gameobject.setColor(this.color);
        this.descText.gameobject.setWordWrapWidth(this.displayWidth * .95, true);
    }
}