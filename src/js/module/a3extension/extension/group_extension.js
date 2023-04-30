/**
 * @typedef GroupExtension
 * @property {GroupExtension.killAndHideAll} killAndHideAll
 */

/**
 * @type {GroupExtension}
 */
const GroupExtension = {
    killAndHideAll: function()
    {
        while (this.getFirst(true))
        {this.killAndHide(this.getFirst(true));}
    },
};

export default GroupExtension;
