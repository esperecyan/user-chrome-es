
class WebDAVClient
{
	/**
	 * Gets child file URLs from the specified directory URL.
	 * @param {string} directory
	 * @returns {Promise.<string[]>}
	 */
	static async index(directory)
	{
		const response = await fetch(directory, {
			method: 'PROPFIND',
			headers: {depth: '1'},
			body: `<?xml version="1.0" encoding="utf-8" ?>
				<propfind xmlns="DAV:">
					<prop />
				</propfind>`,
		});

		const responseText = await response.text();

		if (response.status === 207) {
			const responses = new DOMParser().parseFromString(responseText, 'application/xml')
				.getElementsByTagNameNS('DAV:', 'response');

			if (responses.length > 0) {
				const fileURLs = [];
				for (const response of Array.from(responses)) {
					const url = response.getElementsByTagNameNS('DAV:', 'href')[0].textContent;
					if (!url.endsWith('/')) {
						fileURLs.push(new URL(url, directory).href);
					}
				}
				return fileURLs;
			}
		}

		return Promise.reject(new Error(`ファイル一覧の取得に失敗しました。\n\n${responseText}`));
	}
}
