import { zipWith } from 'lodash'

class Tuple {
  /**
   * A tuple is a set of floats
   * For our purposes, we allow accessors
   * so they can act like points or colours
   * by convention, and to allow maths on them
   */
  private value: number[]
  constructor(...args) {
    this.value = args
  }
  get values(): number[] { return this.value }
  get x(): number { return this.value[0] }
  get y(): number { return this.value[1] }
  get z(): number { return this.value[2] }
  get w(): number { return this.value[3] }
}

/**
 * Constructor function for creating tuples.
 * @param args variable number of numbers to create a tuple out of
 */
function tuple(...args): Tuple {
  return new Tuple(...args)
}

/**
 * Constructor function for creating points.
 * Note that a point is simply a tuple whose w
 * component is 1
 * @param x the x (first) component of the point 
 * @param y the y (second) component of the point 
 * @param z the z (third) component of the point
 */
function point(x: number, y: number, z: number): Tuple {
  return tuple(x, y, z, 1)
}

/**
 * Constructor function for creating vectors.
 * Note that a point is simply a tuple whose w
 * component is 0
 * @param x the x (first) component of the vector 
 * @param y the y (second) component of the vector 
 * @param z the z (third) component of the vector
 */
function vector(x: number, y: number, z: number): Tuple {
  return tuple(x, y, z, 0)
}

/**
 * Test whether a tuple is a point
 * @param tuple the tuple to test
 */
function isPoint(tuple: Tuple): Boolean {
  return tuple.w == 1
}

/**
 * Test whether a tuple is a vector
 * @param tuple the tuple to test
 */
function isVector(tuple: Tuple): Boolean {
  return tuple.w == 0
}

/**
 * Create a new tuple whose components are the
 * sum of the components of two passed in tuples
 * @param t1 first tuple to add
 * @param t2 second tuple to add
 */
function add(t1: Tuple, t2: Tuple): Tuple {
  const op = (x: number, y: number): number => x + y
  return applyBinOp(op, t1, t2)
}

/**
 * Create a new tuple whose components are the
 * sum of the components of two passed in tuples
 * @param t1 tuple whose components are to be subtracted from
 * @param t2 tuple whose components are to be subtracted
 */
function sub(t1: Tuple, t2: Tuple): Tuple {
  const op = (x: number, y: number): number => x - y
  return applyBinOp(op, t1, t2)
}

/**
 * Create a new tuple whose components are the
 * negation of the components of the passed in tuple
 * @param t tuple to negate the components of
 */
function negate(t: Tuple): Tuple {
  const op = (v: number) => -v
  return mapOver(op, t)
}

/**
 * Create a new tuple whose components are the multiplication
 * of each the components of the passed in tuple by some scalar
 * @param t tuple to multiply
 * @param scalar the value to multiply each of the components of the tuple by
 */
function multiply(t: Tuple, scalar: number): Tuple {
  const op = (x: number) => x * scalar
  return mapOver(op, t)
}

/**
 * Create a new tuple whose components are the division
 * of each the components of the passed in tuple by some scalar
 * @param t tuple to divide
 * @param scalar the value to divide each of the components of the tuple by
 */
function divide(t: Tuple, scalar: number): Tuple {
  const op = (x: number) => x / scalar
  return mapOver(op, t)
}

/**
 * Compute the length of the vector described by the 
 * components of the passed in tuple
 * @param t tuple to find the magnitude of
 */
function magnitude(t: Tuple): number {
  const square = (x: number) => x ** 2
  const sumOfSquares = (xs: number[]): number => sum(xs.map(square))
  return Math.sqrt(sumOfSquares(t.values))
}

/**
 * Return the summed numbers in an array of numbers
 * @param xs an array of numbers to sum
 */
function sum(xs: number[]): number {
  return xs.reduce((a, b) => a + b, 0)
}

/**
 * Create a new tuple whose components are the
 * result of applying the `op` function to each of the
 * components of the passed in tuples, pair-wise
 * @param op binary operation (ie arity of 2) on numbers to be applied to each tuple component pair
 * @param t1 first tuple to apply `op` to
 * @param t2 second tuple to apply `op` to
 */
function applyBinOp(op: (x: number, y: number) => number, t1: Tuple, t2: Tuple): Tuple {
  const appliedTupleValues: number[] = zipWith(t1.values, t2.values, op)
  return tuple(...appliedTupleValues)
}

/**
 * Create a new tuple from the passed in tuple where each of its
 * components is the relative result of having had the passed in
 * function `op` applied
 * @param op a function of one argument
 * @param t a tuple to apply the `op` function to every component of
 */
function mapOver(op: (x: number) => number, t: Tuple): Tuple {
  const appliedValues = t.values.map(op)
  return tuple(...appliedValues)
}

const roundedEquivalencePrecision = 5

/**
 * Rounds a number to an "equivalence precision",
 * which is a power of 10 that we're comfortable
 * having our library be accurate to.
 * This is used to equate numbers and tuples in a way
 * that decides what is "good enough" to be equal, because
 * floating points are not particularly accurate.
 * @param x number to round to equivalence precision
 */
function equivRound(x: number): number {
  // The code truncates decimal values after a certain
  // negative power of 10, which is externally defined.
  // It does this by multiplying by the positive power
  // and then rounding off the decimals after 0, then
  // multiplying back by the negative power to restore
  // the correct order of magnitude.
  const prec = roundedEquivalencePrecision
  const shifted = x * Math.pow(10, prec)
  const roundedButPrecisionShifted = Math.round(shifted)
  const rounded = roundedButPrecisionShifted * Math.pow(10, -prec)
  return rounded
}

/**
 * Rounds each of the components of a tuple to the
 * accepted "equivalence precision" that we use for
 * determining numeric equivalence.
 * @param t Tuple to round the components of
 */
function equivRoundTuple(t: Tuple): Tuple {
  return mapOver(equivRound, t)
}

/**
 * Compare two numbers for rounded equivalence
 * @param x first number to compare
 * @param y second number to compare
 */
function isEquivTo(x: number, y: number): boolean {
  const diff = Math.abs(x - y)
  const epsilon = 0.00001
  return diff <= epsilon
}

/**
 * Compare two tuples for rounded equivalence
 * @param t1 first tuple to compare
 * @param t2 second tuple to compare
 */
function isTupleEquivTo(t1: Tuple, t2: Tuple): boolean {
  const appliedTupleValues: boolean[] = zipWith(t1.values, t2.values, isEquivTo)
  return appliedTupleValues.every(x => x)
}

/**
 * Creates a new tuple scaled back to unit dimensions
 * @param t Tuple to normalize
 */
function normalize(t: Tuple): Tuple {
  const tupleMagnitude = magnitude(t)
  return divide(t, tupleMagnitude)
}

/**
 * the dot product of two tuples: sums the product of
 * respective components of two tuples.
 * @param t1 first Tuple
 * @param t2 second Tuple
 */
function dot(t1: Tuple, t2: Tuple): number {
  const appliedTupleValues: number[] = zipWith(t1.values, t2.values, (x: number, y: number) => x * y)
  return sum(appliedTupleValues)
}

export {
  tuple,
  point,
  vector,
  isPoint,
  isVector,
  add,
  sub,
  negate,
  multiply,
  divide,
  magnitude,
  isEquivTo,
  isTupleEquivTo,
  equivRoundTuple,
  equivRound,
  dot,
  normalize,
 }
