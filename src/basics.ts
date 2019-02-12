/**
 * Extract lines from a string by splitting on
 * newline characters
 * @param s string to extract lines from
 */
function lines(s: string): string[] {
  return s.split(/\n/)
}

/**
 * Extracts an array of lines from a string as an array of strings
 * @param from the starting line number (indexed at 1) of the range to return
 * @param to the ending line number (inlusive, indexed at 1) of the range to return
 * @param s the string to split into lines
 */
function linesFromToOf(from: number, to: number, s: string): string[] {
  const splitLines = lines(s)
  return splitLines.slice(from - 1, to)
}

/**
 * Creates a new string which includes the first string and second
 * string passed being concatenated together with a newline between.
 * Useful for building up strings functionally out of others.
 * @param s1 Main string to append a new line to
 * @param s2 The content of the new line to append to the main string
 */
function addLine(s1: string, s2: string): string {
  return `${s1}\n${s2}`
}

export {
  lines,
  linesFromToOf,
  addLine,
}