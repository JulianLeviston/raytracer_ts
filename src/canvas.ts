import {
  Tuple,
  colour,
  copy as tupleCopy,
} from './tuple'
import {
  addLine,
  concatMap,
  concat,
  range,
} from './basics'

class Matrix<A> {
  /**
   * A Matrix represents a height x width dimension
   * array of arrays that can store values of a 
   * certain type.
   */
  private store: A[][]
  constructor(values: A[][]) {
    this.store = values
  }
  get values(): A[][] {
    return this.store
  }
  width(): number {
    return this.store[0].length
  }
  height(): number {
    return this.store.length
  }
  elems(): A[] {
    return concat(this.store)
  }
  setElem(y: number, x: number, value: A) {
    this.store[y-1][x-1] = value
  }
  getElem(y: number, x: number): A {
    return this.store[y-1][x-1]
  }
  getRow(y: number): A[] {
    return this.values[y-1]
  }
}

function matrix<A>(values: A[][]): Matrix<A> {
  return new Matrix<A>(values)
}

/**
 * A Canvas represents the 2D drawing surface
 * of the screen or file on to which we render
 * pixels of colour.
 */
type Canvas = Matrix<Tuple>

/**
 * Constructor function for creating a canvas set to a default
 * colour of black
 * @param width intended width of the canvas to be created
 * @param height intended height of the canvas to be created
 */
function canvas(width: number, height: number): Canvas {
  const rows = Array.from(Array(height).keys())
  const cols = Array.from(Array(width).keys())
  const values = rows.map((row) => {
    return cols.map((col) => {
      return colour(0, 0, 0)
    })
  })
  return matrix(values)
}

/**
 * Build a new canvas by mapping a function over every element of a given canvas
 * @param f function from Tuple to Tuple that will be applied to each element of the canvas
 * @param c the canvas to apply the function across
 */
function canvasMap(f: (a: Tuple) => Tuple, c: Canvas): Canvas {
  const newValues = c.values.map((row) => row.map(f))
  return matrix(newValues)
}

/**
 * Get the width of any Matrix (includes Canvas)
 * @param m matrix to find the width of
 */
function width(m: Matrix<any>): number {
  return m.width()
}

/**
 * Get the height of any Matrix (includes Canvas)
 * @param m matrix to find the height of
 */
function height(m: Matrix<any>): number {
  return m.height()
}

/**
 * Gets an array of the pixels contained
 * in the Canvas.
 * @param c canvas to retrieve the pixels from
 */
function pixels(c: Canvas): Tuple[] {
  return c.elems().map(tupleCopy)
}

/**
 * Pulls out a copy of the pixel at the given x y co-ordinates
 * @param c Canvas that we want to read a pixel from
 * @param x horizontal position (1-indexed) that we'd like to read from
 * @param y vertical position (1-indexed) that we'd like to read from
 */
function pixelAt(c: Canvas, x: number, y: number): Tuple {
  return tupleCopy(c.getElem(y+1, x+1))
}

/**
 * Makes a copy of the passed in canvas with a passed in colour
 * at the provided x y coordinates adjusted
 * @param c Canvas that we want to make an adjusted copy of
 * @param x horizontal position (1-indexed) that we'd like to write to
 * @param y veritcal position (1-indexed) that we'd like to write to
 * @param colour 
 */
function writePixel(c: Canvas, x: number, y: number, colour: Tuple): Canvas {
  const newCanvas = matrix<Tuple>(c.values)
  newCanvas.setElem(y+1, x+1, tupleCopy(colour))
  return newCanvas
}

/**
 * This is the maximum colour value
 * that pixels will be scaled to for
 * generating PPM files
 */
const maxColourValueForPpm: number = 255

/**
 * Builds a PPM file string from a passed in canvas.
 * PPM files are about the most basic image file format
 * possible, but they're also very easy to construct.
 * @param c Canvas to build a PPM string from
 */
function canvasToPpm(c: Canvas): string {
  let ppm = 'P3'
  const [w, h] = [width, height].map(f => f(c))
  ppm = addLine(ppm, `${w} ${h}`)
  ppm = addLine(ppm, String(maxColourValueForPpm))
  const dataLines = ppmDataLines(c, maxColourValueForPpm)
  ppm = dataLines.reduce(addLine, ppm)
  ppm = addLine(ppm, '\n')
  return ppm
}

/**
 * Builds the string data lines out of the pixel data
 * held in the canvas matrix, with colour values scaled
 * according to the passed in maxColourValue.
 * @param c Canvas to build out the data lines from
 * @param maxColourValue maximum colour value to scale the
 * pixels to
 */
function ppmDataLines(c: Canvas, maxColourValue: number): string[] {
  let canvasHeight = height(c)
  const buildRowStrings = buildPpmRowStringsFor(c, maxColourValue)
  const rowNumberRange = range(1, canvasHeight)
  return concatMap(buildRowStrings, rowNumberRange)
}

const maxPpmLineLength = 70

/**
 * Builds a function that takes a row number and extracts an array of
 * strings (because they may be wrapped) from the closed-over canvas
 * and maxColourValue. Useful for iterating over an array of 1-based
 * indexes as the height of a canvas to build wrapped arrays of string
 * representations for the PPM format.
 * @param c Canvas to build a row string from
 * @param maxColourValue maximum colour value to scale the pixels to
 */
function buildPpmRowStringsFor(c: Canvas, maxColourValue: number): (rowNumber: number) => string[] {
  const rowStringsBuilder = (rowNumber: number): string[] => {
    const pixels = c.getRow(rowNumber)
    const clampedPpmIntsAsStrings = concatMap(
      (pixel) => pixelToClampedPpmInts(maxColourValue, pixel).map(String),
      pixels
    )
    return splitLines(maxPpmLineLength, clampedPpmIntsAsStrings).map((words) => words.join(' '))
  }
  return rowStringsBuilder
}

/**
 * Extracts each value from the pixel's components (red, green, blue) and
 * scales them to an array of clamped integers.
 * @param maxColourValue maximum colour value number to scale the pixel colour values to
 * @param pixel a Tuple of colour: red, green, blue to transform the values of
 */
function pixelToClampedPpmInts(maxColourValue: number, pixel: Tuple): number[] {
  const clampedFloatNumsFromTuple: (n: number) => number = 
    (n: number) => clampedPpmIntFromFloat(maxColourValue, n)
  return [pixel.r, pixel.g, pixel.b].map(clampedFloatNumsFromTuple)
}

/**
 * Transforms a single number into a scaled, clamped colour value from a
 * float between 0 and 1.
 * @param maxColourValue maximum colour value number to scale an individual colour component number to
 * @param colourValue the numeric colur value to scale by the maxColourValue then clamp to obtain the transformed value
 */
function clampedPpmIntFromFloat(maxColourValue: number, colourValue: number): number {
  const maxVal = maxColourValue
  const minVal = Math.min(maxVal, colourValue * maxVal)
  const minMaxVal = Math.max(0, minVal)
  return Math.round(minMaxVal)
}

type Word = string
type Line = Word[]

/**
 * Takes a list of words and a maximum line length and extracts
 * a list of lines from it of no more than the max line length in
 * length.
 * @param maxLen maximum length of characters a line should be
 * @param words the words to split into lines
 */
function splitLines(maxLen: number, words: Word[]): Line[] {
  if (maxLen <= 0 || words.length === 0) return []
  const go = (lines: Line[], remainingWords: Word[]): Line[] => {
    const [line, wordsLeft] = parseLine(maxLen, remainingWords)
    if (wordsLeft.length === 0) return [...lines, line]
    return go([...lines, line], wordsLeft)
  }
  return go([], words)
}

/**
 * Takes a list of words and a maximum line length and extracts
 * a single line and returns it in a tuple with the remaining words.
 * @param maxLen maximum length of characters a line should be
 * @param words the words to parse a line from
 */
function parseLine(maxLen: number, words: Word[]): [Line, Word[]] {
  if (maxLen <= 0 || words.length === 0) return [[], []]
  const go = (len: number, parsedLine: Line, unparsedWords: Word[]): [Line, Word[]] => {
    if (unparsedWords.length === 0 || unparsedWords[0].length > len) return [parsedLine, unparsedWords]
    const [word, ...remainingUnparsed] = unparsedWords
    const newLen = len - (word.length + 1)
    return go(newLen, [...parsedLine, word], remainingUnparsed)
  }
  return go(maxLen, [], words)
}

export {
  Canvas,
  canvas,
  width,
  height,
  pixels,
  canvasMap,
  writePixel,
  pixelAt,
  canvasToPpm,
}

