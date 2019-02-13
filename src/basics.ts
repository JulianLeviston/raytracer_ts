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

/**
 * Reduces over the a list of functions, applying each to the target
 * and finally returning the fully transformed target. If you want it 
 * work immutably, ensure your functions each return a new value.
 * @param target initial object we'd like to transform with our functions
 * @param fns an array of functions to be applied to the target
 */
function doTo<A>(target: A, fns: ((x: A) => A)[]) {
  return fns.reduce((acc, fn) => fn(acc), target)
}

export {
  lines,
  linesFromToOf,
  addLine,
  doTo,
}