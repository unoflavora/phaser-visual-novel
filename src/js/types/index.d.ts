
declare global {
	const CONFIG: Config;
	const BUILD_TIME: string;
	const DEVELOPMENT: boolean;
	const PRODUCTION: boolean;
	const PROJECT_NAME: string;
	const PROJECT_VERSION: string;
}

export type Config = {
    BASE_GAME_URL: string,
	BASE_ASSET_URL: string;
	AUTO_CANVAS_RESIZE: boolean;
	IS_AUDIO_MUTED: boolean;
	DEBUG_MODE: boolean;
	OFFLINE_MODE: boolean;
	BASE_URL: string;
	ENVIRONMENT: string;
	RESULT_URL: string;
	RESET_PASSWORD_URL: string;
};
