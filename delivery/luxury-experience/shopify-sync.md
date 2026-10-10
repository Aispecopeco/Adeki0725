# Shopify連携ブランチへの反映

2026年10月10日、ユーザーの「それではshopifyに反映させて」という指示に基づき、検証済みテーマの実装コミット `af1c5077280f508732e4c01912c01fe69b473c11` と同期案内を、既存連携ブランチへ反映しました。

- リポジトリ：[Aispecopeco/Adeki0725](https://github.com/Aispecopeco/Adeki0725)
- 連携先：[ta-vie-shopify-20261005](https://github.com/Aispecopeco/Adeki0725/tree/ta-vie-shopify-20261005)
- 作業・検証：[ta-vie-luxury-experience-20261010](https://github.com/Aispecopeco/Adeki0725/tree/ta-vie-luxury-experience-20261010)
- 反映前の保存先：[ta-vie-before-luxury-sync-20261010](https://github.com/Aispecopeco/Adeki0725/tree/ta-vie-before-luxury-sync-20261010)（`60cc2d4`）

連携ブランチの更新前に、GitHub側に追加の変更がないことを確認しました。履歴を保持して作業ブランチの変更を取り込み、リポジトリ直下の445個のテーマファイルは検証済みのテーマZIPと一致します。

## Shopifyで確認する場所

1. 管理画面の「オンラインストア → テーマ」で、GitHub連携テーマを開きます。接続先が上記リポジトリの `ta-vie-shopify-20261005` であることと、同期状態を確認します。
2. 同期後に「プレビュー」または「カスタマイズ」を開き直します。ホームに「TA VIE｜一着を知る」、商品テンプレートに「TA VIE 一着の特集」があることを確認します。
3. ホームと商品特集それぞれの4商品選択に正式な商品を設定します。実物写真と独立した説明の登録先は[商品別の編集手順](editing-guide.md)を参照してください。
4. 反映が見えない場合は、別ブランチ・別テーマを表示していないか、同期エラーがないかを先に確認します。GitHubの最新コミットは連携先ブランチの画面で確認できます。

Shopify管理画面への認証がないため、Shopify側の同期完了、実商品でのプレビュー、現在の公開テーマは直接確認できていません。今回の確認結果はGitHubへのコード反映と、既存の検証用データによる表示・操作の検証です。商品、写真、メタオブジェクト、ナビゲーションなどの管理データは、テーマコードの更新だけでは作成されません。
