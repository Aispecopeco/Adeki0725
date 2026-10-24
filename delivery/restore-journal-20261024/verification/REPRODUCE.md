# 検証の再実行

Node、Python、`/usr/bin/chromium`、`/workspace/scratch/ta-vie/tools/node_modules` のShopify CLI・LiquidJS・Playwright Coreを使用します。依存関係は既存の実行環境に保持しています。

リポジトリの `theme/` や過去のZIPではなく、ルートの8テーマディレクトリを確認してください。補助スクリプトは外部の作業領域へコピーして使います。

```sh
mkdir -p /workspace/scratch/ta-vie/restore-journal-20261024/verification
cp delivery/restore-journal-20261024/verification/tools/*.cjs /workspace/scratch/ta-vie/restore-journal-20261024/verification/
node /workspace/scratch/ta-vie/restore-journal-20261024/verification/verify.cjs
node /workspace/scratch/ta-vie/restore-journal-20261024/verification/build-preview.cjs
node /workspace/scratch/ta-vie/restore-journal-20261024/verification/verify-offline.cjs
```

ブラウザー検証はその都度ローカルサーバーを起動して終了します。実記事やInstagramとの通信は代替データで、ストアへの書き込みは行いません。撮影位置と元のアニメーションの完了を確認して、実データとの違いを明記してください。

静的チェックは8ディレクトリだけを別の作業先へコピーし、次を実行します。終了コードはそのまま記録してください。基準テーマに4エラー・341警告があるため、今回追加した指摘と区別します。

```sh
/workspace/scratch/ta-vie/tools/node_modules/.bin/shopify theme check --path 検査用テーマの絶対パス --output json
```

今回の結果はブラウザー38ケース、単一HTMLのPC／スマホ2ケースが合格。フッターのみ元の表示アニメーション完了を待って再撮影し、`browser-validation.json` に記録しています。開発環境の `start_skill` も現在の検証手順へ更新し、ドラフトへ保存済みです。環境の公開・新しいタスクでの再作成は行っていません。
