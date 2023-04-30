export default class LogHelper {
	/**
	 * @param {string} title
	 * @param {string} message
	 */
	static log = (title, message) => {
		const msgTitle = `[${PROJECT_NAME}] ${title}: `;
		console.log(msgTitle, message);
	};
}
