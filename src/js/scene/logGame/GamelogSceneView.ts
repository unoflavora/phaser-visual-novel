import { FontColors } from "Assets/AssetLibraryFont";
import { BackgroundAsset, UIAsset } from "Assets/AssetLibraryUi";
import { GameResults } from "Definitions/GameResults";
import Button from "Modules/gameobjects/Button";
import Image from "Modules/gameobjects/Image";
import Text from "Modules/gameobjects/Text";
import Localizations from "Modules/localization/LocalizationHelper";
import MainSceneController from "Scenes/MainSceneController";
import ResultBox from "js/components/ResultBox";
import GridSizer from "phaser3-rex-plugins/templates/ui/gridsizer/GridSizer";

export default class GamelogSceneView extends Phaser.GameObjects.Group
{
   
    // UI Objects
    private bg: Phaser.GameObjects.Image;
    private title: Text;
    private backBtn: Button;
    private backBtnText: Text;
    private nextBtn: Button;
    private prevBtn: Button;
    private dividerLine: Image;
    private grid!: GridSizer;

    // Components
    public resultBoxes: ResultBox[] = [];

    dummyIcons: string[] = [
        UIAsset.working_memory.key,
        UIAsset.spatial_reasoning.key,
        UIAsset.linguistic_comprehension.key,
        UIAsset.numerical_reasoning.key,
        UIAsset.logical_reasoning.key,
        UIAsset.problem_solving.key,
        UIAsset.auditory_processing.key,
        UIAsset.emotional_understanding.key
    ]

    textStyle = {
        color: FontColors.darkBrown,
        fontStyle: "bold",
        fontSize: this.scene.scale.height * .04
    }

    constructor(scene: Phaser.Scene)
    {
        super(scene);
        this.bg = this.scene.add.image(0, 0, BackgroundAsset.background_main.key);
        this.title = new Text(scene, 0, 0, "Overview", this.textStyle);

        this.backBtn = new Button(this.scene, 0, 0, UIAsset.button_frame_primary.key);
        this.backBtnText = new Text(this.scene, 0, 0, "Back to Home", this.textStyle);

        this.nextBtn = new Button(this.scene, 0, 0, UIAsset.icon_next.key);
        this.prevBtn = new Button(this.scene, 0, 0, UIAsset.icon_prev.key);
        this.dividerLine = new Image(this.scene, 0, 0, UIAsset.line_divider.key);

        this.addMultiple([this.bg, this.dividerLine.gameobject, this.title.gameobject, 
            this.backBtn.gameobject, this.nextBtn.gameobject, this.prevBtn.gameobject])
    }

    public create()
    {
        this.bg.setDisplaySize(this.scene.scale.width, this.scene.scale.height);
        this.bg.setOrigin(0, 0);

        this.grid = new GridSizer(this.scene, 0, 0, this.scene.scale.width * .925, this.scene.scale.height * .65, {
            column: 2,
            row: 3,
            columnProportions: 1,
            rowProportions: 1,
            space: {
                column: 10,
                row: 10,
            },
        });
        this.grid.setOrigin(0.5);
        this.grid.setPosition(this.scene.scale.width * .5, this.scene.scale.height * .5);

        this.backBtn.transform.setDisplayWidth(this.scene.scale.width * .125, true);
        this.backBtn.transform.setPosition(this.scene.scale.width * .9, this.scene.scale.height * .1);
        this.backBtn.gameobject.setOrigin(.5);

        this.backBtnText.transform.setPosition(this.backBtn.gameobject.x, this.backBtn.gameobject.y);
        this.backBtnText.gameobject.setOrigin(.5);
        this.backBtnText.gameobject.setColor(FontColors.white);

        this.dividerLine.transform.setPosition(this.scene.scale.width * .5, this.backBtn.gameobject.y + this.backBtn.transform.displayHeight * .6);
        this.dividerLine.gameobject.setOrigin(.5);
        this.dividerLine.transform.setDisplaySize(this.scene.scale.width * .92, this.scene.scale.height * .001);

        this.title.gameobject.setOrigin(.5, .4);
        this.title.transform.setPosition(this.scene.scale.width * .1, this.backBtn.gameobject.y);

        this.prevBtn.transform.setDisplayWidth(this.scene.scale.width * .05, true);
        this.prevBtn.gameobject.setOrigin(0.5);

        this.nextBtn.transform.setDisplayWidth(this.scene.scale.width * .05, true);
        this.nextBtn.gameobject.setOrigin(0.5);

        this.prevBtn.transform.setPosition(this.scene.scale.width * .88, this.scene.scale.height * .90);
        this.nextBtn.transform.setPosition(this.scene.scale.width * .94, this.scene.scale.height * .90);

        for(let i = 0; i < 6; i++)
        {
            const result = new ResultBox(this.scene, 0,0, this.scene.scale.width * .4, this.scene.scale.height * .2);

            this.resultBoxes.push(result);

            this.grid.add(result, {
                align: "center",
                expand: true,
            });
    
            this.grid.layout();
            result.layout();
        }


        this.onChangeLanguage();
    }

    public registerOnNextBtnClicked(callback: () => void)
    {
        this.nextBtn.gameobject.on("pointerup", callback);
    }

    public registerOnPrevBtnClicked(callback: () => void)
    {
        this.prevBtn.gameobject.on("pointerup", callback);
    }

    public registerOnBackBtnClicked(callback: () => void)
    {
        this.backBtn.gameobject.on("pointerup", callback);
    }
    
    public setActiveNextButton(active : boolean) 
    {
        if(active)
        {
            this.nextBtn.gameobject.setInteractive();
            this.nextBtn.gameobject.setAlpha(1);
            return;
        }

        this.nextBtn.gameobject.disableInteractive();
        this.nextBtn.gameobject.setAlpha(.5);
    }

    setActivePrevButton(active: boolean) {
        if(active)
        {
            this.prevBtn.gameobject.setInteractive();
            this.prevBtn.gameobject.setAlpha(1);
            return;
        }

        this.prevBtn.gameobject.disableInteractive();
        this.prevBtn.gameobject.setAlpha(.5);
    }

    public updateResults(results: GameResults[])
    {
        console.log(this.resultBoxes.length, results.length)
        // update results
        for(var i = 0; i < results.length; i++)
        {
            if(i < this.resultBoxes.length)
            {
                var resultView = this.resultBoxes[i]
                resultView.setResult(results[i]);
                resultView.setIcon(this.dummyIcons[results[i].id]);
                resultView.setVisible(true);
            }
        }

        // hide unused results
        for(var i = this.resultBoxes.length; i > results.length; i--)
        {
            var resultView = this.resultBoxes[i - 1]

            resultView.setVisible(false);
        }
    }

    public onChangeLanguage()
    {
        this.backBtnText.gameobject.setText(Localizations.text.mainMenu.overview.backToHome);
        this.title.gameobject.setText(Localizations.text.mainMenu.overview.title);
        this.backBtnText.gameobject.handleTextSize(this.backBtn.gameobject, this.backBtn.gameobject.displayHeight * .18)
    }

}