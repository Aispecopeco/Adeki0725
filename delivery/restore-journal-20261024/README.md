# 添付テーマへ戻し、Journal・Instagramを引き継いだ版

2026年10月24日。添付された10月5日版のBroadcast 8.1.1を土台に戻し、Journal・記事紹介・お知らせ・Instagram／ライブ案内を移植しました。元の日本語52項目と、Journal側の文章はそのままです。

[今回のShopifyテーマZIP](../TA-VIE-Broadcast-restored-journal-20261024.zip) ／ [ホーム・Journal操作プレビュー](interactive-preview.html)

## 戻したもの・残したもの

- ホームは添付版の19セクション、元の順番と表示・非表示状態を維持しました。
- 商品ページは添付版のBroadcastへ戻しました。以前の特集テンプレート `product.ta-vie` が割り当てられている商品も、同じ元の商品レイアウトで開けます。
- Journalのホーム紹介、特集LP、お知らせタイムライン、Instagram／ライブをそのまま引き継ぎました。記事本文・写真・URL・公開日を移動・複製する処理は行っていません。
- Shopify側の最新保存 `84be4a2` にある設定と、言語・SNSの操作を引き継ぎました。

## 整えたところ

- ホーム見出しは、既存のホーム専用設定で明朝・セリフへ変更。本文・価格・商品ページ・記事本文の書体は維持。
- ヘッダーロゴはPC160px／スマホ130px。フッターロゴは最大PC420px／スマホ240pxで中央に置き、エディタで幅を変更できます。
- 分割セクションとカラムの余白を調整。ヒーローは手動切り替えにし、文字帯の速度を抑えました。
- リンク未設定のフッターメニューと、スマホメニューの未選択商品は公開画面で非表示。管理画面では編集でき、実際のメニューを割り当てると表示されます。

## 配色エラーへの対応

添付ZIPには `config/settings_data.json` がありませんでした。このファイルは既存の連携テーマから回収し、Journal・SNS・現在の設定・5プリセットを保持しています。

`settings_schema.json` と対応する13個の配色IDを、現在設定と全プリセットで確認しました。以前の配色警告やRelayのID不一致を起こす構造には戻していません。実際のShopifyエディタでの保存は、管理画面認証がないため未確認です。

## 確認画像

画像と記事・アカウントは、明示したローカル検証用データです。添付ZIPに実商品の写真やホームの写真選択は含まれていません。実物と異なる服の写真や架空の記事をストアへ登録していません。

| 表示 | PC | スマートフォン |
| --- | --- | --- |
| ホーム冒頭 | [画像](previews/home-1440.png) | [画像](previews/home-390.png) |
| 元のブランド紹介 | [画像](previews/brand-story-1440.png) | [画像](previews/brand-story-390.png) |
| ホームのJournal | [画像](previews/home-journal-1440.png) | [画像](previews/home-journal-390.png) |
| Journal LP | [画像](previews/journal-1440.png) | [画像](previews/journal-390.png) |
| Instagram | [画像](previews/instagram-live-1440.png) | [画像](previews/instagram-live-390.png) |
| フッター | [画像](previews/footer-1440.png) | [画像](previews/footer-390.png) |

プレビューは今回の実際のLiquid・テーマCSSから描画しています。ホームとJournal、過去のお知らせへ移動できます。記事本文やInstagramなど外部への移動は、プレビューの対象範囲を説明する表示になります。実ストアの記事・SNSアカウントを確認したものではありません。

## 編集・残る設定

写真・商品は、元のBroadcastの各セクションで選びます。添付版に未選択の欄があるため、公開前に実物写真を設定してください。文章を入力し直す必要はありません。

- ヘッダー：テーマエディタの「Header」でロゴ、メニュー、言語・SNSを設定。
- フッターロゴ：「Logo」で写真・PC最大幅・スマホ最大幅を設定。
- フッターメニュー：「Footer」の各リンクメニューで実在するメニューを選択。
- Journal／Instagram／ライブ：テーマ設定「TA VIE｜Journalと発信」で共通データを編集。
- Journalページ、お知らせブログ、記事の追加項目、実際のInstagram情報が未設定の場合は、既存の[設定・運用手順](../journal-20261012/setup-guide.md)を使えます。

すでに登録された記事・告知・ライブは同じデータを参照します。今回これらを作り直す操作は行っていません。ストアはパスワード保護され、管理画面の認証がないため、実記事の公開状態・購入処理・Shopify同期完了は直接確認できません。

## 検証記録

PC・スマホのブラウザー38ケースと単一HTMLの2ケースを確認しました。

- [元コード・日本語・配色・移植機能の保持確認](verification/source-preservation.json)
- [PC・スマホの操作確認](verification/browser-validation.json)
- [静的チェック比較](verification/theme-check-comparison.json)
- [復元と移植の詳細](migration-notes.md)

静的チェックは追加の指摘ゼロ。元テーマにある4エラー・341警告は残り、CLIの終了コードは1です。実ストアの確認とは区別して記録しています。

過去の追加商品特集とその素材はGit履歴に残しています。今回のテーマでは元の商品ページを使用します。
