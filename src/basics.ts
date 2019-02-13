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

/**
 * Maps the array-producing mapper over each item of the items array
 * but flattening into a new array as it goes.
 * alias: flatMap
 * @param mapper function taking an A value and producing a list of B values
 * @param items array of A values
 */
function concatMap<A,B>(mapper: (x: A) => B[], items: A[]): B[] {
  return items.reduce((acc, item) => acc.concat(mapper(item)), [])
}

/**
 * Flatten an array of arrays into a single array.
 * @param arrays array of arrays we want to flatten one level
 */
function concat<A>(arrays: A[][]): A[] {
  return concatMap(<(items: A[]) => A[]>identity, arrays)
}

/**
 * Returns whatever parameter is given to it unadorned
 * Seems useless until we start to notice just how often
 * this turns up in function programming.
 * @param x the item to return
 */
function identity<A>(x: A): A {
  return x
}

/**
 * Builds a numeric range as an array with elements ranging
 * between the from and to numbers passed as arguments.
 * @example range(1,4) -> [1, 2, 3, 4]
 * @param from number the range should start at
 * @param to number the range should end on
 */
function range(from: number, to: number): number[] {
  const size = to - from
  const arr = Array.from(Array(size).keys())
  return arr.map((_item, index) => from + index)
}

export {
  identity,
  lines,
  linesFromToOf,
  addLine,
  doTo,
  concat,
  concatMap,
  range,
}