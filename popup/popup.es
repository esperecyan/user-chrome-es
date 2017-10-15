
new class {
	constructor()
	{
		document.getElementsByName('open-options-page')[0].addEventListener('click', this);

		browser.runtime.getBackgroundPage().then(win => win.UserScriptsInitializer.executeScripts(window));
	}

	handleEvent()
	{
		browser.runtime.openOptionsPage();
		close();
	}
}();
