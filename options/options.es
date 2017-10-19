
new class {
	constructor()
	{
		this.initializeForm();

		UserScriptsInitializer.executeScripts();
	}

	/**
	 * @param {Event} event
	 * @returns {Promise.<void>}
	 */
	async handleEvent(event)
	{
		event.preventDefault();
		const directory = event.target.directory.value;
		await UserChromeESOptionsStorage.setOptionsToStorage({
			directory: new URL((/^[A-Za-z]:[\\/]/.test(directory) ? '/' : '') + directory, 'file:///').href,
		});
		browser.runtime.reload();
	}

	/**
	 * @access private
	 * @returns {Promise.<void>}
	 */
	async initializeForm()
	{
		const form = document.forms['user-chrome-es'];
		form.directory.value = (await UserChromeESOptionsStorage.getOptionsFromStorage()).directory;
		form.addEventListener('submit', this);
		form.save.disabled = false;
	}
}();
