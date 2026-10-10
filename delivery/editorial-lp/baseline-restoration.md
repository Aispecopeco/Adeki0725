# TA VIE｜添付テーマへ戻した範囲

## 基準にしたテーマ

今回アップロードされた `theme_export__eeai0r-vh-myshopify-com-adeki0725-ta-vie-shopify-20261005__05OCT2026-1026am.zip` を復元の基準にしました。テーマ情報は **Broadcast 8.1.1**、展開されたテーマファイルは428個です。

共通ファイルを添付テーマの内容へ戻したうえで、過去に発生した配色・ナビゲーション・フッターロゴの問題を再導入しないための修正と、既存Broadcastの商品購入機能につながる処理を保持しています。既存の作業成果と3D資料はリポジトリへ残し、今回のテーマZIPと公開画面には必要なテーマファイルを使います。

## 保持した修正

| 対象 | 保持した理由 |
| --- | --- |
| `config/settings_data.json` | 添付ZIPに存在しないため。現在の配色とプリセットを保持する |
| `config/settings_schema.json` | 配色の定義、日本語書体、ブログ・FAQ行き先の編集項目を維持する |
| `layout/theme.liquid`、`snippets/ta-vie-home-typography.liquid` | テーマ本来の書体設定を尊重し、日本語・共通リンクの補正を利用する |
| `snippets/header-toolbar.liquid`、`sections/header.liquid`、`sections/mobile-menu.liquid`、`sections/group-header.json` | 上部、PC・ハンバーガーのリンク・言語・SNS表示を維持する |
| `sections/footer.liquid`、`sections/section-anchor-logo.liquid`、`sections/group-footer.json` | 空のリンク列を処理し、巨大なフッターロゴの再表示を防ぐ |
| `snippets/product.liquid`、`snippets/cart-bar.liquid`、`sections/product.liquid`、`templates/product.json` | Broadcastの購入・バリエーション処理と商品専用特集を接続し、宝飾品デモの説明・保証を公開しない |

復元後に保持した14個の既存ファイルは上表の `settings_data.json` を除くファイルです。さらに、前回追加した日本語ロケール、商品特集用のCSS・JavaScript・スニペットなどは削除せず利用します。

`settings_data.json` の `current` と Broadcast／Relay／Airwave／Motif／Stellar の全プリセットには、同じ13個の配色IDを保持します。`settings_schema.json` の配色グループも対応させ、配色プレビューの警告や「プリセットには同じ配色のIDが含まれている必要があります」という保存エラーを再導入しない構成です。実ストアの保存結果は、実際に管理画面で確認した範囲として別途記録します。

## ホームとFAQの扱い

添付ホームの19個のセクションは、元の設定・ブロックを残して無効にしています。新しい商品中心のLPを有効にし、4つの独立した商品紹介ブロックから商品詳細へつなぎます。初期状態では `all` コレクションの実在する公開商品を利用し、明示選択と重複する商品を除きます。自動商品の場合は、商品の取り違えを防ぐためブロックの上書き文章・写真を使いません。自動表示はオフにもできます。旧セクションをエディタで再度有効にする場合は、未選択の画像・動画と、リング／ネックレスなどのデモ内容が残っていないか確認してください。

添付テーマはホームの実画像・動画・商品を選択していませんでした。ストアの画像参照はヘッダーとフッターのロゴだけです。テーマコードの復元は、Shopifyの商品、画像ファイル、ページ、記事、メニューの管理データを復元する操作ではありません。

FAQは `templates/page.faq.json` の標準ページ本文を有効にしました。旧英語デモの送料・返品・仮メールアドレス・セキュリティの説明は無効化しています。既存FAQページの実際のタイトルと本文を表示し、管理画面のページを新規作成・書き換える処理は行っていません。

## 作業とレビューの境界

作業ブランチは `ta-vie-editorial-lp-20261010` です。Shopify連携済みの `ta-vie-shopify-20261005` へ変更を反映せず、未公開テーマとして確認できるZIPをまとめます。GitHubの作業ブランチへコードがあるだけでは、商品メディアやブログ記事が自動追加されることはありません。

表示画像と検証結果は、このフォルダーの `previews/` と `verification/` にまとめます。確認用データによるローカル動作と、実ストアの購入・在庫・テーマ保存・公開は区別して記録します。
