
new class {
	constructor()
	{
		browser.runtime.getBackgroundPage().then(function (win) {
			document.getElementsByTagName('menu')[1].insertAdjacentHTML('beforeend', win.UserScriptsInitializer
				.scriptsInfomation.map(info => h`<li><a href="${info.url}">
					<img src="chrome://browser/content/extension.svg" alt="" />
					${info.name}
				</a></li>`).join(''));

			win.UserScriptsInitializer.executeScripts(window);
		});

		const menu = document.getElementsByTagName('menu')[0];
		/**
		 * @access private
		 * @type {TreeWalker}
		 */
		this.treeWalker = document.createTreeWalker(menu, NodeFilter.SHOW_ELEMENT, function (element) {
			if (element.matches('details:not([open]) > :not(summary), details:not([open]) > * *')) {
				return NodeFilter.FILTER_REJECT;
			} else if (element.matches('menu, menu > li > :first-child:not(details), menu > li > details > summary')) {
				return NodeFilter.FILTER_ACCEPT;
			} else {
				return NodeFilter.FILTER_SKIP;
			}
		});
		menu.addEventListener('keypress', this);
	}

	/**
	 * @param {KeyboardEvent} event
	 */
	handleEvent(event)
	{
		if (event.key.startsWith('Arrow') && !event.ctrlKey && !event.shiftKey && !event.altKey) {
			switch (event.key) {
				case 'ArrowUp':
					this.treeWalker.currentNode = event.target;
					if (this.treeWalker.previousNode()
						&& (this.treeWalker.currentNode.localName !== 'menu' || this.treeWalker.previousNode())) {
						this.treeWalker.currentNode.focus();
					}
					break;

				case 'ArrowDown':
					this.treeWalker.currentNode = event.target;
					if (this.treeWalker.nextNode()
						&& (this.treeWalker.currentNode.localName !== 'menu' || this.treeWalker.nextNode())) {
						this.treeWalker.currentNode.focus();
					}
					break;

				case 'ArrowLeft':
					if (event.target.matches('details[open] > summary')) {
						event.target.parentElement.open = false;
					} else {
						this.treeWalker.currentNode = event.target;
						if (this.treeWalker.parentNode() && this.treeWalker.previousSibling()) {
							this.treeWalker.currentNode.focus();
						}
					}
					break;

				case 'ArrowRight':
					if (event.target.localName === 'summary') {
						if (event.target.parentElement.open) {
							this.treeWalker.currentNode = event.target;
							if (this.treeWalker.nextSibling() && this.treeWalker.firstChild()) {
								this.treeWalker.currentNode.focus();
							}
						} else {
							event.target.parentElement.open = true;
						}
					}
					break;
			}
		}
	}
}();
