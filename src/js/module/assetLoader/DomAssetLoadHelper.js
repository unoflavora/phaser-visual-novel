/**
 * This class is a module to load Fonts
 */
export default class DomAssetLoadHelper
{
    /**
     * Load font by dynamic path
     * @param {Array<AssetInfo>} fonts
     * @return {Promise}
     */
    static loadFonts(fonts)
    {return Promise.all(fonts.map((v) => this._loadFont(v.key, v.path)));}


    /**
     * Load Font
     * @private
     * @param {String} key
     * @param {String} path
     * @return {Promise}
     */
    static _loadFont(key, path)
    {
        return new Promise((resolve, reject) =>
        {
            const element = document.createElement('style');
            document.head.appendChild(element);

            const styles = '@font-face {font-family: ' + key + '; src: url("' + path + '");}';
            element.sheet.insertRule(styles, 0);

            document.fonts.load('10pt "' + key + '"')
                .then(() => resolve())
                .catch(() => reject(new Error('load font error :' + path)));
        });
    }
}
