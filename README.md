# BABF

| 日本語トークン   | BF 記号 | 意味               |
| ---------------- | ------- | ------------------ |
| `にははは！`     | `>`     | ポインタを右へ移動 |
| `にゅふふ！`     | `<`     | ポインタを左へ移動 |
| `ん、`           | `+`     | 現在セルの値を +1  |
| `キキキッ`       | `-`     | 現在セルの値を -1  |
| `イヒヒッ`       | `[`     | ループ開始         |
| `パヒャヒャッ！` | `]`     | ループ終端         |
| `にゃは～`       | `.`     | 現在セルの値を出力 |
| `くふふ～`       | `,`     | 1 文字入力         |

## 使い方

### サンプル(Hello World!を出力)

> node bin/run.js /examples/HelloWorld.nyufufu

OR

> npm start

### デバッグ系コマンド

HelloWorld.nyufufu の内容を brainfxxk 形式にして bf.txt に出力する

> node bin/run.js /examples/HelloWorld.nyufufu --dump-bf 2> bf.txt
