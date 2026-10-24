# 商品特集の表示・操作を確認する

既存のNode/Python、LiquidJS・Playwright Core（`/workspace/scratch/ta-vie/tools/node_modules`）、`/usr/bin/chromium`、Shopify CLI 4.8.4を使います。必要なコード・画像スナップショットを作業用フォルダへコピーしてから実行します。

```sh
mkdir -p /workspace/scratch/ta-vie/product-stories-20261025/verification
cp delivery/product-stories-20261025/verification/tools/* /workspace/scratch/ta-vie/product-stories-20261025/verification/
node /workspace/scratch/ta-vie/product-stories-20261025/verification/verify.cjs
node /workspace/scratch/ta-vie/product-stories-20261025/verification/build-preview.cjs
node /workspace/scratch/ta-vie/product-stories-20261025/verification/verify-offline.cjs
node /workspace/scratch/ta-vie/product-stories-20261025/verification/static-check.cjs
```

サーバーは各検証スクリプトが起動・終了します。ローカルホストのURLを公開プレビューとして案内しません。HTML・スクリーンショット・結果JSONを納品フォルダへ保存します。

実際のテーマ本体・レイアウト・Broadcast部品を使い、Shopifyリソース・フォーム・画像フィルターなどはローカルの代替処理で描画します。「商品A〜D」はいただいた名称ですが、価格・在庫・商品URL・商品カード内の画像・記事は検証用データです。元から選択されている3枚の写真と、今回の商品紹介写真は保存済みの実ファイルを使います。

実ストアの管理画面保存、Shopify側の同期、バリエーションやカートのバックエンド・決済は、この検証の対象外です。

静的チェックはテーマ8ディレクトリだけを作業用フォルダにコピーし、現在のコードと `d25ee0e` を比較します。既存の指摘はそのまま記録し、追加の指摘と区別します。

最終版では表示・操作44件、オフラインHTMLのPC／スマホ2件が合格しています。PC・スマホのスクリーンショットは16枚です。静的チェックは既存と同じ4エラー・341警告（CLI終了コード1）で、追加の指摘はありません。ブラウザー記録の274件のソース／アセットハッシュ、および静的チェックに使ったテーマ458ファイルが現在のコードと一致することも確認しました。
