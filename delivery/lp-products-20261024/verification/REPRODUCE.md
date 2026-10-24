# 商品表示の検証

既存のNode/Python、Shopify CLI・LiquidJS・Playwright Core（`/workspace/scratch/ta-vie/tools/node_modules`）、`/usr/bin/chromium`を使います。作業ツリーの変更を確認してから、元コードのルート8ディレクトリを対象にしてください。

```sh
mkdir -p /workspace/scratch/ta-vie/lp-products-20261024/verification
cp delivery/lp-products-20261024/verification/tools/* /workspace/scratch/ta-vie/lp-products-20261024/verification/
node /workspace/scratch/ta-vie/lp-products-20261024/verification/verify.cjs
node /workspace/scratch/ta-vie/lp-products-20261024/verification/verify-accessibility.cjs
node /workspace/scratch/ta-vie/lp-products-20261024/verification/build-preview.cjs
node /workspace/scratch/ta-vie/lp-products-20261024/verification/verify-offline.cjs
```

`verify.cjs`から順番に実行すると検証記録が更新されます。原稿・画像・価格・在庫の一部はローカル代替データで、実ストアの登録や購入を行いません。既存のホーム画像だけは保存済みの公開メディアを取得したスナップショットを同梱しています。

ブラウザー検証28件とオフラインHTML2件が最終版で合格しています。テストはローカルサーバーを起動し、終了時に閉じます。ループバックURLはユーザーへの公開プレビューとして案内しません。

静的チェックは8テーマディレクトリだけの作業用コピーに対し、Shopify CLIのtheme checkを実行します。元コードにも4エラー・341警告があり、終了コード1を保持して追加指摘と区別してください。
