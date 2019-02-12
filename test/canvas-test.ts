import test from 'ava'
import {
  canvas,
  width,
  height,
  pixels,
  writePixel,
  pixelAt,
} from '../src/canvas'
import {
  Tuple,
  colour,
  isTupleEquivTo,
} from '../src/tuple'

test('Canvas creation', t => {
  let c = canvas(10, 20)
  t.is(width(c), 10, 'provides a canvas with correct width')
  t.is(height(c), 20, 'provides a canvas with correct height')
  const isBlack = (pixel: Tuple): boolean => {
    return isTupleEquivTo(pixel, colour(0, 0, 0))
  }
  t.is(pixels(c).every((isBlack)), true, 'provides a canvas with correct initial colour')
  t.is(pixels(c).length, 200, 'provides a canvas with the correct number of pixels')
})

test('Pixel writing and reading', t => {
  const c = canvas(10, 20)
  const green = colour(0, 1, 0)
  const updatedC = writePixel(c, 2, 3, green)
  t.deepEqual(pixelAt(updatedC, 2, 3), green, 'works correctly when reading a written pixel')
})