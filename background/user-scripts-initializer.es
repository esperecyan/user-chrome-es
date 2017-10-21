(function () {
'use strict';

window.UserScriptsInitializer = class {
	/**
	 * @constant {string[]}
	 */
	static get VALID_INCLUDE_KEY_VALUES() {return ['background', 'popup', 'options', 'devtools', 'sidebar'];}

	/**
	 * @returns {Promise.<void>}
	 */
	static async executeScripts()
	{
		const backgroundPage = browser.runtime.getBackgroundPage ? await browser.runtime.getBackgroundPage() : null;
		try {
			if (await browser.runtime.sendMessage('is-ready-user-scripts-initialized')) {
				UserScriptsInitializer.basicExecuteScripts(backgroundPage);
				return;
			}
		} catch (exception) {
			if (exception.name !== 'Error'
				|| exception.message !== 'Could not establish connection. Receiving end does not exist.') {
				throw exception;
			}
		}
		return new Promise(function (resolve) {
			browser.runtime.onMessage.addListener(async function ready(message) {
				if (message === 'ready-user-scripts-initialized') {
					browser.runtime.onMessage.removeListener(ready);
					await UserScriptsInitializer.basicExecuteScripts(backgroundPage);
					return resolve();
				}
			});
		});
	}

	/**
	 * @param {?Window} backgroundPage
	 */
	static async basicExecuteScripts(backgroundPage)
	{
		const includeValue = /^\/(.+)\/\1\.xhtml$/.exec(location.pathname)[1];
		const scripts = backgroundPage
			? backgroundPage.UserScriptsInitializer.scripts[includeValue]
			: await browser.runtime.sendMessage({getUserScripts: includeValue});

		if (scripts.onceFetched instanceof DocumentFragment) {
			document.body.append(scripts.onceFetched.cloneNode(true));
		} else {
			scripts.onceFetched.map(setTimeout); // eval()
		}

		for (const url of scripts.alwaysFetched) {
			const scriptFile = await this.getScriptFile(url);
			if (scripts.onceFetched instanceof DocumentFragment) {
				document.body.append(this.createScriptElement(scriptFile));
			} else {
				setTimeout(await new Response(scriptFile).text()); // eval()
			}
		}
	}

	/**
	 * @param {string[]} scriptFileURLs
	 * @param {string[]} alwaysFetchedScriptFileNames
	 * @returns {Promise.<void>}
	 */
	static async loadScripts(scriptFileURLs, alwaysFetchedScriptFileNames)
	{
		const table = {};

		for (const url of scriptFileURLs) {
			const file = await this.getScriptFile(url);

			const metaData = await this.getMetaData(file);
			if (!this.validateMetaData(metaData, url)) {
				continue;
			}

			const originalFileName = /[^/]*$/.exec(url)[0];

			for (const value of metaData.includes) {
				if (alwaysFetchedScriptFileNames.includes(originalFileName)) {
					this.scripts[value].alwaysFetched.push(url);
				} else {
					if (this.scripts[value].onceFetched instanceof DocumentFragment) {
						this.scripts[value].onceFetched.append(this.createScriptElement(file));
					} else {
						this.scripts[value].onceFetched.push(await new Response(file).text());
					}
				}
			}

			const fileName = decodeURIComponent(originalFileName);

			UserScriptsInitializer.scriptsInfomation.push({
				name: metaData.name || fileName,
				fileName: fileName,
				originalFileName: originalFileName,
				description: metaData.description || null,
				includes: metaData.includes,
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

		UserScriptsInitializer.alreadyLoaded = true;
		browser.runtime.sendMessage('ready-user-scripts-initialized');
	}

	/**
	 * @access private
	 * @param {Blob} file
	 * @returns {HTMLScriptElement}
	 */
	static createScriptElement(file)
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
	static validateMetaData(metaData, url)
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
	static async getMetaData(file)
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
	static async getScriptFile(url)
	{
		const response = await fetch(url, {mode:'same-origin'});

		if (response.status === 200) {
			return response.blob();
		}

		return Promise.reject(new Error(`次のスクリプトの取得に失敗しました。\n${url}\n\n${await response.text()}`));
	}
};

if (location.pathname === '/background/background.xhtml') {
	/**
	 * @type {Array.<Object.<(?string|string[])>>}
	 */
	UserScriptsInitializer.scriptsInfomation = [];

	/**
	 * @access private
	 * @type {Object.<Object.(DocumentFragment|string[])>}
	 */
	UserScriptsInitializer.scripts = {};
	for (const value of UserScriptsInitializer.VALID_INCLUDE_KEY_VALUES) {
		UserScriptsInitializer.scripts[value] = {
			onceFetched: value === 'devtools' ? [] : new DocumentFragment(),
			alwaysFetched: [],
		};
	}

	/**
	 * @access private
	 * @type {boolean}
	 */
	UserScriptsInitializer.alreadyLoaded = false;

	browser.runtime.onMessage.addListener(function (request, sender, sendResponse) {
		if (request === 'is-ready-user-scripts-initialized') {
			sendResponse(UserScriptsInitializer.alreadyLoaded);
		} else if (request.getUserScripts) {
			sendResponse(UserScriptsInitializer.scripts[request.getUserScripts]);
		}
	});
}

})();
