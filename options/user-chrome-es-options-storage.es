
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
		return (await browser.storage.local.get({
			'user-chrome-es': {
				directory: '',
			},
		}))['user-chrome-es'];
	}
}
