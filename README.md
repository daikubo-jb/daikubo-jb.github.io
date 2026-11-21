# Daichi’s Experiment Log

技術分野を限定せず、試したこと・検証方法・結果を英語で記録する Astro の静的サイトです。ホームには短い説明、著者のGitHubリンク、AI利用の注記、検索付きの実験レポート一覧を置きます。掲載サンプルは公開済みの JEPA-ScenePick の合成動画を使った動作確認です。素材のMITライセンスは `public/media/scenepick-license.txt` に同梱しています。

## 1. Macでプレビュー

Node.js 24 LTS と npm を用意し、ZIPを解凍して、この README と同じディレクトリで実行します。

```sh
npm ci
npm run dev
```

ターミナルに表示される localhost のURLを開きます。公開時と同じ静的成果物を確認するには：

```sh
npm run build
npm run preview
```

### 原稿と素材の置き方

- 原稿：`src/content/reports/` の Markdown。既存の原稿を見本に、別名で1ファイル追加します。英語で書き、ファイル先頭に `kind: report` と指定（既定値）します。URLは `/reports/ファイル名/` です。追加したレポートのタイトル・概要・プロジェクト名・タグは自動で検索対象に入ります。検索はブラウザ内で完結し、本文の全文検索ではありません。
- 素材：`public/media/`。公開が確認できた静止画・短い MP4 だけを入れ、条件、出典、実測か説明用かを本文に記します。`public/` 内は本文で未参照でも配信対象になります。
- Qiitaと連携する記事は、Qiitaには日本語の記事、このサイトには英語の実験レポート、実験リポジトリにはコードや再現手順を置けます。未公開の原稿や個人の実写、設定ファイル、元データはサイト用リポジトリにもコピーしません。
- 動画は自動再生せず、静止画とリンクも残します。ファイルを置く前に、映り込み、音声、個人情報、ライセンスを確認します。

## 2. GitHub Pages公開（初回のみ）

1. **公開してよいファイルだけ**であることを確認します。以下のリポジトリはソースも公開されるので、最初からサイト用に分離します。
2. GitHubの `daikubo-jb` アカウントで、空の公開リポジトリ `daikubo-jb.github.io` を作ります。すでに同名リポジトリがある場合は、上書きせず公開先を確認します。
3. ZIPを解凍したこのフォルダで、`git init -b main` → 内容を確認して `git add .` → `git diff --cached --stat` で対象を確認 → コミットし、**新規リポジトリ**に `main` を push します。`node_modules/` や `dist/` はコミットしません。
4. リポジトリの **Settings → Pages → Build and deployment → Source** を **GitHub Actions** に変更します。
5. **Actions → Deploy to GitHub Pages → Run workflow** から `main` を指定して実行します。pushだけでは配信を更新しません。Actions用に個人用トークンを新規発行する必要はありません。配信ジョブだけが Pages への書き込み権限を持ちます。
6. Actionsのデプロイ結果に表示されたURLを、ログアウト状態でも開けるか確認します。トップ、レポート一覧、個別ページ、画像・動画（スマホでも）、外部リンクをチェックします。

ユーザーサイトのURLは `https://daikubo-jb.github.io/`、別名リポジトリの場合は `https://daikubo-jb.github.io/experiment-notes/` のようになります。配信設定からURLとサブパスを取得するため、リポジトリ名を変えてもソースを編集する必要はありません。サブパスをローカルで試すには（起動後は表示されたポートの `/experiment-notes/` を開きます）：

```sh
SITE_URL=https://daikubo-jb.github.io BASE_PATH=/experiment-notes npm run build
BASE_PATH=/experiment-notes npm run preview
```

初回 push のコマンド例（空の新規リポジトリを選んだ場合のみ。別名ならURLを変更）：

```sh
git init -b main
git add .
git diff --cached --stat
git diff --cached
git commit -m "Prepare experiment notes site"
git remote add origin https://github.com/daikubo-jb/daikubo-jb.github.io.git
git push -u origin main
```

## 3. 更新と復旧

1. 公開用Markdownと素材を編集 → プレビュー → `npm run build`。
2. 差分で数値・図・動画の条件・リンクと、公開対象ファイルを確認 → `main` に反映。
3. Actionsを手動実行 → 公開URLを再確認。表示を戻す場合は問題の変更を `git revert` で取り消し、その新しい `main` を再デプロイします。公開ソースに出してしまった機密情報は再デプロイだけでは消えません。
4. 依存関係やActionを更新する際は、lockfileや固定コミットを一緒に更新し、静的ビルドを再確認します。サーバー、DB、外部フォーム、アクセス解析、独自ドメインは初版には不要です。セキュリティ実験用のローカル環境はこのリポジトリや配信権限と分離します。

参考：[AstroのGitHub Pagesガイド](https://docs.astro.build/en/guides/deploy/github/) · [GitHub Pagesの公開元設定](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site) · [GitHub Pagesの利用上限](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits)
