import { FontAsset, FontColors } from "Assets/AssetLibraryFont";
import { BackgroundAsset, UIAsset } from "Assets/AssetLibraryUi";
import { IResults } from "Definitions/Settings";
import Button from "Modules/gameobjects/Button";
import Image from "Modules/gameobjects/Image";
import Text from "Modules/gameobjects/Text";
import ResultDescDetail from "Scenes/legacy(unused)/components/ResultDescDetail";
import ResultScoreDetail from "Scenes/legacy(unused)/components/ResultScoreDetail";
import Container from "phaser3-rex-plugins/templates/ui/container/Container";
import GridSizer from "phaser3-rex-plugins/templates/ui/gridsizer/GridSizer";

export enum ResultState {Overview, Compare, Details}
export default class ResultSceneView extends Phaser.GameObjects.Group
{
  
    // UI Header
    title: Text;
    compareBtn: Button;
    compareBtnText: Text;
    backBtn: Button;
    backBtnText: Text;
    dividerLine: Image;
    header: Container;

    // Body
    body: Phaser.GameObjects.Group;
    character: Image;
    bgOverlayResultBox2: Phaser.GameObjects.Image;
    firstResult! : ResultDescDetail;
    secondResult! : ResultDescDetail;
    detailGrid!: GridSizer;

    // Interactables
    seeDetailsBtn: Container;

    textStyle = {
        color: FontColors.darkBrown,
        fontStyle: "bold",
        fontSize: this.scene.scale.height * .04
    }
    
    backButtonCallback: Function = () => {}
    backToHomeCallback: Function = () => {}

    constructor(scene : Phaser.Scene)
    {
        super(scene);
        this.body = new Phaser.GameObjects.Group(scene);

        var bg = this.scene.add.image(0, 0, BackgroundAsset.background_main.key);
        bg.setDisplaySize(this.scene.scale.width, this.scene.scale.height);
        bg.setOrigin(0, 0);


        // Headers
        this.header = new Container(scene, 0,0);
        this.title = new Text(scene, 0, 0, "Final Result", this.textStyle);

        this.compareBtn = new Button(scene, 0, 0, UIAsset.button_frame_primary.key);
        this.compareBtnText = new Text(scene, 0, 0, "Compare", this.textStyle);

        this.backBtn = new Button(scene, 0, 0, UIAsset.button_frame_primary.key);
        this.backBtnText = new Text(scene, 0, 0, "Back to Home", this.textStyle);
        this.dividerLine = new Image(scene, 0, 0, UIAsset.line_divider.key);

        // Body
        this.seeDetailsBtn = new Container(scene, 0, 0, this.scene.scale.width * .1, this.scene.scale.height * .1);
        this.body.add(this.seeDetailsBtn)

        this.character = new Image(scene, 0, 0, UIAsset.result_character.key);
        this.body.add(this.character.gameobject)

        this.bgOverlayResultBox2 = this.scene.add.image(0, 0, UIAsset.brown_bg.key);
        this.body.add(this.bgOverlayResultBox2);
    }


    public create() {
        this.SetupHeader();
        this.setupBodyRight();
        this.createSeeDetailsBtn();
        this.initResults();
        this.initDetailedGrid();

        this.backBtn.gameobject.on('pointerup', () => {
            this.backButtonCallback();
        })
        this.SetState(ResultState.Overview);
    }


    public SetState(state : ResultState)
    {
        switch(state)
        {
            case ResultState.Overview:
                this.ShowOverview();
                this.SetOnbackButtonClicked(() => this.backToHomeCallback());
                break;
            case ResultState.Compare:
                this.CompareResults();
                break;
            case ResultState.Details:
                this.ShowDetailScores();
                break;
        }
    }    

    public RegisterOnCompareBtnClick(callback : Function) {
        this.compareBtn.gameobject.on('pointerup', () => {
            callback();
        })
    }

    public SetOnbackButtonClicked(callback : Function) {
        this.backButtonCallback = callback;
    }

    public RegisterOnSeeDetailsBtnClick(callback : Function) {
        this.seeDetailsBtn.on('pointerup', () => {
            callback();
        })
    }

    public RegisterOnBackToHomeBtnClick(callback: Function) {
        this.backToHomeCallback = callback;
    }

    
    public ShowDetailScores()
    {
        this.character.gameobject.setVisible(false);
        this.compareBtn.gameobject.setVisible(true);
        this.compareBtnText.gameobject.setVisible(true);

        this.secondResult.setVisible(false)
        this.firstResult.setVisible(false)
        this.bgOverlayResultBox2.setVisible(false);

        this.seeDetailsBtn.setVisible(false);
        this.backBtnText.gameobject.setText("Back to Overview");

        this.title.gameobject.setActive(true);
        this.detailGrid.setVisible(true);

        this.scene.add.tween({
            targets: this.detailGrid,
            ease: 'Sine.easeInOut',
            duration: 500,
            delay: 0,
            repeat: 0,
            y: this.scene.scale.height * .57,
            onStart: () => {
                this.detailGrid.y = this.scene.scale.height * 1.5;
            }
        })
    }


    public CompareResults(scores: IResults | null = null) {
        this.character.gameobject.setVisible(false);
        this.compareBtn.gameobject.setVisible(false);
        this.compareBtnText.gameobject.setVisible(false);

        this.firstResult.setVisible(true)
        this.secondResult.setVisible(true)
        this.bgOverlayResultBox2.setVisible(true);
        this.detailGrid.setVisible(false);

        this.seeDetailsBtn.setPosition(this.scene.scale.width * .5, this.scene.scale.height * .96);
        this.seeDetailsBtn.setVisible(true);

        this.backBtnText.gameobject.setText("Back to Overview");

        if(scores != null) this.secondResult.setScores(scores);

        this.scene.add.tween({
            targets: [this.secondResult, this.bgOverlayResultBox2],
            ease: 'Sine.easeInOut',
            duration: 500,
            delay: 0,
            repeat: 0,
            alpha: 1,
            onStart: () => {
                this.bgOverlayResultBox2.alpha = 0;
                this.secondResult.alpha = 0;
            }
        })

    }

    private ShowOverview() {
        this.character.gameobject.setVisible(true);
        this.compareBtn.gameobject.setVisible(true);
        this.compareBtnText.gameobject.setVisible(true);

        this.firstResult.setVisible(true)
        this.secondResult.setVisible(false)
        this.bgOverlayResultBox2.setVisible(false);
        this.seeDetailsBtn.setVisible(true);

        this.detailGrid.setVisible(false);

        this.scene.add.tween({
            targets: this.character.gameobject,
            ease: 'Sine.easeInOut',
            duration: 500,
            delay: 0,
            repeat: 0,
            alpha: 1,
            onStart: () => {
                this.character.gameobject.alpha = 0;
            }
        });

        this.seeDetailsBtn.setPosition(this.scene.scale.width * .23, this.scene.scale.height * .96);
        this.backBtnText.gameobject.setText("Back to Home");
    }

    private setupBodyRight() {
        this.character.transform.setDisplayWidth(this.scene.scale.width * .5, true);
        this.character.gameobject.setOrigin(0, 1);
        this.character.transform.setPosition(this.scene.scale.width * .5, this.scene.scale.height);

        this.bgOverlayResultBox2.setDisplaySize(this.scene.scale.width * .475, this.scene.scale.height * .7);
        this.bgOverlayResultBox2.setOrigin(0, 0);
        this.bgOverlayResultBox2.setPosition(this.scene.scale.width * .51, this.dividerLine.gameobject.y + this.title.gameobject.displayHeight * .25) ;
    }

    private SetupHeader() {
        this.backBtn.transform.setDisplayWidth(this.scene.scale.width * .125, true);
        this.backBtn.transform.setPosition(this.scene.scale.width * .99, this.scene.scale.height * .1);
        this.backBtn.gameobject.setOrigin(1, .5);

        this.backBtnText.gameobject.setFontSize(this.backBtn.gameobject.displayHeight * .2);
        this.backBtnText.transform.setPosition(this.backBtn.gameobject.x - this.backBtn.gameobject.displayWidth * .5, this.backBtn.gameobject.y);
        this.backBtnText.gameobject.setOrigin(.5);
        this.backBtnText.gameobject.setColor(FontColors.white);

        this.compareBtn.transform.setDisplayWidth(this.scene.scale.width * .125, true);
        this.compareBtn.transform.setPosition(this.scene.scale.width * .78, this.backBtn.gameobject.y);
        this.compareBtn.gameobject.setOrigin(.5);

        this.compareBtnText.transform.setPosition(this.compareBtn.gameobject.x, this.compareBtn.gameobject.y);
        this.compareBtnText.gameobject.setOrigin(.5);
        this.compareBtnText.gameobject.setColor(FontColors.white);
        this.compareBtnText.gameobject.handleTextSize(this.compareBtn.gameobject, this.compareBtn.gameobject.displayHeight * .2);

        this.dividerLine.transform.setPosition(this.scene.scale.width * .505, this.backBtn.gameobject.y + this.backBtn.transform.displayHeight * .6);
        this.dividerLine.gameobject.setOrigin(.5);
        this.dividerLine.transform.setDisplaySize(this.scene.scale.width * .96, this.scene.scale.height * .001);

        this.title.gameobject.setOrigin(.5, .4);
        this.title.transform.setPosition(this.scene.scale.width * .09, this.backBtn.gameobject.y);

        this.header.add([this.backBtn.gameobject, this.backBtnText.gameobject, this.compareBtn.gameobject, this.compareBtnText.gameobject, this.dividerLine.gameobject, this.title.gameobject]);
    }
    private initDetailedGrid() 
    {
        var grid = new GridSizer(this.scene, {
            column: 4,
            row: 2,
            space: {
                column: this.scene.scale.width * .01,
                row: this.scene.scale.height * .01,
            }
        });
        for (var i = 0; i < 8; i++) {
            var anu = new ResultScoreDetail(this.scene, this.scene.scale.width * .5, this.scene.scale.height * .5, this.scene.scale.width * .235);
            grid.add(anu);
            grid.layout();
        }

        grid.setPosition(this.scene.scale.width * .5, this.scene.scale.height * .57);
        this.detailGrid = grid;
        this.add(grid);
    }

    private initResults() {
        this.firstResult = new ResultDescDetail(this.scene,
            this.title.gameobject.x - this.title.gameobject.displayWidth * .5,
            this.dividerLine.gameobject.y + this.title.gameobject.displayHeight,
            this.scene.scale.width * .45, this.scene.scale.height * .71,
            FontColors.darkBrown);
        this.body.add(this.firstResult);


        this.secondResult = new ResultDescDetail(this.scene,
            this.scene.scale.width * .53,
            this.dividerLine.gameobject.y + this.title.gameobject.displayHeight,
            this.scene.scale.width * .45, this.scene.scale.height * .71, FontColors.white);
        this.body.add(this.secondResult)
    }

    private createSeeDetailsBtn() {
        this.seeDetailsBtn.setPosition(this.scene.scale.width * .23, this.scene.scale.height * .96);

        var seeDetailsIcon = new Image(this.scene, 0, 0, UIAsset.icon_arrow_down.key);
        seeDetailsIcon.transform.setPosition(this.seeDetailsBtn.x, this.seeDetailsBtn.y);
        seeDetailsIcon.gameobject.setOrigin(.5);
        seeDetailsIcon.transform.setDisplayWidth(this.scene.scale.width * .035, true);
        this.seeDetailsBtn.add(seeDetailsIcon.gameobject);

        var seeDetailsText = new Text(this.scene, 0, 0, "See Details", this.textStyle);
        seeDetailsText.transform.setPosition(seeDetailsIcon.gameobject.x, seeDetailsIcon.gameobject.y - seeDetailsIcon.gameobject.displayHeight * .8);
        seeDetailsText.gameobject.setOrigin(.5);
        seeDetailsText.gameobject.setFontSize(this.scene.scale.height * .02);
        this.seeDetailsBtn.add(seeDetailsText.gameobject);

        this.seeDetailsBtn.setInteractive({ useHandCursor: true })

        this.scene.add.tween({
            targets: this.seeDetailsBtn,
            ease: 'Sine.easeInOut',
            duration: 500,
            delay: 0,
            yoyo: true,
            repeat: -1,
            y: this.scene.scale.height * .94,
        })
    }
}