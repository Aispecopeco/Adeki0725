# TA VIE｜Broadcastを保ち、商品特集とJournalを追加する

2026年10月12日、Shopify側で保存された最新コミット `6249aea` を引き継ぎ、既存のブログ・記事に手を加えず、Journal・お知らせ・Instagram／ライブ案内を追加しました。Broadcast 8.1.1のヘッダー・商品・購入・カート・配色設定は保持しています。

既存ブログ・記事の重要17ファイルは元コードと完全一致します。既存443テーマファイルのうち438ファイルがそのままで、変更した5ファイルは追加用のホーム紹介・共有設定・配置です。最新のホームの商品選択とブランド文章、元のセクション順を維持しています。

- [今回の実装・プレビュー・確認結果](delivery/journal-20261012/README.md)
- [最新のShopifyテーマZIP](delivery/TA-VIE-Broadcast-journal-20261012.zip)
- [ホーム・Journal操作プレビュー（検証用データ）](delivery/journal-20261012/interactive-preview.html)
- [Shopify設定と短い運用手順](delivery/journal-20261012/setup-guide.md)
- [必要な実記事・写真・Instagram情報](delivery/journal-20261012/required-data.md)
- [商品別の写真・説明の編集手順](delivery/luxury-experience/editing-guide.md)

作業ブランチは [ta-vie-journal-live-20261012](https://github.com/Aispecopeco/Adeki0725/tree/ta-vie-journal-live-20261012)、既存のShopify連携先は [ta-vie-shopify-20261005](https://github.com/Aispecopeco/Adeki0725/tree/ta-vie-shopify-20261005) です。Shopify管理画面の認証がないため、実際の同期完了・公開テーマ・実記事データは直接確認できません。

記事カードは既存の公開済み記事を参照します。新着は公開日順で、更新告知は別のお知らせブログの記事として運営者が登録します。ライブ予定・状態もその一つの告知記事で管理し、ホーム・Journal・タイムラインが共有します。時刻だけで「配信中」に切り替えず、期限切れの表示を解除します。

Journalページ・専用お知らせブログ・記事メタフィールド定義・実際のInstagram情報は、テーマファイルだけでは作成されません。同梱の手順で管理画面から設定できます。未設定の告知・写真・架空のアカウントは公開画面へ出しません。プレビューの写真枠・記事・告知・アカウントは明示した検証用データです。

`delivery/additive-preserve-20261011/` と、それ以前のテーマZIP・プレビュー・3D試作は過去の作業記録として残しています。
