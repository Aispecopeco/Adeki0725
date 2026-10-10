# TA VIE｜商品を主役にしたBroadcastテーマ

今回添付されたBroadcast 8.1.1を基準に戻し、一着ずつ写真を大きく見せるホームと、商品説明・素材・細部・暮らしを読み進める商品詳細へ整えました。元の購入・画像・カート機能を使い、配色の保存修正、ブログ・FAQ・SNS・言語への導線を引き継いでいます。

確認用ブランチは [ta-vie-editorial-lp-20261010](https://github.com/Aispecopeco/Adeki0725/tree/ta-vie-editorial-lp-20261010) です。Shopify連携ブランチ [ta-vie-shopify-20261005](https://github.com/Aispecopeco/Adeki0725/tree/ta-vie-shopify-20261005) にも同じテーマコードを反映しています。Shopify側の同期結果・表示・公開状態は未確認です。

- [今回のテーマ ZIP](delivery/TA-VIE-Broadcast-editorial-LP-20261010.zip)
- [デザイン・改修内容・確認範囲](delivery/editorial-lp/README.md)
- [商品・写真・文章を編集する手順](delivery/editorial-lp/editing-guide.md)
- [添付テーマへ戻した範囲](delivery/editorial-lp/baseline-restoration.md)
- [追加で必要な写真・商品情報](delivery/editorial-lp/required-content.md)
- [PC・スマートフォンの確認画像](delivery/editorial-lp/previews)
- [検証結果](delivery/editorial-lp/verification)

GitHub連携テーマでは、Shopify側の接続ブランチが `ta-vie-shopify-20261005` であることを確認して、そのテーマのプレビューを開いてください。GitHub連携はリポジトリ直下のテーマコードを同期します。詳しい確認手順は [GitHubからShopifyへの反映](delivery/editorial-lp/github-sync.md) を参照してください。

ZIPで別の確認用テーマを追加する場合は、GitHubファイル画面で **Download raw file** を選び、Shopifyのテーマライブラリへ未公開テーマとして追加してください。「Code → Download ZIP」はリポジトリ全体であり、Shopify用テーマZIPとは異なります。

ホームは最大4着を独立した紹介として表示します。各ブロックの商品を選ぶほか、初期設定では未選択の枠を実際の公開コレクションから補います。写真・価格・商品説明は実際の商品データを使います。正式な商品と掲載順を管理画面で確認してください。商品がない場合は、仮の服や仮文言を出さずブランドの文章を表示します。

商品別の素材・細部・サイズなどは[専用コンテンツの登録手順](delivery/product-content-model.md)で追加できます。商品説明は、この登録前でも商品ごとに表示します。未確認の素材、産地、機能、レビュー、配送・返品の約束は追加していません。プレビューの検証用データは実商品の写真や価格を示しません。

写真の白いシャツの参考3D試作は、[GLB](delivery/3d/ta-vie-white-shirt-prototype.glb)、[一式ZIP](delivery/TA-VIE-white-shirt-3D.zip)、[Shopifyへの追加手順](delivery/3d/Shopifyへの追加手順.md)を保持しています。背面と実寸が未確認の試作で、今回のホームへ実物写真として使用していません。

以前の改修資料とZIPは delivery/ に残しています。今回のテーマZIPと delivery/editorial-lp/ の説明を優先してください。
