
class XML
{
	/**
	 * The translation table from XML special chracters to chracter references.
	 * @access private
	 * @constant {Object.<string>}
	 */
	static get CHARACTER_REFERENCES_TRANSLATION_TABLE() {return {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		"'": '&apos;',
	};}

	constructor()
	{
		new CSS();
	}

	/**
	 * Replaces XML special characters with character references.
	 * @see [html — HtmlSpecialChars equivalent in Javascript? — Stack Overflow]{@link https://stackoverflow.com/a/4835406}
	 * @param {string} str - A plain string.
	 * @returns {string} A HTML string.
	 */
	static escape(str)
	{
		return String(str).replace(
			/[&<>"']/g,
			specialCharcter => XML.CHARACTER_REFERENCES_TRANSLATION_TABLE[specialCharcter]
		);
	}

	/**
	 * You can use this method as the tag of a template literal to escape XML special characters in the expressions.
	 * @param {string[]} htmlTexts
	 * @param {...string} plainText
	 * @returns {string} A HTML string.
	 */
	static escapeTemplateStrings(htmlTexts, ...plainTexts)
	{
		return String.raw(htmlTexts, ...plainTexts.map(plainText => XML.escape(plainText)));
	}
}

/**
 * The shortened name of the {@link XML.escapeTemplateStrings} method or the {@link XML.escape} method.
 * @example
 * // returns "<code>&lt;a href=&quot;https://example.com/&quot;link text&lt;/a&gt;</code>"
 * h`<code>${'<a href="https://example.com/">link text</a>'}</code>`;
 * @example
 * // returns "&lt;a href=&quot;https://example.com/&quot;link text&lt;/a&gt;"
 * h('<a href="https://example.com/">link text</a>');
 * @param {(string[]|string)} htmlTexts
 * @param {...string} plainText
 * @returns {string} A HTML string.
 */
function h(...arguments)
{
	return Array.isArray(arguments[0]) ? XML.escapeTemplateStrings(...arguments) : XML.escape(arguments[0]);
}
