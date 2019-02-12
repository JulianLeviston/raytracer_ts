import {
  Tuple,
  colour,
  copy as tupleCopy,
} from './tuple'
import {
  addLine,
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
    return this.store.reduce((acc, arr) => acc.concat(arr), [])
  }
  setElem(y: number, x: number, value: A) {
    this.store[y-1][x-1] = value
  }
  getElem(y: number, x: number): A {
    return this.store[y-1][x-1]
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
  return matrix<Tuple>(values)
}

/**
 * Get the width of a Canvas
 * @param c canvas to find the width of
 */
function width(c: Canvas): number {
  return c.width()
}

/**
 * Get the height of a Canvas
 * @param c canvas to find the height of
 */
function height(c: Canvas): number {
  return c.height()
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
 * Builds a PPM file string from a passed in canvas.
 * PPM files are about the most basic image file format
 * possible, but they're also very easy to construct.
 * @param c Canvas to build a PPM string from
 */
function canvasToPpm(c: Canvas): string {
  let ppm = 'P3'
  const [w, h] = [width, height].map(f => f(c))
  ppm = addLine(ppm, `${w} ${h}`)
  ppm = addLine(ppm, '255')
  return ppm
}

export {
  Canvas,
  canvas,
  width,
  height,
  pixels,
  writePixel,
  pixelAt,
  canvasToPpm,
}

