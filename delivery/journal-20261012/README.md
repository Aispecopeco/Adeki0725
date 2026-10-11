# TA VIE｜Journal・お知らせ・Instagram／ライブの追加

2026年10月12日。最新のShopify保存 `6249aea` を基準に、元のBroadcastと既存記事を保持して実装しました。

## 実装とプレビュー

- ホームに公開日順の記事カード。初期3本、1〜6本へ変更でき、記事選択にも対応。
- Journal LPに大きなおすすめ記事、写真付き一覧、実際のタグ別ブログへの入口、過去の記事へのリンク。
- 専用のお知らせブログから、記事公開・更新・ブランド告知・ライブのタイムライン。Journalでは標準のページ送りで過去の告知まで表示。
- 共通のInstagramプロフィール・写真・投稿リンク。未設定のアカウントや写真枠を表示しません。
- 同じ告知記事からライブ日時・状態・アーカイブを表示。配信中の有効期限、延期・中止、案内期間を扱い、過去のタイムラインは保持。
- ホームへの初期配置、Journalテンプレート、独立したフッター入口を追加。

[ホーム・Journal操作プレビュー](interactive-preview.html) ／ [テーマZIP](../TA-VIE-Broadcast-journal-20261012.zip)

プレビューは既存テーマのLiquidとCSSを使ったローカル検証用です。写真は中立的な写真枠、記事・アカウント・告知も明示した仮データです。ホームとJournalを切り替えられます。実記事や外部サイトへのリンクは、プレビュー範囲を説明するダイアログを開きます。実際のストアへ仮データを登録していません。

| 表示 | PC | スマートフォン |
| --- | --- | --- |
| ホームのJournal | [画像](previews/home-journal-1440.png) | [画像](previews/home-journal-390.png) |
| Journal LP | [画像](previews/journal-1440.png) | [画像](previews/journal-390.png) |
| タイムライン | [画像](previews/timeline-1440.png) | [画像](previews/timeline-390.png) |
| Instagram | [画像](previews/instagram-live-1440.png) | [画像](previews/instagram-live-390.png) |
| ライブ案内 | [画像](previews/live-schedule-1440.png) | [画像](previews/live-schedule-390.png) |

## 自動で反映される項目

公開済み記事のタイトル・写真・タグ・公開日・要約・URLを記事データから取得します。新着は公開日時の順番で、最終更新日を変更しても先頭へ移しません。おすすめ・手動選択も記事への参照で、情報を入力し直す必要はありません。

記事更新の告知は自動生成せず、運営者が記録したものだけ表示します。告知日・元の記事公開日・記事最終更新日を区別します。ライブ状態は同じ告知記事を参照し、開始時刻だけで配信中にしません。期限切れの配信中表示は確認案内へ切り替えます。

## 運営者が入力する項目と残る設定

[設定・運用手順](setup-guide.md) に、画面・入力項目・値・確認方法をまとめています。

1. 既存の読みものブログをテーマ設定で選択。
2. Journalページを作り、テンプレート `journal` を割り当てて共通設定で選択。
3. 既存記事とは別のお知らせブログを用意し、14項目のブログ記事メタフィールドを定義。
4. 実際のInstagramプロフィール・紹介写真・任意の投稿リンクを登録。
5. 必要な告知記事と各回のライブ予定を登録。共通ライブ選択は最大12本。

これらのストア側の保存は管理画面認証がないため未実行です。必要な[実データ・素材](required-data.md) を確認してください。定義は [metafield-definitions.json](metafield-definitions.json) に同梱し、[補助スクリプト](setup-metafields.py) は通信なしの検査、認証後の既存定義確認、不足定義だけの作成に対応します。記事の作成・公開・変更は行いません。

## 主なファイル

| ファイル | 役割 |
| --- | --- |
| `sections/section-ta-vie-home-journal.liquid` / `snippets/ta-vie-journal-card.liquid` | 既存記事を参照するホーム紹介・共通カード |
| `sections/section-ta-vie-journal.liquid` / `templates/page.journal.json` | 新しい紹介LP。本文を読むときは元記事へ移動 |
| `snippets/ta-vie-timeline.liquid` / `ta-vie-notice.liquid` | 専用告知ブログの参照・日付順・履歴のページ送り |
| `snippets/ta-vie-live.liquid` / `assets/ta-vie-events.js` | 共有ライブ表示と期限切れバッジの解除 |
| `snippets/ta-vie-social.liquid` / `ta-vie-instagram-url.liquid` / `ta-vie-jst-time.liquid` | 共通Instagram、URL検査、日本時間の表示 |
| `assets/ta-vie-journal.css` / `ta-vie-events.css` / `ta-vie-social.css` | 新しい領域だけのスタイル・控えめな反応・スマホ対応 |
| `config/settings_schema.json` / `templates/index.json` / `sections/group-footer.json` | 共通設定の追加、初期配置、元のフッターへ独立した入口を追加 |

既存の記事・ブログのテンプレートやCSS、記事本文のレンダリングは置き換えていません。追加JavaScriptは約2.5KBで、Instagram API・埋め込みスクリプトの自動読み込みはありません。

## 確認結果と限界

[保護対象の一致確認](verification/source-preservation.json) で、既存17ブログ・記事ファイル、全テーマ設定データと配色が元ファイルと一致。元のホーム商品選択・文章・順序も保持しています。

[ブラウザー確認](verification/browser-validation.json) はPC1440px・スマホ390px、公開順／更新日、手動選択、下書き・未来記事除外、長いタイトル・写真なし、60告知の履歴、複数回の更新、ライブ5状態・表示期限・アーカイブ、JSTのうるう日・日付境界、キーボード・NoJS・編集時再接続、既存記事の表示一致を含みます。[単一HTML確認](verification/offline-preview-validation.json) もPC・スマホで実行し、最初のHTML取得後に通信を遮断して操作しました。直接の `file://` 実行は検証環境の制約で未確認です。

[静的チェック比較](verification/theme-comparison.json) は追加の指摘ゼロ。元のBroadcastにある4エラー・341警告は残っており、CLIの終了コードは1です。

実ストアはパスワード保護されています。実記事の本文・SEO・公開状態、実際のリンク先、Shopify管理画面での保存と同期完了は、この環境では未確認です。コードの保護とローカル仮データでの操作を確認した結果であり、本番データでの確認を代替しません。
