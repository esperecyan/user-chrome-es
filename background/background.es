
new class Background {
	/**
	 * @constant {RegExp}
	 */
	static get ALLOWED_DIRECTORY_URL_PATTERN() {
		return /^(?:http:\/\/localhost(?::[0-9]+)?\/([^?#]+\/)?|file:\/\/\/[^?#]*)$/;
	}

	constructor()
	{
		this.initialize().then(() => UserScriptsInitializer.basicExecuteScripts(window));
	}

	/**
	 * @access private
	 * @returns {Promise.<void>}
	 */
	async initialize()
	{
		const options = (await UserChromeESOptionsStorage.getOptionsFromStorage());

		const urls = [];
		if (options.directory) {
			if (Background.ALLOWED_DIRECTORY_URL_PATTERN.test(options.directory)) {
				urls.push(...await this.getScriptFileURLs(options.directory));
			} else {
				UserChromeESOptionsStorage.setOptionsToStorage({directory: ''});
			}
		}

		await UserScriptsInitializer.loadScripts(urls, options.alwaysFetchedScripts);
	}

	/**
	 * @access private
	 * @param {string} directory
	 * @returns {Promise.<string[]>}
	 */
	async getScriptFileURLs(directory)
	{
		return (await (directory.startsWith('file:///') ? FTPClient : WebDAVClient).index(directory))
			.filter(fileURL => /\.uc\.(?:es|js)$/.test(fileURL));
	}
}();
