# TA VIE｜修正テーマの受け取り

Broadcast 8.1.1 の元の画像設定・レイアウト・セクション構成を復元し、既存セクションへTA VIEの日本語文言を反映した修正版です。

- [修正済みテーマ ZIP](delivery/TA-VIE-Broadcast-8.1.1-edited.zip)
- [変更一覧・Shopify 編集画面の操作・手動反映用原稿](delivery/README-TA-VIE.md)
- [検証結果](delivery/validation.md)
- [Shopify側の設定ファイル欠落の診断と復元手順](delivery/shopify-export-diagnosis.md)
- [変更前後の設定値・差分](delivery/changes.json)

テーマ ZIP のリンクを開き、ファイル画面の **Download raw file（ダウンロード）** を選んでください。リポジトリの **Code → Download ZIP** は説明書を含む別の ZIP なので、Shopify 用には上記のテーマ ZIP を使います。

修正版は、すでにShopifyへ連携している [ta-vie-shopify-20261005 ブランチ](https://github.com/Aispecopeco/Adeki0725/tree/ta-vie-shopify-20261005) に保存しています。同じ連携テーマで更新状況を確認してください。テーマの全ソースと `config/settings_data.json`、`config/settings_schema.json` はリポジトリ直下の通常のテーマ階層に配置しています。

元の19セクションのID・順序、画像・コレクション参照を保持し、9セクションを表示、掲載実績・品質・SNS等のデモや未確認商品の10セクションを非表示にしています。前回の5つの追加セクションと独立したホーム専用CSSファイルは撤去しました。既存ロゴ参照2件、購入処理、SEOは維持しています。

ホームのブランド文章だけ、見出しを太さ400の明朝・セリフ体、本文を既存のDM Sansと日本語ゴシック体に調整しました。「テーマ設定 → TA VIE｜ホームの文字」で書体・字間・本文の行間・小見出しのサイズを変更できます。外部フォントは追加しておらず、明朝体は端末で表示が異なります。Dynamic gridとスクロール文字などのサイズも標準設定から調整しています。

ホームの写真は原ZIPでも未選択のため、現在の画像欄はBroadcast標準のSVGプレースホルダーで表示されます。`layout/theme.liquid` にはホーム限定の `noscript` 補正（`opacity: 1`・`transform: none`）を追加しました。JS有効時は元の演出を維持し、JS無効時は先頭スライドの本文を読めるようにしています。2枚目以降の非表示制御は維持しています。

配色と設定値の保存位置を明示的な `current` オブジェクトへ整理し、既存の値と5つのプリセットを保持しました。現在の配色13件を明示し、配色の既定IDも保存済みIDに合わせています。実際のShopify編集画面で警告が解消したかは未確認です。前回のローカル本文画像はこの修正版のプレビューではありません。実画面は同じ未公開テーマで確認してください。

2026年10月5日に警告が出ているShopifyテーマから再取得されたZIPは428ファイルで、GitHubのテーマ429ファイルのうち `config/settings_data.json` だけが欠落していました。他の428ファイルは最新版とバイト単位で一致しています。配色と現在の保存設定を持つファイルの欠落が警告の有力な原因です。Shopifyコードエディターで存在を確認し、欠落していれば[復元手順](delivery/shopify-export-diagnosis.md)に従ってください。GitHubでファイルが存在することだけを、Shopifyへの反映成功とは扱いません。テーマ公開・商品やストア設定の変更は実施していません。
