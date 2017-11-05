
new class Background {
	/**
	 * @constant {RegExp}
	 */
	static get ALLOWED_WEBDAV_DIRECTORY_URL_PATTERN() {return /^http:\/\/localhost(?::[0-9]+)?\/([^?#]+\/)?$/;}

	constructor()
	{
		this.watchWebDAVDirectorySettingChanged();

		console.group('userChromeES');
		this.initialize()
			.then(console.groupEnd)
			.catch(function (exception) {
				setTimeout(console.groupEnd, 1);
				throw exception;
			})
			.then(() => UserScriptsInitializer.basicExecuteScripts(window));
	}

	/**
	 * @access private
	 * @returns {Promise.<void>}
	 */
	async initialize()
	{
		const options = (await UserChromeESOptionsStorage.getOptionsFromStorage());

		if (options.directory) {
			if (Background.ALLOWED_WEBDAV_DIRECTORY_URL_PATTERN.test(options.directory)) {
				console.info(`${options.directory} からスクリプトを取得します。`);
				await UserScriptsInitializer
					.loadScripts(await this.getScriptFileURLs(options.directory), options.alwaysFetchedScripts);
				return;
			} else {
				UserChromeESOptionsStorage.setOptionsToStorage({directory: ''});
				console.error(
					`WebDAVディレクトリのURLが、ユーザースクリプトにって不正な値「${options.directory}」に変更されたため、設定を削除し、userChromeESを再起動しました。`
				);
			}
		}

		console.warn('WebDAVディレクトリのURLを設定する必要があります。');
	}

	/**
	 * @access private
	 * @param {string} directory
	 * @returns {Promise.<string[]>}
	 */
	async getScriptFileURLs(directory)
	{
		return (await WebDAVClient.index(directory)).filter(fileURL => /\.uc\.(?:es|js)$/.test(fileURL));
	}

	/**
	 * @access private
	 */
	watchWebDAVDirectorySettingChanged(directory)
	{
		browser.storage.onChanged.addListener(function (changes, areaName) {
			if (areaName === 'local') {
				const userChromeESOptionsStorageChnage = changes['user-chrome-es'];
				if (userChromeESOptionsStorageChnage) {
					const newDirectory = userChromeESOptionsStorageChnage.newValue.directory;
					if (newDirectory) {
						console.group('userChromeES');
						if (Background.ALLOWED_WEBDAV_DIRECTORY_URL_PATTERN.test(newDirectory)) {
							console.info(`WebDAVディレクトリのURLが ${newDirectory} に変更されました。`);
							console.groupEnd();
						} else {
							console.error(`WebDAVディレクトリのURLが、ユーザースクリプトにって不正な値 ${newDirectory} に変更されました。`
								+ 'userChromeESを再起動します。');
							console.groupEnd();
							browser.runtime.reload();
						}
					}
				}

			}
		});
	}
}();
