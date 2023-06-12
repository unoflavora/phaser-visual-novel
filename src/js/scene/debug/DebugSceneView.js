const style = {
    fill: '#ffffff',
    align: 'right',
    stroke: '#000000',
    strokeThickness: 3,
};

export default class DebugSceneView extends Phaser.GameObjects.Container
{
    static EVENT_NAMES = {
        layout: 'layout',
    };
    EVENT_NAMES = DebugSceneView.EVENT_NAMES;

    textFontSize = 12;

    /**
     * @param {Phaser.Scene} scene
     */
    constructor(scene)
    {
        super(scene);

        this.on(this.EVENT_NAMES.layout, () =>
        {this.textFontSize = this.scene.scale.height * .02;});

        this.infoText = this.scene.add.text(0, 0, '', style);
        this.add(this.infoText);
        this.infoText.setOrigin(0, 1);
        this.infoText.setAlign('left');

        this.on(this.EVENT_NAMES.layout, () =>
        {
            this.infoText.setPosition(this.scene.scale.width * 0.02, this.scene.scale.height * 0.99);
            this.infoText.setFontSize(this.textFontSize);
        });

        this.logText = this.scene.add.text(0, 0, 'Log Here', style);
        this.add(this.logText);
        this.logText.setOrigin(0, 0);

        this.on(this.EVENT_NAMES.layout, () =>
        {
            this.logText.setPosition(0, 0);
            this.logText.setWordWrapWidth(this.scene.scale.width * 0.8);
            this.logText.setFontSize(this.textFontSize);
        });

        this.emit(this.EVENT_NAMES.layout);
    }

    /**
     * @param {Array<DebugInfo>} infoList
     */
    updateInfoText(infoList)
    {
        let newText = '';

        infoList.forEach((element) =>
        {newText += `\n${element.text}`;});

        this.infoText.setText(newText);
    }

    /**
     * @param {Array<string>} logs
     */
    updateDebugText(logs)
    {
        let newText = '';
        logs.forEach((element) => newText += `\n${element}`);
        this.logText.setText(newText);
    }
}
