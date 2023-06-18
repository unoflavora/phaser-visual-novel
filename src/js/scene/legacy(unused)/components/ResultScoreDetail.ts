import { FontAsset, FontColors } from "Assets/AssetLibraryFont";
import { UIAsset } from "Assets/AssetLibraryUi";
import Container from "phaser3-rex-plugins/templates/ui/container/Container";

interface scoreUI {
    title: Phaser.GameObjects.Text,
    score: Phaser.GameObjects.Text,
}
export default class ResultScoreDetail extends Container
{
    // UI Objects
    title : scoreUI;
    scores : scoreUI[] = []

    get heightAspectRatio() {return this.height / this.width;}

    constructor(scene : Phaser.Scene, x : number, y : number, width : number)
    {
        super(scene, x, y);
        
        this.setSize(width, width * this.heightAspectRatio);

        this.scene.add.existing(this);

        var bg = this.scene.add.image(this.x, this.y, UIAsset.popup_background.key);
        bg.setDisplaySize(this.displayWidth, this.displayHeight);
        bg.setOrigin(.5);
        this.add(bg);

        var title = this.scene.add.text(this.x, this.y - this.displayHeight * .4, "Title", {
            color: FontColors.darkBrown,
            fontSize: this.displayHeight * .065
        });
        title.setOrigin(.5, 0);
        title.setFontFamily(FontAsset.adobe_caslon_pro_bold.key);

        var score =  this.scene.add.text(this.x, title.y + title.displayWidth * .6, "100", {
            color: FontColors.darkBrown,
            fontSize: this.displayHeight * .1
        });
        score.setOrigin(.5, 0);
        score.setFontFamily(FontAsset.adobe_caslon_pro_bold.key);

        this.title = {title, score}

        this.add([this.title.title, this.title.score]);
        this.DisplayScoreDetails([{
            title: "Working Memory",
            score: "100"
        }, 
        {
            title: "Spatial Reasoning",
            score: "100"
        },
        {
            title: "Linguistic Comprehension",
            score: "100"
        },
        {
            title: "Numerical Reasoning",
            score: "100"
        }
    ])
    }

    public DisplayScoreDetails(scores : {title : string, score : string}[])
    {
        for(var i = 0; i < scores.length; i++)
        {
            var scoreUi : scoreUI;

            if(i >= this.scores.length)
            {
                scoreUi = this.instantiateScore(i);
            }
            else
            {
                scoreUi = this.scores[i];
            }

            scoreUi.score.setText(scores[i].score);
            scoreUi.title.setText(scores[i].title);

        }
    }

    private instantiateScore(index : number) : scoreUI {
        var title = this.scene.add.text(0, 0, "Title", {
            color: FontColors.darkBrown,
            fontSize: this.displayHeight * .05
        });
        title.setOrigin(0, 0);
        title.setFontFamily(FontAsset.adobe_caslon_pro_bold.key);
        title.setPosition(
            this.x - this.displayWidth * .4, 
            this.title.title.y + this.displayHeight * .25 + index * this.displayHeight * .125);
            
        this.add(title)

        var score = this.scene.add.text(this.x + this.displayWidth * .4, title.y, "100", {
            color: FontColors.darkBrown,
            fontSize: this.displayHeight * .05
        });
        score.setOrigin(1, 0);
        score.setFontFamily(FontAsset.adobe_caslon_pro_bold.key);
        this.add(score)

        var dividerLine = this.scene.add.image(this.x, title.y + title.displayHeight * 1.25, UIAsset.line_divider.key);
        dividerLine.setDisplaySize(this.displayWidth * .8, this.displayHeight * .003);
        dividerLine.setOrigin(.5, 0);
        this.add(dividerLine);

        this.scores.push({ title, score });

        return { title, score };
    }
}