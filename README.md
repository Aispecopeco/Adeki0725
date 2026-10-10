# TA VIE｜写真を操作して、一着を深く知る

2026年10月10日の追加指示に合わせ、復元したBroadcast 8.1.1を基に、温かい白・チャコール・グレージュと日本語の文字組みを整えています。ホームは4着の大きな写真と個別の紹介、商品詳細は実商品説明・素材・生活場面・サイズ・お手入れの章を組み合わせます。写真切替、編集できる細部のポイント、接写パネル、写真付きの商品ナビを追加し、購入にはBroadcastの既存機能を使用します。

今回の作業用ブランチは [ta-vie-luxury-experience-20261010](https://github.com/Aispecopeco/Adeki0725/tree/ta-vie-luxury-experience-20261010) です。[実装・プレビュー・検証の資料](delivery/luxury-experience/README.md)を今回の確認と運用に使用してください。

- [Shopify取り込み用テーマZIP](delivery/TA-VIE-Broadcast-luxury-experience-20261010.zip)
- [操作できる単体HTMLプレビュー](delivery/luxury-experience/interactive-preview.html)
- [プレビュー一式のZIP](delivery/TA-VIE-luxury-interactive-preview-20261010.zip)
- [商品別の編集手順](delivery/luxury-experience/editing-guide.md)
- [4着の写真・商品情報の準備一覧](delivery/luxury-experience/required-content.md)

ストアはパスワード画面で、商品取得URLはHTTP 401でした。添付テーマには服の実物写真・商品データが含まれないため、正式な4着への割り当てと実物写真の登録はShopify管理画面で行います。操作プレビューは明示した検証用写真枠・商品名・価格を使用し、注文を作成しません。テーマの公開画面は実際のShopify商品を読み取り、未設定の写真や説明に仮文言を出しません。

配色の13個のIDは現在設定と全プリセットで一致させています。添付ZIPにない `config/settings_data.json` は復元時の設定を基に保持しています。元の127アセットと標準の購入・カートJavaScriptは維持し、追加機能は独立したファイルへ実装しています。

2026年10月10日、ユーザーの反映指示に基づき、検証済みのテーマをShopify連携先 [ta-vie-shopify-20261005](https://github.com/Aispecopeco/Adeki0725/tree/ta-vie-shopify-20261005) へ反映しました。復元時点は `ta-vie-before-luxury-sync-20261010` ブランチにも保存しています。Shopify管理画面の実際の接続先・同期完了・公開状態は認証がないため未確認です。[同期の確認手順](delivery/luxury-experience/shopify-sync.md)に従い、連携テーマのプレビューを更新してください。別テーマとして取り込む場合は「オンラインストア → テーマ → テーマを追加 → ZIPファイルをアップロード」でテーマZIPを使用します。操作プレビューのZIPはこの取り込みには使用しません。

`delivery/editorial-lp/`、`delivery/original-restore-20261010/`、以前のZIP・3D試作は過去の納品資料として残しています。今回の実物写真には使用していません。復元時点のコードはコミット `60cc2d4` から確認できます。
