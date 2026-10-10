# TA VIE｜写真を操作して、一着を深く知る

2026年10月10日、商品特集だけになっていたホームの構成を修正しました。Broadcast標準のブランド入口・写真と文章・生活場面のセクションを復帰し、「ブランドの入口 → TA VIEの想い → 一着ごとの特集 → 家で過ごす場面 → 読みものとご案内」の5章で表示します。写真が未設定なら文章を自然に表示し、仮画像や大きな空欄を出しません。商品詳細の写真切替・接写・購入機能は維持しています。[今回の修正・編集・確認結果](delivery/home-composition-fix-20261010/README.md)を参照してください。

今回の作業用ブランチは [ta-vie-luxury-experience-20261010](https://github.com/Aispecopeco/Adeki0725/tree/ta-vie-luxury-experience-20261010) です。[実装・プレビュー・検証の資料](delivery/luxury-experience/README.md)を今回の確認と運用に使用してください。

- [最新のShopify取り込み用テーマZIP](delivery/TA-VIE-Broadcast-home-composition-fix-20261010.zip)
- [修正後のホームを操作する（検証用データ）](delivery/home-composition-fix-20261010/interactive-preview.html)
- [修正後のホーム：PC](delivery/home-composition-fix-20261010/previews/home-1440.png)
- [修正後のホーム：スマートフォン](delivery/home-composition-fix-20261010/previews/home-390.png)
- [商品操作の単体HTMLプレビュー（ホーム構成修正前の検証用）](delivery/luxury-experience/interactive-preview.html)
- [商品別の編集手順](delivery/luxury-experience/editing-guide.md)
- [4着の写真・商品情報の準備一覧](delivery/luxury-experience/required-content.md)

ストアはパスワード画面で、商品取得URLはHTTP 401でした。添付テーマには服の実物写真・商品データが含まれないため、正式な4着への割り当てと実物写真の登録はShopify管理画面で行います。操作プレビューは明示した検証用写真枠・商品名・価格を使用し、注文を作成しません。テーマの公開画面は実際のShopify商品を読み取り、未設定の写真や説明に仮文言を出しません。

配色の13個のIDは現在設定と全プリセットで一致させています。添付ZIPにない `config/settings_data.json` は復元時の設定を基に保持しています。元の127アセットと標準の購入・カートJavaScriptは維持し、追加機能は独立したファイルへ実装しています。

2026年10月10日、ユーザーの反映指示に基づき、検証済みのテーマをShopify連携先 [ta-vie-shopify-20261005](https://github.com/Aispecopeco/Adeki0725/tree/ta-vie-shopify-20261005) へ反映しました。復元時点は `ta-vie-before-luxury-sync-20261010` ブランチにも保存しています。Shopify管理画面の実際の接続先・同期完了・公開状態は認証がないため未確認です。[同期の確認手順](delivery/luxury-experience/shopify-sync.md)に従い、連携テーマのプレビューを更新してください。別テーマとして取り込む場合は「オンラインストア → テーマ → テーマを追加 → ZIPファイルをアップロード」でテーマZIPを使用します。操作プレビューのZIPはこの取り込みには使用しません。

`delivery/editorial-lp/`、`delivery/original-restore-20261010/`、以前のZIP・3D試作は過去の納品資料として残しています。今回の実物写真には使用していません。復元時点のコードはコミット `60cc2d4` から確認できます。
