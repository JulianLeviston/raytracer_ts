import { Tuple, colour } from './tuple'

class Matrix<A> {
  /**
   * A Matrix represents a height x width dimension
   * array of arrays that can store values of a 
   * certain type.
   */
  private store: A[][]
  constructor(height: number, width: number, valueConstructor: () => A) {
    const rows = Array.from(Array(height).keys())
    const cols = Array.from(Array(width).keys())
    this.store = rows.map((row) => {
      return cols.map((col) => {
        return valueConstructor()
      })
    })
  }
  width() {
    return this.store[0].length
  }
  height() {
    return this.store.length
  }
  pixels() {
    return this.store.reduce((acc, arr) => acc.concat(arr), [])
  }
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
  return new Matrix<Tuple>(height, width, () => colour(0, 0, 0))
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

function pixels(c: Canvas): Tuple[] {
  return c.pixels()
}

export {
  Canvas,
  canvas,
  width,
  height,
  pixels,
}

