import { zipWith } from 'lodash'

class Tuple {
  /**
   * A tuple is a set of floats
   * For our purposes, we allow accesors
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

function tuple(...args): Tuple {
  return new Tuple(...args)
}

/**
 * constructor function for creating points.
 * note that a point is simply a tuple whose w
 * component is 1
 * 
 * @param x the x (first) component of the point 
 * @param y the y (second) component of the point 
 * @param z the z (third) component of the point
 */
function point(x: number, y: number, z: number): Tuple {
  return tuple(x, y, z, 1)
}

/**
 * constructor function for creating vectors.
 * note that a point is simply a tuple whose w
 * component is 0
 * 
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
 * @param t1 first tuple to add
 * @param t2 second tuple to add
 */
function sub(t1: Tuple, t2: Tuple): Tuple {
  const op = (x: number, y: number): number => x - y
  return applyBinOp(op, t1, t2)
}

function negate(t: Tuple): Tuple {
  const negatedValues = t.values.map(v => -v)
  return tuple(...negatedValues)
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

export { tuple, point, vector, isPoint, isVector, add, sub, negate }
