import {ELocalStorage} from './enums/LocalEnums';


/**
 * @brief storage helper class for enduser
*/
export default class StorageHelper
{
    /**
     * @brief N/A
    */
    constructor()
    {
    }

    /**
     * @brief get active scene index to check
     * @return {string|null}
    */
    static GetActiveSceneIndex()
    {
        return localStorage.getItem(ELocalStorage.ALIAS.SCENE_INDEX);
    }
    /**
     * @brief set active scene index to check
     * @param {number} sceneNumber
     * @return {void}
    */
    static SetActiveSceneIndex(sceneNumber)
    {
        if (sceneNumber < 0) sceneNumber = 0;
        if (sceneNumber > 8) sceneNumber = 8;
        localStorage.setItem(ELocalStorage.ALIAS.SCENE_INDEX, sceneNumber.toString());
    }

    /**
     * @brief only call this on GameplaySceneController when gameplay of emotional understanding is finished
    */
    static FinishedActiveSceneIndex()
    {
        this.SetActiveSceneIndex(0);
    }
}
