"use strict";

const TOKEN_TO_OP = new Map([
  ["にははは！", ">"], // ポインタを右へ
  ["にゅふふ！", "<"], // ポインタを左へ
  ["ん、", "+"], // 値を +1
  ["キキキッ", "-"], // 値を -1
  ["イヒヒッ", "["], // ループ開始
  ["パヒャヒャッ！", "]"], // ループ終端
  ["にゃは～", "."], // 出力
  ["くふふ～", ","], // 入力
]);

// マッチ用正規表現
const TOKENS = [...TOKEN_TO_OP.keys()].sort((a, b) => b.length - a.length);
const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const TOKEN_RE = new RegExp(TOKENS.map(escapeRegExp).join("|"), "g");

/** 言語 → BF へ変換 */
function compileToBF(src) {
  const matched = src.match(TOKEN_RE) || [];
  return matched.map((t) => TOKEN_TO_OP.get(t)).join("");
}

/** [ ] の対応表を作る */
function buildBracketMap(code) {
  const stack = [];
  const map = new Map();
  for (let i = 0; i < code.length; i++) {
    const c = code[i];
    if (c === "[") stack.push(i);
    else if (c === "]") {
      const j = stack.pop();
      if (j === undefined) throw new Error(`Unmatched ] at pc=${i}`);
      map.set(i, j);
      map.set(j, i);
    }
  }
  if (stack.length) throw new Error(`Unmatched [ at pc=${stack.pop()}`);
  return map;
}

/** 実行（入力はBuffer、出力はBuffer） */
function runBF(code, inputBuf = Buffer.alloc(0)) {
  const jump = buildBracketMap(code);
  const out = [];

  // 左右無限テープ（負のインデックスOK）
  const tape = new Map(); // key: int, val: 0..255
  let ptr = 0,
    pc = 0,
    inPos = 0;

  const get = () => (tape.has(ptr) ? tape.get(ptr) : 0);
  const set = (v) => tape.set(ptr, (v + 256) & 255);

  while (pc < code.length) {
    const op = code[pc];
    switch (op) {
      case ">":
        ptr++;
        break;
      case "<":
        ptr--;
        break;
      case "+":
        set(get() + 1);
        break;
      case "-":
        set(get() - 1);
        break;
      case ".":
        out.push(get());
        break;
      case ",":
        set(inPos < inputBuf.length ? inputBuf[inPos++] : 0);
        break;
      case "[":
        if (get() === 0) pc = jump.get(pc);
        break;
      case "]":
        if (get() !== 0) pc = jump.get(pc);
        break;
    }
    pc++;
  }
  return Buffer.from(out);
}

module.exports = { compileToBF, runBF };
