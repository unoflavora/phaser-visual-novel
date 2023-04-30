/**
 * This class is a module to manage Schedule
 */
export default class ScheduleController
{
    /** @type {Phaser.Scene} @private */
    scene;
    /** @private @type {Array<Function>} */
    _updates = [];

    /** @private @type {boolean} */
    _initialized = false;

    /** @type {ScheduleController} */
    static instance;

    /** @return {ScheduleController} */
    static getInstance = () =>
    {
        if (!ScheduleController.instance)
        {
            ScheduleController.instance = new ScheduleController();
        }

        return ScheduleController.instance;
    };

    /**
     * Function to Initialize Schedule
     * @param {Phaser.Scene} scene
     * @return {Promise}
     */
    init = (scene) =>
    {
        return new Promise((resolve) =>
        {
            this.scene = scene;
            this._initialized = true;
            resolve();
        });
    };

    /**
     * Update
     */
    update = () =>
    {
        if (this._initialized)
        {
            this._updates.forEach((update) => update());
        }
    };

    /**
     * Function to register Update
     * @param {Function} func
     */
    registerUpdate = (func) =>
    {
        this._updates.push(func);
    };

    /**
     * Function to remove Update
     * @param {Function} func
     */
    removeUpdate = (func) =>
    {
        const index = this._updates.findIndex((f) => f == func);
        if (index !== -1)
        {
            this._updates.splice(index, 1);
        }
    };
}
