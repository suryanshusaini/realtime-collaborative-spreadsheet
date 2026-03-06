/**
 * Formula engine — no eval, no Function constructor.
 *
 * Supported syntax:
 *   =SUM(A1:A5)
 *   =AVG(A1:A5)
 *   =MIN(A1:A5)
 *   =MAX(A1:A5)
 *   =A1+B1
 *   =A1*3
 *   =42 / 7
 */

type RawCells = Record<string, string>;

export function evaluateFormula(raw: string, cells: RawCells): string {
  if (!raw.startsWith("=")) return raw;

  const expr = raw.slice(1).trim().toUpperCase();

  try {
    const rangeFnMatch = expr.match(
      /^(SUM|AVG|MIN|MAX)\(([A-Z]+)(\d+):([A-Z]+)(\d+)\)$/,
    );

    if (rangeFnMatch) {
      const [, fn, colStart, rowStartStr, colEnd, rowEndStr] = rangeFnMatch;
      const values = expandRange(
        colStart,
        Number(rowStartStr),
        colEnd,
        Number(rowEndStr),
        cells,
      );
      return applyRangeFn(fn, values);
    }

    const tokens = tokenise(expr, cells);
    if (tokens === null) return "#ERR";

    return String(calculate(tokens));
  } catch {
    return "#ERR";
  }
}

function expandRange(
  colStart: string,
  rowStart: number,
  colEnd: string,
  rowEnd: number,
  cells: RawCells,
): number[] {
  const values: number[] = [];
  const colStartIdx = colLetterToIndex(colStart);
  const colEndIdx = colLetterToIndex(colEnd);

  for (let r = rowStart; r <= rowEnd; r++) {
    for (let c = colStartIdx; c <= colEndIdx; c++) {
      const id = `${colIndexToLetter(c)}${r}`;
      const n = Number(cells[id] ?? "0");
      values.push(Number.isNaN(n) ? 0 : n);
    }
  }

  return values;
}

function applyRangeFn(fn: string, values: number[]): string {
  if (values.length === 0) return "0";

  switch (fn) {
    case "SUM":
      return String(values.reduce((a, b) => a + b, 0));
    case "AVG":
      return String(values.reduce((a, b) => a + b, 0) / values.length);
    case "MIN":
      return String(Math.min(...values));
    case "MAX":
      return String(Math.max(...values));
    default:
      return "#ERR";
  }
}

type Token = number | "+" | "-" | "*" | "/";

function tokenise(expr: string, cells: RawCells): Token[] | null {
  const withValues = expr.replace(/[A-Z]+\d+/g, (ref) => {
    const n = Number(cells[ref] ?? "0");
    return Number.isNaN(n) ? "0" : String(n);
  });

  if (!/^[\d.\s+\-*/()]+$/.test(withValues)) return null;

  const src = withValues.replace(/\s+/g, "");
  const result = parseExpr(src, 0);

  if (result === null) return null;
  if (result.pos !== src.length) return null;

  return [result.value];
}

function calculate(tokens: Token[]): number {
  return tokens[0] as number;
}

interface ParseResult {
  value: number;
  pos: number;
}

function parseExpr(src: string, pos: number): ParseResult | null {
  return parseAddSub(src, pos);
}

function parseAddSub(src: string, pos: number): ParseResult | null {
  let left = parseMulDiv(src, pos);
  if (left === null) return null;

  while (left.pos < src.length) {
    const op: string = src[left.pos];
    if (op !== "+" && op !== "-") break;

    const right = parseMulDiv(src, left.pos + 1);
    if (right === null) return null;

    left = {
      value: op === "+" ? left.value + right.value : left.value - right.value,
      pos: right.pos,
    };
  }

  return left;
}

function parseMulDiv(src: string, pos: number): ParseResult | null {
  let left = parseUnary(src, pos);
  if (left === null) return null;

  while (left.pos < src.length) {
    const op: string = src[left.pos];
    if (op !== "*" && op !== "/") break;

    const right = parseUnary(src, left.pos + 1);
    if (right === null) return null;

    const value: number =
      op === "*"
        ? left.value * right.value
        : right.value === 0
          ? NaN
          : left.value / right.value;

    left = { value, pos: right.pos };
  }

  return left;
}

function parseUnary(src: string, pos: number): ParseResult | null {
  if (src[pos] === "-") {
    const inner = parsePrimary(src, pos + 1);
    if (inner === null) return null;
    return { value: -inner.value, pos: inner.pos };
  }

  return parsePrimary(src, pos);
}

function parsePrimary(src: string, pos: number): ParseResult | null {
  if (pos >= src.length) return null;

  if (src[pos] === "(") {
    const inner = parseExpr(src, pos + 1);
    if (inner === null) return null;
    if (src[inner.pos] !== ")") return null;
    return { value: inner.value, pos: inner.pos + 1 };
  }

  const match = src.slice(pos).match(/^(\d+\.?\d*)/);
  if (match) {
    return { value: Number(match[1]), pos: pos + match[1].length };
  }

  return null;
}

export function colLetterToIndex(col: string): number {
  let idx = 0;
  for (let i = 0; i < col.length; i++) {
    idx = idx * 26 + col.charCodeAt(i) - 64;
  }
  return idx;
}

export function colIndexToLetter(idx: number): string {
  let letter = "";
  while (idx > 0) {
    const rem = (idx - 1) % 26;
    letter = String.fromCharCode(65 + rem) + letter;
    idx = Math.floor((idx - 1) / 26);
  }
  return letter;
}

export function colToLetter(col: number): string {
  return colIndexToLetter(col + 1);
}

export function cellId(col: number, row: number): string {
  return `${colToLetter(col)}${row + 1}`;
}
