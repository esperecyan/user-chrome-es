
new class {
	constructor()
	{
		this.initialize();
	}

	/**
	 * @param {Event} event
	 * @returns {Promise.<void>}
	 */
	async handleEvent(event)
	{
		event.preventDefault();
		const directory = event.target.directory.value.trim();
		await UserChromeESOptionsStorage.setOptionsToStorage({
			directory: new URL((/^[A-Za-z]:[\\/]/.test(directory) ? '/' : '') + directory, 'file:///').href,
			alwaysFetchedScripts: Array.from(event.target.querySelectorAll('[name="always-fetched-scripts"]:checked'))
				.map(input => input.value),
		});
		browser.runtime.reload();
	}

	/**
	 * @access private
	 * @returns {Promise.<void>}
	 */
	async initialize()
	{
		const form = document.forms['user-chrome-es'];
		form.insertAdjacentHTML('beforeend', h`
			<dl>
				<dt><label for="user-chrome-es-directory">
					${browser.i18n.getMessage('options_directorySettingLabel_firefox52ESR')}
				</label></dt>
				<dd><input type="url" name="directory"
					pattern="\s*(?:http://localhost(?::[0-9]+)?/([^?#]+/)?|(?:file:///|[A-Za-z]:[\\/]|/)[^?#]*)\s*"
					title="${browser.i18n.getMessage('options_directorySettingPatternDescription_firefox52ESR')}"
					placeholder="${browser.i18n.getMessage('options_directorySettingPlaceholder_firefox52ESR', [browser.i18n.getMessage('options_directorySettingPlaceholderPort'), browser.i18n.getMessage('options_directorySettingPlaceholderPath')])}"
					id="user-chrome-es-directory" /></dd>
				<dd><small>` + h(browser.i18n.getMessage('options_directorySettingExtensionsDescription')).replace(/\$_UC_JS\$/gu, '<code>*.uc.js</code>').replace(/\$_UC_ES\$/gu, '<code>*.uc.es</code>') + `</small></dd>
				<dd><small>` + h(browser.i18n.getMessage('options_directorySettingMethodsDescription')).replace(/\$PROPFIND\$/gu, '<code>PROPFIND</code>').replace(/\$GET\$/gu, '<code>GET</code>') + h`</small></dd>
				<dt>${browser.i18n.getMessage('options_loadedScriptsLabel')}</dt>
				<dd id="user-chrome-es-script-files"></dd>
				<dd><small>${browser.i18n.getMessage('options_alreadyLoadedDescription')}</small></dd>
				<dd><small>` + h(browser.i18n.getMessage('options_changingMetaDataNotice')).replace(/\$KEY\$/gu, '<code>@include</code>') + `</small></dd>
				<dd><small>` + h(browser.i18n.getMessage('options_backgroundScriptsNotice')).replace(/\$INCLUDE\$/gu, '<code>background</code>') + `</small></dd>
			</dl>
			<button name="save" disabled="">${browser.i18n.getMessage('options_submitButton')}</button>
		`);

		const options = await UserChromeESOptionsStorage.getOptionsFromStorage();

		form.directory.value = options.directory;

		form.addEventListener('submit', this);
		form.save.disabled = false;

		await UserScriptsInitializer.executeScripts();
		document.getElementById('user-chrome-es-script-files').append(
			(await browser.runtime.getBackgroundPage()).UserScriptsInitializer.scriptsInfomation.cloneNode(true)
		);
		for (const input of form.querySelectorAll('[name="always-fetched-scripts"]')) {
			input.checked = options.alwaysFetchedScripts.includes(input.value);
		}
	}
}();
