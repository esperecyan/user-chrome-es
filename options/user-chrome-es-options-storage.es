
class UserChromeESOptionsStorage
{
	/**
	 * @param {*} keys
	 * @returns {Promise.<void>}
	 */
	static async setOptionsToStorage(keys)
	{
		return browser.storage.local.set({'user-chrome-es': Object.assign(await this.getOptionsFromStorage(), keys)});
	}

	/**
	 * @returns {Promise}
	 */
	static async getOptionsFromStorage()
	{
		return Object.assign({
			directory: '',
			alwaysFetchedScripts: [],
		}, (await browser.storage.local.get('user-chrome-es'))['user-chrome-es']);
	}
}
