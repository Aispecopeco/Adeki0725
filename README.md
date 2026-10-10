# TA VIE｜Broadcast 8.1.1 商品体験の改修

元のBroadcastの写真構成・スクロール演出を使えるホームへ戻し、4着それぞれの詳しい紹介につながる枠を用意しました。商品詳細は元のギャラリー・色／サイズ選択・価格・在庫・カートを使い、その下へ「理由・素材・細部・暮らし・サイズ・お手入れ」の商品別特集を追加しています。

作業用ブランチは [ta-vie-product-experience-20261010](https://github.com/Aispecopeco/Adeki0725/tree/ta-vie-product-experience-20261010)。Shopify連携済みのブランチと本番テーマは更新していません。未公開テーマへ取り込んでレビューする版です。

- [修正テーマ ZIP](delivery/TA-VIE-Broadcast-8.1.1-edited.zip)
- [デザイン・変更ファイル・プレビュー・確認範囲](delivery/product-experience.md)
- [商品ごとの文章・写真・動画・サイズの編集手順](delivery/product-content-model.md)
- [ホームの編集手順](delivery/home-structure.md)
- [追加で必要な写真・商品情報](delivery/required-shots.md)
- [ブログ・FAQ・SNS・言語の設定](delivery/navigation.md)
- [静的チェックとブラウザ検証](delivery/validation.md)
- [参考サイトの確認範囲](delivery/reference-audit-20261010.md)
- [元テーマとの差分](delivery/changes.json)

ZIPをShopifyへ取り込む場合は、上のZIPのGitHubファイル画面で **Download raw file** を選んでください。「Code → Download ZIP」はリポジトリ全体です。説明書、プレビュー、検証用データはテーマZIPへ含めていません。

正式商品・写真・原稿は未設定です。ストアのパスワード保護で実商品を取得できなかったため、商品別の型定義と素材の登録手順まで用意しています。未設定の写真や商品特集は公開画面に空枠・仮文言を出しません。プレビューのテスト用画像・価格・寸法は実商品を示しません。

最初に代表商品の特集を登録し、同じ未公開テーマでPC／スマホ・購入・在庫・エディタを確認してから公開してください。商品の事実は商品別コンテンツ、章の順番と見た目は共通テンプレートで管理します。
