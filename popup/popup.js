
new class {
	constructor()
	{
		const button = document.getElementsByName('open-options-page')[0];
		button.append(browser.i18n.getMessage('popup_oepnOptionsPageButton'));
		button.addEventListener('click', this);

		UserScriptsInitializer.executeScripts();
	}

	handleEvent()
	{
		browser.runtime.openOptionsPage();
		close();
	}
}();
