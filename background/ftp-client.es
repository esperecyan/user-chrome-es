
class FTPClient
{
	/**
	 * Gets child file URLs from the specified directory URL.
	 * @see [javascript — Firefox WebExtensions, get local files content by path — Stack Overflow]{@link https://stackoverflow.com/a/44516256}
	 * @param {string} directory
	 * @returns {Promise.<string[]>}
	 */
	static async index(directory)
	{
		const response = await fetch(directory, {mode:'same-origin'});

		const responseText = await response.text();

		if (response.status === 200) {
			const fileURLs = [];
			let base;
			for (const {number, data} of FTPClient.parseHttpIndexFormat(responseText)) {
				if (number === 300) {
					base = data;
				} else if (number === 201 && data['file-type'] === 'FILE') {
					fileURLs.push(new URL(data.filename, base).href);
				}
			}
			return fileURLs;
		}

		return Promise.reject(new Error(`ファイル一覧の取得に失敗しました。\n\n${responseText}`));
	}

	/**
	 * Parses a application/http-index-format string.
	 * @see [application/http-index-format specification | MDN]{@link https://developer.mozilla.org/docs/application_http-index-format_specification}
	 * @access private
	 * @param {string} httpIndexFormat
	 * @returns {(Object.<number|string|Object.<string>>)[]}
	 */
	static parseHttpIndexFormat(httpIndexFormat)
	{
		const lines = [];
		let fieldNames = [];
		for (const line of httpIndexFormat.split('\n')) {
			if (line) {
				const [, numberString, data] = /^([0-9]+):\s+(.+)$/.exec(line);
				const number = Number.parseInt(numberString);
				switch (number) {
					case 100:
						break;

					case 200:
						fieldNames = data.split(/\s+/);
						break;

					case 201:
						if (fieldNames.length > 0) {
							const fields = {};
							data.split(/\s+/).forEach(function (field, index) {
								fields[fieldNames[index]] = field;
							});
							lines.push({number, data: fields});
						}
						break;

					default:
						lines.push({number, data});
						break;
				}
			}
		}
		return lines;
	}
}
