userChromeES
============
[uc] / [userChromeJS]+[サブスクリプトローダ] 風に、WebExtension APIを叩くユーザースクリプトを読み込むFirefoxアドオンです。

**※XPCOM APIにアクセスできるようにするアドオンではないため、userChromeJS用のユーザースクリプトとはまったく互換性がありません。**

アドオンの設定で指定したローカルフォルダのパスから、拡張子が `*.uc.js`、または `*.uc.es` となっているファイルを、アドオン起動時に読み込みます。サブディレクトリからは読み込みません。

[uc]: https://addons.mozilla.org/firefox/addon/uc/ "userChromeJS + Sub-Script/Overlay Loader"
[userChromeJS]: http://userchromejs.mozdev.org/ "JavaScriptを通して、Firefoxのインターフェイスを簡単に改造するための拡張"
[サブスクリプトローダ]: https://github.com/alice0775/userChrome.js/blob/master/userChrome.js "userChrome.jsというファイル名でプロファイルフォルダの中のchromeフォルダに置くことで、同フォルダ内の *.uc.jsファイル(example.uc.jsといったように)や *.uc.xulファイル(または*.xulファイル)を自動で全て読み込むようになります。"

インストール
------------
[Releasesページ]の「Downloads」で、「user-chrome-es-○○○.xpi」となっているリンクをクリックします。

なお、ローカルにあるスクリプトファイルの読み込みについて、[リモートコードの実行]であると判断されたため、当アドオンは[Addons.mozilla.org (AMO)]から削除されています。

[Releasesページ]: https://github.com/esperecyan/user-chrome-es/releases
[リモートコードの実行]: https://developer.mozilla.org/Add-ons/AMO/Policy/Reviews#ポリシー
[Addons.mozilla.org (AMO)]: https://addons.mozilla.org/

メタデータ
----------
各ユーザースクリプトには[Greasemonkey風のメタデータブロック]が必要です。当アドオンでは以下のキーを解釈します。

| メタキー名     | 値の意味 |         |   
|----------------|--------------------|---|
| `@name`        | スクリプト名。     |   |
| `@description` | スクリプトの概要。 |   |
| `@include`     | スクリプトを追加する場所。次のいずれかを指定:<ul><li><code>background</code></li><li><code>popup</code></li><li><code>options</code></li><li><code>devtools</code></li><li><code>sidebar</code></li></ul>複数指定可能。 | **必須** |

[Greasemonkey風のメタデータブロック]: https://wiki.greasespot.net/Metadata_Block#Syntax
[ブラウザーコンソール]: https://developer.mozilla.org/docs/Tools/Browser_Console "ブラウザーコンソールは Web コンソール に似ていますが、ひとつのコンテンツタブではなくブラウザー全体に適用されます。"

コード例
--------
- [userChromeESを再読み込み](https://greasyfork.org/scripts/34246/code)

`popup` `options` `sidebar` の拡張
----------------------------------
ページごと置き換えるのでなければ、それぞれ以下のようなマークアップ (body要素直下) を想定しています。

[/popup/popup.xhtml](popup/popup.xhtml)
---------------------------------------
- ul
	+ li
		* :only-child な要素 (a要素やbutton要素)
			- img
			- テキストや要素
	+ ……

[/options/options.xhtml](options/options.xhtml)
- article
	+ h1
	+ 要素
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
		* :only-child な要素 (a要素やbutton要素)
			- img
			- テキストや要素
	+ ……

`permissions` / `optional_permissions`
--------------------------------------
ユーザースクリプトはすべてのWebExtension APIを利用できますが、以下の権限は `optional_permissions` manifest.json キーに含まれています。
そのため、`/options/options.xhtml` をタブとして開くなどした上で、[permissions API]を利用して権限を要求する必要があります。

- `file:///*` 以外のURLに対する host パーミッション
- `bookmarks`
- `clipboardRead`
- `clipboardWrite`
- `cookies`
- `geolocation`
- `history`
- `idle`
- `tabs`
- `topSites`
- `webNavigation`
- `webRequest`
- `webRequestBlocking`

`activeTab` パーミッションも要求可能です。

[permissions API]: https://developer.mozilla.org/Add-ons/WebExtensions/API/permissions

Contribution
------------
Pull Request、または Issue よりお願いいたします。

ライセンス
----------
当アドオンのライセンスは [Mozilla Public License Version 2.0] \(MPL-2.0) です。

[Mozilla Public License Version 2.0]: https://www.mozilla.org/MPL/2.0/

### [/third-party](third-party)
当ディレクトリに含まれるファイルは、Firefoxアドオン[Greasemonkey]の一部であり、[MIT License]で公開されているスクリプトコードです。

[Greasemonkey]: https://github.com/greasemonkey/greasemonkey/
[MIT License]: https://ja.osdn.net/projects/opensource/wiki/licenses/MIT_license
