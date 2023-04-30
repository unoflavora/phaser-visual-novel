import ScreenUtilityController from '../ScreenUtilityController';

export default class BaseView extends Phaser.GameObjects.Container
{
    /**
     * @param  {Phaser.Scene} scene
     */
    constructor(scene)
    {
        super(scene, 0, 0);

        this.scene = scene;
        this.screenUtility = ScreenUtilityController.getInstance();

        this.scene.add.existing(this);
    }
}
