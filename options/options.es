
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
		await UserChromeESOptionsStorage.setOptionsToStorage({
			directory: event.target.directory.value.trim(),
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
		const options = await UserChromeESOptionsStorage.getOptionsFromStorage();

		form.directory.value = options.directory;

		form.addEventListener('submit', this);
		form.save.disabled = false;

		await UserScriptsInitializer.executeScripts();
		form.getElementsByTagName('dt')[1].insertAdjacentHTML(
			'afterend',
			(await browser.runtime.getBackgroundPage()).UserScriptsInitializer.scriptsInfomation.map(info => h`<dd>
				<label>
					<input type="checkbox" name="always-fetched-scripts" value="${info.originalFileName}"`
						+ (options.alwaysFetchedScripts.includes(info.originalFileName) ? ' checked=""' : '') + ` />
					${info.fileName}
				</label>
			</dd>`).join('')
		);
	}
}();
