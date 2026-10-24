# TA VIE｜添付Broadcastへ戻し、Journal・Instagramを引き継ぐ

2026年10月24日。添付された10月5日版Broadcast 8.1.1へ戻し、日本語の文言を維持して、ブログ・Journal・Instagram／ライブ機能を移植しました。ロゴの大きさ、余白、ホームの見出し、動きの強さ、空のフッターメニューを整えています。

- [今回の説明・PC／スマホ画像・編集箇所](delivery/restore-journal-20261024/README.md)
- [最新のShopifyテーマZIP](delivery/TA-VIE-Broadcast-restored-journal-20261024.zip)
- [ホーム・Journal操作プレビュー（検証用データ）](delivery/restore-journal-20261024/interactive-preview.html)
- [日本語・元コード・配色の保持確認](delivery/restore-journal-20261024/verification/source-preservation.json)
- [Journal・お知らせ・Instagram／ライブの設定手順](delivery/journal-20261012/setup-guide.md)

ホームは元の19セクションの順番・表示状態を残し、その後へJournal・お知らせ・Instagramの3セクションを配置しています。商品ページも元のBroadcastに戻しました。記事本文・写真・URL・公開日を変更するAPI操作は行っていません。

添付ZIPに欠けていた `config/settings_data.json` は既存の連携テーマから回収しました。現在の設定と5プリセットで13個の配色IDがそろっており、JournalやSNSの共通設定も引き継いでいます。

作業ブランチは [ta-vie-restore-journal-20261024](https://github.com/Aispecopeco/Adeki0725/tree/ta-vie-restore-journal-20261024)、Shopify連携先は [ta-vie-shopify-20261005](https://github.com/Aispecopeco/Adeki0725/tree/ta-vie-shopify-20261005) です。ストアはパスワード保護され、管理画面の認証がないため、同期完了と実データでの表示は直接確認できません。

プレビューの写真枠・記事・アカウント・告知は明示した検証用データです。添付ZIPにはホームの実物写真の選択がありません。実際の写真や、未設定のJournalページ・SNS情報などはShopify管理画面で設定してください。既存の設定値は引き継いでいます。

10月12日以前のテーマZIP、商品特集、プレビュー、3D試作は過去の作業記録として残しています。今回の状態は上記の最新ZIP・プレビューをご覧ください。
