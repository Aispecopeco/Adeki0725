# TA VIE｜元のBroadcastを保ち、商品特集を追加する

2026年10月11日の指示に合わせ、元テーマを復元したコミット `60cc2d4` を基準に戻しました。元の配色・書体・ヘッダー・フッター・メニュー・購入・カートは、そのコードと設定のままです。ホームの19セクションと商品の9セクションも、内容・表示状態・並び順を保持しています。

既存429テーマファイルのうち427ファイルが元コードと完全一致します。残る `templates/index.json` と `templates/product.json` は、元のセクションを変更せず、追加セクションを登録するだけの変更です。[元コードとの一致確認](delivery/additive-preserve-20261011/source-preservation.json)を保存しています。

追加部分は「TA VIE｜一着を知る」「TA VIE 一着の特集」「TA VIE｜読みものとご案内」です。写真切替・接写・商品ごとの文章・商品回遊はこの中で動作します。追加セクションが自分のCSS・JavaScriptを読み込み、元のレイアウトや書体を全体から上書きしません。不要ならテーマエディタで追加セクションだけを非表示にできます。

- [今回の説明・編集・検証](delivery/additive-preserve-20261011/README.md)
- [最新のShopifyテーマZIP](delivery/TA-VIE-Broadcast-additive-preserve-20261011.zip)
- [最新版のホーム操作プレビュー（検証用データ）](delivery/additive-preserve-20261011/interactive-preview.html)
- [商品別の写真・説明の編集手順](delivery/luxury-experience/editing-guide.md)
- [必要な実物写真・商品情報](delivery/luxury-experience/required-content.md)

作業用ブランチは [ta-vie-additive-preserve-20261011](https://github.com/Aispecopeco/Adeki0725/tree/ta-vie-additive-preserve-20261011)、Shopify連携先は [ta-vie-shopify-20261005](https://github.com/Aispecopeco/Adeki0725/tree/ta-vie-shopify-20261005) です。履歴を残して連携先へ反映しています。Shopify管理画面の認証がないため、実際の同期完了・現在の公開テーマ・実商品の表示は直接確認できていません。

商品・写真・ブログ記事・FAQページなどの管理データはテーマコードだけでは作成されません。既存の商品・記事を読み込み、追加機能で未設定の写真や説明には仮文言を出しません。元のセクションでの表示は元のBroadcastのままです。ローカルの画像・商品・価格は明示した検証用データで、実物の代わりに使用していません。

`delivery/luxury-experience/`、`delivery/home-composition-fix-20261010/`、以前のプレビュー・ZIP・3D試作は、過去の作業記録として残しています。今回のホーム・全体の見た目は、これらの旧プレビューとは異なります。
