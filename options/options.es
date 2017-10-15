
new class {
	constructor()
	{
		this.initializeForm();

		browser.runtime.getBackgroundPage().then(win => win.UserScriptsInitializer.executeScripts(window));
	}

	/**
	 * @param {Event} event
	 * @returns {Promise.<void>}
	 */
	async handleEvent(event)
	{
		event.preventDefault();
		await UserChromeESOptionsStorage.setOptionsToStorage({directory: event.target.directory.value.trim()});
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
