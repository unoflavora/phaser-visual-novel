import DebugSceneController from './DebugSceneController';

/**
 * @param {string} string
 */
export function debugLog(string)
{
    if (!DebugSceneController.getInstance()) return;
    DebugSceneController.getInstance().debug(string, false);
}
