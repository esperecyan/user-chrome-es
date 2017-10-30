English / [日本語](readme.ja.md)

userChromeES
============
This is the Firefox add-on that loads, like [uc] / [userChromeJS]+[Sub-Script Loader], user scripts that uses the WebExtension APIs via WebDAV server.

**\* This is not an add-on that make accessing the XPCOM API a possibility so absolutely nothing compatible with scripts for the userChromeJS.**

Tha reason this add-on uses WebDAV server is add-ons cannot load local files using WebExtension API. Therefore, **you need to built [WebDAV] server.**

This add-on loads files which extension is `*.uc.js` or `*.uc.es` from the WebDAV directory URL specified by add-on’s options when this add-on startup. It does not load from sub directories.

[uc]: https://addons.mozilla.org/firefox/addon/uc/ "userChromeJS + Sub-Script/Overlay Loader"
[userChromeJS]: http://userchromejs.mozdev.org/ "userChromeJS allows complete chrome customization when an extension is excessive."
[Sub-Script Loader]: https://github.com/alice0775/userChrome.js/blob/master/userChrome.js "automatically includes all files ending in .uc.xul and .uc.js from the profile’s chrome folder"
[WebDAV]: https://ja.wikipedia.org/wiki/WebDAV "Web Distributed Authoring and Versioning (WebDAV) is an extension of the Hypertext Transfer Protocol (HTTP) that allows clients to perform remote Web content authoring operations."

Installation
------------
In the [Downloads] section of the [Releases page], click on the link that says "user-chrome-es-xxx.xpi".

As a side note, this add-on has been removed from [Addons.mozilla.org (AMO)] because it was regarded loading local script files as [loading remote code for execution].

[Releases page]: https://github.com/esperecyan/user-chrome-es/releases
[loading remote code for execution]: https://extensionworkshop.com/documentation/publish/add-on-policies/#development-practices
[Addons.mozilla.org (AMO)]: https://addons.mozilla.org/

MetaData
--------
Each of user scripts needs [Greasemonkey-style metadata block]. This add-on will read the following keys.

| Meta key name  | Description          |   |   
|----------------|----------------------|---|
| `@name`        | Name of the script.  |   |
| `@description` | Name of the script.  |   |
| `@include`     | Location that the script runs. Recognized values are:<ul><li><code>background</code></li><li><code>popup</code></li><li><code>options</code></li><li><code>devtools</code></li><li><code>sidebar</code></li></ul>This key may be used multiple times. | **Required** |

[Greasemonkey-style metadata block]: https://wiki.greasespot.net/Metadata_Block#Syntax

Code Example
------------
- [Reload userChromeES](https://greasyfork.org/scripts/34246/code)

Extend `popup`, `options`, or `sidebar`
---------------------------------------
Unless script replace whole page, this add-on assumes markups (children of body element) such as:

[/popup/popup.xhtml](popup/popup.xhtml)
---------------------------------------
- ul
	+ li
		* Element been :only-child (such as an a element or a button element)
			- img
			- Text or element
	+ ……

[/options/options.xhtml](options/options.xhtml)
- article
	+ h1
	+ Element
	+ ……
- ……

[/sideber/sideber.xhtml](options/options.xhtml)
- menu
	+ li
		* details
			- summary
			- menu
				+ li
				+ ……
	+ li
		* Element been :only-child (such as an a element or a button element)
			- img
			- Text or element
	+ ……

`permissions` / `optional_permissions`
--------------------------------------
User scripts can use all the WebExtension APIs but the following permissions are contained in `optional_permissions` manifest.json key.
Therefore, they need to request permissions using [permissions API] as an example, after they opened `/options/options.xhtml` in a normal browser tab.

- Host permissions for URLs other than `http://localhost/*`
- `bookmarks`
- `browserSettings`
- `clipboardRead`
- `clipboardWrite`
- `cookies`
- `downloads`
- `downloads.open`
- `find`
- `geolocation`
- `history`
- `idle`
- `tabs`
- `topSites`
- `webNavigation`
- `webRequest`
- `webRequestBlocking`

They can also request `activeTab` permission.

[permissions API]: https://developer.mozilla.org/Add-ons/WebExtensions/API/permissions

Contribution
------------
Please Pull Request or open your Issue.

Licence
-------
This add-on is licensed under the Mozilla Public License Version 2.0 (MPL-2.0).

[Mozilla Public License Version 2.0]: https://www.mozilla.org/MPL/2.0/

### [/third-party](third-party)
The files in this directory are parts of Firefox add-on [Greasemonkey] and are script codes licensed under the [MIT License].

[Greasemonkey]: https://github.com/greasemonkey/greasemonkey/
[MIT License]: https://opensource.org/licenses/mit-license
