import { readFileSync } from "fs";
import { tokenize, Token, TokenType } from "shaderkit";
class TokenReader {
  constructor(public tokens: Token[], public pos: number = 0) {}
  get current() {
    return this.tokens[this.pos];
  }
  get next() {
    return this.tokens[this.pos + 1];
  }

  clone() {
    return new TokenReader(this.tokens, this.pos);
  }
}
export function transpile(filePath: string) {
  const tokens = tokenize(readFileSync(filePath, "utf8"));
  const reader = new TokenReader(tokens);
  const context: {
    [key: string]: {
      type: string;
      value: string;
    };
  } = {};
}
