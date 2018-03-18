
new class Background {
	/**
	 * @constant {RegExp}
	 */
	static get ALLOWED_WEBDAV_DIRECTORY_URL_PATTERN() {return /^http:\/\/localhost(?::[0-9]+)?\/([^?#]+\/)?$/;}

	/**
	 * @access private
	 * @constant {number}
	 */
	static get RECONNECTION_DELAY_MILLISECONDS() {return 10000;}

	/**
	 * @access private
	 * @constant {number}
	 */
	static get MAX_RECONNECTION_COUNT() {return 10;}

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
			if (Background.ALLOWED_WEBDAV_DIRECTORY_URL_PATTERN.test(options.directory)) {
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
		let entries;

		let reconnectionCount = 0;
		while (true) {
			try {
				entries = await WebDAVClient.index(directory);
				break;
			} catch (exception) {
				if (exception.name !== 'TypeError' || ++reconnectionCount > Background.MAX_RECONNECTION_COUNT) {
					throw exception;
				}
			}

			await new Promise(function (resolve) {
				setTimeout(resolve, Background.RECONNECTION_DELAY_MILLISECONDS);
			});
		}

		return entries.filter(fileURL => /\.uc\.(?:es|js)$/.test(fileURL));
	}
}();
