import test from 'ava'
import {
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
  equivRound,
  equivRoundTuple,
  dot,
  normalize,
  cross,
  colour,
  multiplyColours,
 } from '../src/tuple'

test('Tuple creation and field access of tuple 4 3 2 1', t => {
  const myTuple = tuple(4, 3, 2, 1)
  t.is(myTuple.x, 4, 'has x=4')
  t.is(myTuple.y, 3, 'has y=3')
  t.is(myTuple.z, 2, 'has z=2')
  t.is(myTuple.w, 1, 'has w=1')
})

test('Point creation', t => {
  const myTuple = tuple(4, 3, 2, 1)
  const myPoint = point(4, 3, 2)
  t.deepEqual(myTuple, myPoint, 'A tuple with w=1.0 is a point')
  t.is(myPoint.w, 1, 'A point should have w=1.0')
  const aTupleWithWOf1 = tuple(1, 2, 3, 1)
  t.is(isPoint(aTupleWithWOf1), true, 'A tuple with w=1.0 tests as a point')
  t.is(isVector(aTupleWithWOf1), false, "A tuple with w=1.0 doesn't test as a vector")
})

test('Vector creation', t => {
  t.deepEqual(tuple(4, 3, 2, 0), vector(4, 3, 2), 'A tuple with w=0 is a vector')
  t.is(vector(1, 2, 3).w, 0, 'A vector should have w=0')
  const aTupleWithWOf0 = tuple(1, 2, 3, 0)
  t.is(isVector(aTupleWithWOf0), true, 'A tuple with w=0 tests as a vector')
  t.is(isPoint(aTupleWithWOf0), false, "A tuple with w=0 doesn't test as a point")
})

test('Addition', t => {
  const a1 = tuple(3, -2, 5, 1)
  const a2 = tuple(-2, 3, 1, 0)
  const resultTuple = tuple(1, 1, 6, 1)
  t.deepEqual(add(a1, a2), resultTuple, 'Adding two tuples works correctly')
})

test('Subtraction and Negation', t => {
  const p1 = point(3, 2, 1)
  const p2 = point(5, 6, 7)
  const expected1 = vector(-2, -4, -6)
  t.deepEqual(sub(p1, p2), expected1, 'Subtracting one point from another works correctly')
  const p = point(3, 2, 1)
  const v = vector(5, 6, 7)
  const expected2 = point(-2, -4, -6)
  t.deepEqual(sub(p, v), expected2, 'Subtracting a vector from a point works correctly')
  const v1 = vector(3, 2, 1)
  const v2 = vector(5, 6, 7)
  const expected3 = vector(-2, -4, -6)
  t.deepEqual(sub(v1, v2), expected3, 'Subtracting one vector from another works correctly')
  const negTuple = tuple(1, -2, 3, -4)
  const expected4 = tuple(-1, 2, -3, 4)
  t.deepEqual(negate(negTuple), expected4, 'Negating a tuple works correctly')
})

test('Multiplication and Division', t => {
  const a = tuple(1, -2, 3, -4)
  const expected1 = tuple(3.5, -7, 10.5, -14)
  t.deepEqual(multiply(a, 3.5), expected1, 'correctly multiplies a tuple by a scalar')
  const expected2 = tuple(0.5, -1, 1.5, -2)
  t.deepEqual(multiply(a, 0.5), expected2, 'correctly multiplies a tuple by a fraction')
  const expected3 = tuple(0.5, -1, 1.5, -2)
  t.deepEqual(divide(a, 2), expected3, 'correctly divides a tuple by a scalar')
})

test('Magnitude', t => {
  let v = vector(1, 0, 0)
  t.is(magnitude(v), 1, 'computes correctly for a vector 1 0 0')
  v = vector(0, 1, 0)
  t.is(magnitude(v), 1, 'computes correctly for a vector 0 1 0')
  v = vector(0, 0, 1)
  t.is(magnitude(v), 1, 'computes correctly for a vector 0 0 1')
  v = vector(1, 2, 3)
  t.is(magnitude(v), Math.sqrt(14), 'computes correctly for a vector 1 2 3')
  v = vector(-1, -2, -3)
  t.is(magnitude(v), Math.sqrt(14), 'computes correctly for a vector -1 -2 -3')
})

test('Numeric Exactness and Equivalence', t => {
  const a = Math.sqrt(14)
  const expected = 3.7416575
  t.true(isEquivTo(a, expected), 'provides the ability to check two numbers')
  const t1 = tuple(1.7416575, 2.7416575, 3.7416575)
  const t2 = tuple(1.74165751, 2.74165751, 3.74165751)
  t.true(isTupleEquivTo(t1, t2), 'provides the ability to check two tuples')
  const x = tuple(1.74165752038343, 1.74165752038343, 1.74165752038343)
  const y = tuple(1.74165752099999, 1.74165752099999, 1.74165752099999)
  t.deepEqual(equivRoundTuple(x), equivRoundTuple(y), 'provides the ability to round tuples for equivalence')
  t.is(equivRound(1.7412342), equivRound(1.7412342999), 'provide the ability to round numbers for equivalence')
})

test('Normalization', t => {
  let v = vector(4, 0, 0)
  let expected = vector(1, 0, 0)
  t.deepEqual(normalize(v), expected, 'normalizes the vector 4 0 0 into vector 1 0 0')
  v = vector(1, 2, 3)
  expected = vector(0.26726, 0.53452, 0.80178)
  t.deepEqual(equivRoundTuple(normalize(v)), equivRoundTuple(expected), 'normalizes the vector 1 2 3 correctly')
  v = normalize(vector(1, 2, 3))
  t.is(equivRound(magnitude(v)), 1, 'gives the correct magnitude of a normalized vector')
})

test('Dot product', t => {
  const a = vector(1, 2, 3)
  const b = vector(2, 3, 4)
  t.is(dot(a, b), 20, 'works correctly for two vectors')
})

test('Cross product', t => {
  const a = vector(1, 2, 3)
  const b = vector(2, 3, 4)
  let expected = vector(-1, 2, -1)
  t.deepEqual(cross(a, b), expected, 'works correctly in one order of arguments')
  expected = vector(1, -2, 1)
  t.deepEqual(cross(b, a), expected, 'works correctly in the other order of arguments')
})

test('Colour creation with 4 3 2', t => {
  const a = colour(4, 3, 2)
  t.is(a.r, 4, 'has r=4')
  t.is(a.g, 3, 'has g=3')
  t.is(a.b, 2, 'has b=2')
})

test('Arithmetic on colours', t => {
  let c1 = colour(0.9, 0.6, 0.75)
  let c2 = colour(0.7, 0.1, 0.25)
  let expected = colour(1.6, 0.7, 1.0)
  t.deepEqual(add(c1, c2), expected, 'supports adding two colours correctly')
  expected = colour(0.2, 0.5, 0.5)
  t.deepEqual(equivRoundTuple(sub(c1, c2)), equivRoundTuple(expected), 'supports subtracting one colour from another correctly')
  let c = colour(0.2, 0.3, 0.4)
  t.deepEqual(equivRoundTuple(multiply(c, 2)), equivRoundTuple(colour(0.4, 0.6, 0.8)), 'supports multiplying a colour by a scalar correctly')
  c1 = colour(1, 0.2, 0.4)
  c2 = colour(0.9, 1, 0.1)
  t.deepEqual(equivRoundTuple(multiplyColours(c1, c2)), equivRoundTuple(colour(0.9, 0.2, 0.04)), 'Multiplies one colour by another correctly')
})
