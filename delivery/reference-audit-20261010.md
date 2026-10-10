# TA VIE 商品体験：参考資料の確認

確認日：2026年10月10日（日本時間）。指定 URL を Python urllib で各 1 回取得し、システム標準の TLS 証明書検証を使用した。

## 指定された 7 ページの到達結果

| 参照 | 指定 URL | 実際の結果 | 内容を直接確認したか |
| --- | --- | --- | --- |
| Tekla 商品 | https://teklafabrics.com/product/poplin-long-sleeved-shirt-shirt-blue | プロキシの CONNECT が 403 Forbidden | 未確認 |
| Tekla 制作事例 | https://signifly.com/work/tekla | プロキシの CONNECT が 403 Forbidden | 未確認 |
| Vollebak 商品 | https://vollebak.com/products/full-metal-jacket-copper-edition | プロキシの CONNECT が 403 Forbidden | 未確認 |
| Asphalte 商品 | https://www.asphalte.com/fr/h/products/le-t-shirt-ultime-v12 | プロキシの CONNECT が 403 Forbidden | 未確認 |
| Foo Tokyo 商品 | https://footokyo.jp/products/4580511167172 | プロキシの CONNECT が 403 Forbidden | 未確認 |
| ASKET 商品 | https://www.asket.com/en-us/mens-t-shirt-white | プロキシの CONNECT が 403 Forbidden | 未確認 |
| Moose Knuckles 制作事例 | https://theendless.co/work/moose-knuckles/ | プロキシの CONNECT が 403 Forbidden | 未確認 |

これはサイト自体の HTTP 403、ページ削除、証明書不正を示す結果ではない。接続先へ達する前に、この実行環境のプロキシが接続を拒否した。ページ本文、画像、ブラウザ上の操作は取得できていない。同一 URL の再試行、TLS 検証の無効化、証明書ストアの変更は行っていない。

取得ログは作業環境の `/workspace/scratch/ta-vie/product-experience-20261010/references/http-results.json` と各 `*-result.json` に保存。上表は全7結果を転記したもの。取得できていない競合サイトの画像を、TA VIE の実商品写真として使用しない。

## 直接確認できた既存資料

指定 7 ページとは別に、前の作業で TLS 検証付き GET・HTTP 200 で保存された公式 Broadcast 資料を確認した。

- `/workspace/scratch/ta-vie/references/broadcast-demo-current.html`：Broadcast 8.1.0 と記載。TA VIE の提供元コードは 8.1.1 なので、版の完全一致は主張しない。
- `/workspace/scratch/ta-vie/references/official-broadcast-preview-desktop.jpg`：公式配布の静止プレビューを目視確認。大きな全幅写真、上部の細いユーティリティ列と中央ロゴ、写真内の見出しと 2 CTA、白背景の文中商品画像、3 枚の大きな写真と各説明が確認できた。これは静止画像の観察であり、インタラクションの実測ではない。
- 元テーマの `sections/product.liquid`：sticky form、image zoom、media、商品説明、accordion、variant picker、size chart、色を別商品にする siblings、在庫表示、pickup などの標準設定がある。購入機能を独自に置き換える前に、これらの既存機能を生かせる。

## ユーザーの参考説明を実装方針へ落とす案

以下は未取得ページを観察した結果ではなく、依頼文で示された各サイトの特徴と、上記 Broadcast の確認済み機能をもとにした設計提案。

1. **写真を大きく、購入情報は迷わず。** 最初の画面は既存のネイティブ商品ギャラリーと購入フォームを残す。デスクトップは写真を広めに配し、モバイルは写真から商品名・価格・選択肢へ自然に進む。購入機能と SEO 出力を保持する。
2. **一着を章で読む。** 「作った理由 → 素材 → 細部 → 暮らし → サイズ・手入れ」の順。見出しと説明はサーバー出力し、未設定の章は公開画面から自然に省く。商品の独立した情報を扱い、4 着すべてに同じ文章を誤って共有しない。
3. **操作は理解のために使う。** 襟・袖・縫い目など実際に撮影済みの細部は、押せる部位ボタンで写真と説明を同時に切り替える。静止画の代替・キーボード操作・選択中表示を用意する。根拠のない 3D 分解や、実物と違う衣服を生成して補わない。
4. **動きには理由を持たせる。** 写真の穏やかな reveal、スクロール中の固定写真、短い実写動画で生地の動きを示す。本文を読めない速度や複数の自動演出を避け、動きを減らす設定と動画未設定時に静止画へ戻る構造を用意する。
5. **購入前の疑問を解消する。** サイズ実寸、モデル身長と着用サイズ、素材混率、洗濯方法は確認済みの値だけ表示する。モデルや検証結果を捏造しない。各商品の仕様を読み終えた位置から、選択中のバリエーションを保った既存購入フォームへ戻れるようにする。
6. **ホームに元テーマの幅を戻す。** Broadcast の写真、split layout、文中画像、動画、ギャラリーなどの選択肢は保持する。そのうえでホームでは各商品への導入を変化のある構成で見せ、詳細は商品ページへつなぐ。素材不足の空枠や demo の商品名・機能説明はそのまま公開しない。

## 必要な追加撮影・商品情報

- 各一着の正面・横・背面の着用全身：シルエットと丈が分かり、背景・光・撮影距離が揃う写真。
- 生地の接写：織り／編み・表面の光沢が分かる斜光。拡大できる解像度。
- 実物の襟・袖口・留め具・縫い目・ウエストなど、商品の仕様に該当する部位の接写。
- 座って読書する、立って朝の支度をするなどの実着用写真：シルエットと服の動きが分かる構図。
- 使用可能なら 5〜10 秒程度の生地や動作の短い実写動画。無音でも意味が伝わるもの。
- 混率、原産国、実寸、モデル身長／着用サイズ、お手入れ表示の確定資料。

既存の写真や商品データから確認できる項目を優先する。写真・商品事実が未提供でも、後から商品別に設定できるコードの実装とローカル検証は進められる。
