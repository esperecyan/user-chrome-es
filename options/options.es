
new class {
	constructor()
	{
		this.initializeForm();

		browser.runtime.getBackgroundPage().then(win => win.UserScriptsInitializer.executeScripts(window));
	}

	/**
	 * @param {Event} event
	 */
	handleEvent(event)
	{
		event.preventDefault();
		UserChromeESOptionsStorage.setOptionsToStorage({directory: event.target.directory.value.trim()});
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
