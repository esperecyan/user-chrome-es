
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
		document.getElementById('user-chrome-es-script-files').append(
			(await browser.runtime.getBackgroundPage()).UserScriptsInitializer.scriptsInfomation.cloneNode(true)
		);
		for (const input of form.querySelectorAll('[name="always-fetched-scripts"]')) {
			input.checked = options.alwaysFetchedScripts.includes(input.value);
		}
	}
}();
