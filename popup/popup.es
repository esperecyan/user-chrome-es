
new class {
	constructor()
	{
		document.getElementsByName('open-options-page')[0].addEventListener('click', this);

		UserScriptsInitializer.executeScripts();
	}

	handleEvent()
	{
		browser.runtime.openOptionsPage();
		close();
	}
}();
