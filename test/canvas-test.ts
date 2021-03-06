import test from 'ava'
import {
  Canvas,
  canvas,
  width,
  height,
  pixels,
  writePixel,
  pixelAt,
  canvasToPpm,
  canvasMap,
} from '../src/canvas'
import {
  Tuple,
  colour,
  isTupleEquivTo,
} from '../src/tuple'
import {
  linesFromToOf,
  doTo,
  always,
} from '../src/basics'

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

test('PPM Construction', t => {
  let c = canvas(5, 3)
  let ppm = canvasToPpm(c)
  const result = linesFromToOf(1, 3, ppm)
  let expected = ["P3", "5 3", "255"]
  t.deepEqual(linesFromToOf(1, 3, ppm), expected, 'builds a header correctly')
  const c1 = colour(1.5, 0, 0)
  const c2 = colour(0, 0.5, 0)
  const c3 = colour(-0.5, 0, 1)
  const pixelWrites = [
    (canv: Canvas) => writePixel(canv, 0, 0, c1),
    (canv: Canvas) => writePixel(canv, 2, 1, c2),
    (canv: Canvas) => writePixel(canv, 4, 2, c3),
  ]
  const updatedCanvas: Canvas = doTo(c, pixelWrites)
  expected = [ "255 0 0 0 0 0 0 0 0 0 0 0 0 0 0"
              , "0 0 0 0 0 0 0 128 0 0 0 0 0 0 0"
              , "0 0 0 0 0 0 0 0 0 0 0 0 0 0 255" ]
  ppm = canvasToPpm(updatedCanvas)
  t.deepEqual(linesFromToOf(4, 6, ppm), expected, 'builds the data correctly')
  c = canvas(10, 2)
  const canvasWithSingleColour = canvasMap(always(colour(1, 0.8, 0.6)), c)
  ppm = canvasToPpm(canvasWithSingleColour)
  expected = [ "255 204 153 255 204 153 255 204 153 255 204 153 255 204 153 255 204"
             , "153 255 204 153 255 204 153 255 204 153 255 204 153"
             , "255 204 153 255 204 153 255 204 153 255 204 153 255 204 153 255 204"
             , "153 255 204 153 255 204 153 255 204 153 255 204 153"
             ]
  t.deepEqual(linesFromToOf(4, 7, ppm), expected, 'splits lines longer than 70 chars correctly')
  ppm = canvasToPpm(c)
  const lastCharOfPpm = ppm[ppm.length - 1]
  t.is(lastCharOfPpm, '\n', 'always ends PPM files with a newline')
})

