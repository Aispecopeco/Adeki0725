# TA VIE｜元のBroadcastで商品を見せるホームLP

2026年10月24日。元テーマで非表示・未選択になっていた商品表示を直しました。元のFeatured product／Featured collectionを使い、3商品の写真と、Shopifyの実際の商品情報をホームLPから見られるようにしています。

- [今回の商品表示・編集・確認](delivery/lp-products-20261024/README.md)
- [最新のホーム商品表示テーマZIP](delivery/TA-VIE-Broadcast-home-products-20261024.zip)
- [商品が見える操作プレビュー](delivery/lp-products-20261024/interactive-preview.html)
- [商品表示と既存コードの保持確認](delivery/lp-products-20261024/verification/source-preservation.json)
- [作成した7枚の画像素材](delivery/product-images-20261024/README.md)
- [Journal・Instagram／ライブの設定手順](delivery/journal-20261012/setup-guide.md)

冒頭の「ルームウェアを見る」から商品欄へ移動できます。3商品の写真は実際のテーマassetsに入り、上下の写真を開いて確認できます。公開商品があれば元のカードが商品名・価格／売り切れ・商品ページへつながります。写真の順番を任意のSKUへ自動で割り当てたり、架空の価格を表示したりしません。

管理画面で保存済みのホーム画像 `tavie-home.png`、既存の日本語、元の商品詳細・バリエーション・カート、配色設定、ブログ・Journal・Instagram／ライブは保持しています。元の22セクションを残し、商品欄の追加後は23セクションです。

作業ブランチは [ta-vie-home-products-20261024](https://github.com/Aispecopeco/Adeki0725/tree/ta-vie-home-products-20261024)、Shopify連携先は [ta-vie-shopify-20261005](https://github.com/Aispecopeco/Adeki0725/tree/ta-vie-shopify-20261005) です。ストアの管理画面認証がないため、同期完了・現在の公開テーマ・実商品での購入は直接確認できません。

商品A〜Dは、Shopifyの販売チャネル「オンラインストア」で公開されていれば自動表示します。商品を選ばなくても公開商品を自動参照します。先頭の主役商品と掲載コレクションは、元テーマの設定から変更できます。

プレビューの「商品A〜D」はご指定の呼称です。価格・在庫・商品URL・商品カードの画像・記事は明示したローカル検証データで、実ストアの登録内容は未取得です。3商品の写真は提供写真をもとにした生成画像、ホームの既存写真は管理画面で選択されている画像を使っています。旧テーマZIP・旧プレビュー・3D試作は過去の記録として残しています。
