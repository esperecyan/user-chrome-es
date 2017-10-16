
window.UserScriptsInitializer = class {
	/**
	 * @constant {string[]}
	 */
	static get VALID_INCLUDE_KEY_VALUES() {return ['background', 'popup', 'options', 'devtools', 'sidebar'];}

	static executeScripts(win)
	{
		win.document.body.append(
			UserScriptsInitializer.scripts[/^\/(.+)\/\1\.xhtml$/.exec(win.location.pathname)[1]].cloneNode(true)
		);
	}

	/**
	 * @param {string[]} scriptFileURLs
	 * @returns {Promise.<void>}
	 */
	async loadScripts(scriptFileURLs)
	{
		const table = {};

		for (const url of scriptFileURLs) {
			const file = await this.getScriptFile(url);

			const metaData = await this.getMetaData(file);
			if (!this.validateMetaData(metaData, url)) {
				continue;
			}

			for (const value of metaData.includes) {
				UserScriptsInitializer.scripts[value].append(this.createScriptElement(file));
			}

			const fileName = /[^/]*$/.exec(url)[0];

			UserScriptsInitializer.scriptsInfomation.push({
				name: metaData.name || fileName,
				url: url,
			});

			table[fileName] = {
				'@name': metaData.name || null,
				'@description': metaData.description || null,
				'@include': metaData.includes.join('" "'),
			};
		}

		if (Object.keys(table).length > 0) {
			console.table(table);
			console.info('以上のスクリプトを読み込みました。');
		} else {
			console.info('スクリプトは一つも読み込まれていません。');
		}
	}

	/**
	 * @access private
	 * @param {Blob} file
	 * @returns {HTMLScriptElement}
	 */
	createScriptElement(file)
	{
		const script = document.createElement('script');
		script.src = URL.createObjectURL(file);
		return script;
	}

	/**
	 * @access private
	 * @param {?Object} metaData
	 * @param {string} url
	 * @returns {boolean}
	 */
	validateMetaData(metaData, url)
	{
		if (!metaData) {
			console.error(`メタデータが含まれていないため、 ${url} を無視します。`);
			return false;
		}

		if (metaData.includes.length === 0) {
			console.error(
				`妥当な %c@include%c キーが含まれていないため、 ${url} を無視します。`,
				'color: black; background: rgba(255, 255, 255, 0.5); margin: 0 0.3em; padding: 0.1em 0.3em;',
				''
			);
			return false;
		}

		return true;
	}

	/**
	 * @access private
	 * @see [greasemonkey/parse-user-script.js at master · greasemonkey/greasemonkey]{@link https://github.com/greasemonkey/greasemonkey/blob/master/src/parse-user-script.js}
	 * @param {Blob} file
	 * @returns {Promise.<Object>}
	 */
	async getMetaData(file)
	{
		const metaData = parseUserScript(await new Response(file).text(), 'https://dummy.invalid/', true);
		if (metaData) {
			metaData.includes
				= UserScriptsInitializer.VALID_INCLUDE_KEY_VALUES.filter(value => metaData.includes.includes(value));
		}
		return metaData;
	}

	/**
	 * @see [javascript — Firefox WebExtensions, get local files content by path — Stack Overflow]{@link https://stackoverflow.com/a/44516256}
	 * @access private
	 * @param {string} url
	 * @returns {Promise.<Blob>}
	 */
	async getScriptFile(url)
	{
		const response = await fetch(url, {mode:'same-origin'});

		if (response.status === 200) {
			return response.blob();
		}

		return Promise.reject(new Error(`次のスクリプトの取得に失敗しました。\n${url}\n\n${await response.text()}`));
	}
};

/**
 * @type {Array.<Object.<string>>}
 */
UserScriptsInitializer.scriptsInfomation = [];

/**
 * @access private
 * @type {Object.<DocumentFragment>}
 */
UserScriptsInitializer.scripts = {};
for (const value of UserScriptsInitializer.VALID_INCLUDE_KEY_VALUES) {
	UserScriptsInitializer.scripts[value] = new DocumentFragment();
}
