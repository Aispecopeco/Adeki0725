# Shopifyの配色警告と設定ファイルの復元

2026年10月5日にユーザーから受領した、警告が出るShopifyテーマのエクスポートをGitHubの最新版と比較しました。

## 確認できた差分

| 対象 | 結果 |
| --- | --- |
| Shopify側のエクスポート | 428ファイル |
| GitHubのテーマソース | 429ファイル |
| 唯一の欠落 | `config/settings_data.json` |
| 共通428ファイルの差分 | 0件、すべてバイト単位で一致 |
| `config/settings_schema.json` | GitHub最新版と一致、配色の項目定義あり |
| 納品テーマZIP | 429ファイル、欠落した設定ファイルを含む完全版 |

比較したソースコミットは `2d83fec763e63778ec11ee61ca3212a4971cd689` です。エクスポート名は `theme_export__eeai0r-vh-myshopify-com-adeki0725-ta-vie-shopify-20261005__05OCT2026-1026am.zip` です。

`settings_schema.json` は設定項目を定義し、`settings_data.json` は現在の設定値と配色の実データを持ちます。実データのファイルがエクスポートにないことが、今回の警告の有力な原因です。GitHubにはファイルが存在するので、配色IDやフォントをさらに変更する根拠はありません。

このZIPだけでは、Shopifyでの不在・書き出し時の欠落・取込時の拒否のどれかまでは確定できません。Shopifyコードエディターへは直接接続していません。

## 現在の連携テーマで復元する

1. 「オンラインストア → テーマ」で**警告が出ているテーマ**の「… → コードを編集」を開きます。
2. `config/settings_data.json` があるか確認します。存在して内容が異なる場合は、その内容を比較してから対応し、未確認の保存設定を上書きしません。
3. 欠落していれば、`config` 内に `settings_data.json` を作成し、[復元用ファイルの全文](https://github.com/Aispecopeco/Adeki0725/blob/2d83fec763e63778ec11ee61ca3212a4971cd689/config/settings_data.json)を貼り付けて保存します。GitHubのファイル画面の「Copy raw file」でJSON全文をコピーできます。Markdownの囲み記号や説明文は含めません。
4. テーマ編集画面を開き直し、「テーマ設定 → 色」の配色一覧と警告を確認します。

復元用ファイルには `current.color_schemes` の13配色、元の保存設定と5プリセット、ホームの文字設定4項目が含まれます。保存時にエラーが出た場合はその文言を調べます。原因が未確認のまま設定値を削除したり、形式を再変更したりしません。

コードエディターから保存された後に、同じブランチの `config/settings_data.json` にShopify側の更新が反映されたかも確認します。GitHubに存在することだけではShopify側の保存成功を証明できません。

## 単体復元ができない場合

[完全版のテーマZIPをダウンロード](https://github.com/Aispecopeco/Adeki0725/raw/refs/heads/ta-vie-delivery-20261005/delivery/TA-VIE-Broadcast-8.1.1-edited.zip)し、「オンラインストア → テーマ → テーマを追加 → ZIPファイルをアップロード」から**新しい未公開テーマ**として取り込みます。公開はせず、同じ配色一覧と警告を確認します。

このZIPの429ファイルは、今回のShopifyエクスポート428ファイルに、GitHubの `config/settings_data.json` を加えた内容とバイト単位で一致しています。別のデザインや設定へ作り直したものではありません。

- 新しい未公開テーマでは正常：既存テーマの保存状態とGitHub同期経路を調べます。
- 新しい未公開テーマでも警告：取り込み後の両設定ファイルと、取込・保存時のエラーを調べます。

ZIPのSHA-256は `5204ebbfeac5dd65bac816a5fb98591b5aba1309881b78c634facbaded49353d` です。Shopifyへの書き戻し、テーマの公開、復元後の警告消失は未実施・未確認です。
