# TA VIE｜白いシャツの参考3Dモデル

写真 `S__39354430_0.jpg` の白いシャツを参考に制作した、服だけの3D試作です。人物・肌・バッグ・写真の背景は含みません。

落ちた肩、深く開いた襟、幅広の折り返し袖、左右の大きな胸ポケット、長くゆったりした胴と丸い裾を表現しました。背面、正確な寸法、ボタン数、素材の種類・混率は確認できていません。写真の3Dスキャンや正確な型紙ではありません。布の表面とシワも見た目の表現です。

## Shopifyに追加するファイル

**`ta-vie-white-shirt-prototype.glb` を使います。** 画像・メッシュ・白い素材をファイル内に含むGLBで、容量は約3.8MBです。ZIP、HTML、Blenderファイルを商品メディアとして送る必要はありません。

1. Shopify管理画面の「商品」で、まず下書きの確認用商品を開きます。
2. 「メディア」から「ファイルを追加」を選び、上の **.glb** をアップロードします。
3. Shopify側の処理完了を待ち、表示順と代替テキストを設定して保存します。
4. 商品のプレビューで3D表示を開き、回転・拡大とスマートフォンでの操作を確認します。
5. 実物との違いを確認・修正した後、正式商品へ使用します。

既存Broadcast 8.1.1には商品3Dメディアの表示機能があります。GitHubのテーマへGLBを置くだけでは商品メディアに登録されません。今回はShopifyの管理画面へのアップロードや本番公開はしていません。

代替テキスト案：**「写真を参考に制作した白いシャツの3D試作。背面・実寸は未確認」**。

## 同梱ファイル

| ファイル | 用途 |
| --- | --- |
| `ta-vie-white-shirt-prototype.glb` | Shopifyへ追加する3Dモデル |
| `ta-vie-white-shirt-prototype.usdz` | USDZ形式のモデル。Apple実機での表示は未確認 |
| `shirt-3d-preview.html` | 回転・拡大できる閲覧用HTML。モデルと閲覧ライブラリを埋め込み |
| `ta-vie-white-shirt-prototype-front.png` / `three-quarter.png` / `back.png` / `mobile.png` | ブラウザで描画した確認画像。ファイル名の前半は共通 |
| `shirt-prototype-studio.png` | Blenderの照明で描画した確認画像 |
| `ta-vie-white-shirt-prototype.blend` | 形と素材を編集できるBlender 4.3の制作データ |
| `illustrative-fabric-normal.png` | 試作の表面用画像。GLBとBlenderファイルには埋め込み済み |
| `model-notes.json` / 各検証JSON | 制作範囲と検証記録 |
| `source/build_shirt.py` / `source/fix-zero-tangents.py` | Blenderで再生成するための制作スクリプト |
| `SHA256SUMS.txt` | 同梱ファイルのハッシュ値 |
| `MODEL-VIEWER-LICENSE.txt` / `THREE-LICENSE.txt` | HTMLに同梱した閲覧ライブラリのライセンス |

このクラウド環境ではローカルファイルを直接開く操作に制限があるため、HTMLの `file://` 表示は未確認です。HTTP経由で確認する場合は、このフォルダで `python -m http.server 8000` を実行し、同じPCのブラウザで `http://localhost:8000/shirt-3d-preview.html` を開きます。これは手元で閲覧する方法で、ストアのプレビューURLではありません。

形を修正する場合は `.blend` をBlenderで開き、服のオブジェクトだけを選んでGLBを書き出してください。床・照明・カメラはプレビュー用です。制作スクリプトから再生成する場合は、Blender 4.3環境で次を実行します。出力先は別のフォルダにし、同梱の検証記録は再利用せず、書き出したモデルを再検証してください。

```sh
TA_VIE_3D_OUTPUT="$PWD/regenerated" blender --background --factory-startup --python source/build_shirt.py
```

## 実物に近づけるために必要な情報

- 同じ服の正面・背面・左右の写真。できれば服だけを平置き、または同じ姿勢・同じカメラ高さで撮影。
- 襟、袖の折り返し、前立て、ポケット、裾の接写。
- 着丈・身幅・肩幅・袖丈・ポケットの幅と高さ。各測定の基準点も必要。
- 生地の種類と厚み、実際の留め具の位置、背面の縫い目が分かる資料。

現在のスケールは表示用です。サイズ選び、着用感の判断、実寸AR、製造用データには使えません。実寸ARを使用する場合は、実測値でモデルを調整してから実機で確認します。

## 確認範囲

GLBはKhronosの検査でエラー0・警告0です。PC（1440px）の正面・斜め・背面と拡大、スマートフォン相当（390px）の表示と拡大の計6項目をChromiumのWebGLで確認しました。表示エラー・横方向のはみ出し・外部リソースへの通信はありません。主要な3方向のボタンはカメラ角度も確認しています。

USDZはアーカイブのCRC・64バイト境界と、OpenUSDでの読み込み、メッシュ・マテリアル・内部画像参照を確認しました。詳細は同梱の検証JSONを参照してください。これらは実商品の寸法や形を保証する検査ではありません。実Shopifyへの取り込み、実ストアの商品ページ、スマートフォン実機のタッチ操作、Apple実機ARは未確認です。

Shopify公式の説明：<https://help.shopify.com/ja/manual/products/product-media/product-media-types>。今回、この環境からは公式ページへの接続が403となり本文を再確認できませんでした。容量上限などの最新数値は断定せず、実際の管理画面で確認してください。
