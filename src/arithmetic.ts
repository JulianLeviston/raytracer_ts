// Here are a set of operations:
function add(x: number, y: number): number { return x + y }
function sub(x: number, y: number): number { return x - y }
function mul(x: number, y: number): number { return x * y }
function div(x: number, y: number): number { return x / y }

// Here is a simple "program": a simple arithmetic expression:
const prog1: number = 3 + (2 * 5) / 2
console.log(prog1)

// Here is the same "program" written using the above operation
// functions:
const prog1a: number = add(3, div(mul(2, 5), 2))
console.log(prog1a)

// Next, we want to be able to "get inside" the expression at a granular level
// so we can have more control over its "execution".
// So, we begin by building an "algebra" that can let us write expressions
// similar to the above, where the operations are +, *, / and -, and
// expressions can be either an application of an operation, or a value
type Expr = IVal | IAdd | ISub | IMul | IDiv

// but what does this *MEAN*? it means an Expression can be one of:
// - A straight up number value
// - An addition expression, which symbolises adding two other Expr values together (yes, recursive)
// - A subtraction expression, which symbolises subtracting one Expr from another (yes, recursive)
// - A multiplication expression, which symbolises multiplying one Expr to another (yes, recursive)
// - A division expression, which symbolises dividing one Expr by another (yes, recursive)
//
// and because it's recursive, this lets us build up arbitrarily complex expressions!

interface IVal { kind: "val"; value: number }
class Val implements IVal {
  kind: "val"
  constructor(v: number) {
    this.kind = "val"
    this.value = v
  }
  value: number
}

interface IBinOp { expr1: Expr ; expr2: Expr }
class BinOp implements IBinOp {
  constructor(e1: Expr, e2: Expr) {
    this.expr1 = e1
    this.expr2 = e2
  }
  expr1: Expr
  expr2: Expr
}

interface IAdd { kind: "add" }
class Add extends BinOp implements IAdd {
  kind: "add"
  constructor(e1: Expr, e2: Expr) {
    super(e1, e2)
    this.kind = "add"
  }
}

interface ISub { kind: "subtract" }
class Sub extends BinOp implements ISub {
  kind: "subtract"
  constructor(e1: Expr, e2: Expr) {
    super(e1, e2)
    this.kind = "subtract"
  }
}

interface IMul { kind: "multiply" }
class Mul extends BinOp implements IMul {
  kind: "multiply"
  constructor(e1: Expr, e2: Expr) {
    super(e1, e2)
    this.kind = "multiply"
  }
}

interface IDiv { kind: "divide" }
class Div extends BinOp implements IDiv {
  kind: "divide"
  constructor(e1: Expr, e2: Expr) {
    super(e1, e2)
    this.kind = "divide"
  }
}

// Now we build a simple result evaluator for integer expressions written
// in the above algebra:
function doEval(expr: Expr): number {
  switch (expr.kind) {
    case "val": return expr.value
    case "add": return binOpAp(add, <Add>expr)
    case "subtract": return binOpAp(sub, <Sub>expr)
    case "multiply": return binOpAp(mul, <Mul>expr)
    case "divide": return binOpAp(div, <Div>expr)
  }
}

function binOpAp(op: (n1: number, n2: number) => number, expr: IBinOp): number {
  const [result1, result2] = [expr.expr1, expr.expr2].map(doEval)
  return op(result1, result2)
}

// Then, we rewrite our program as an expression in this algebra.
// However, this is less than ideal; to use it we have to change the way
// we write our code, into what effectively amounts to s-expressions,
// which makes it more difficult to read, understand and write:
const expr = new Add(new Val(3), new Div(new Mul(new Val(2), new Val(5)), new Val(2)))
const prog2: number = doEval(expr)
console.log(prog2)

// Now... because we've separated out our expressions from our interpretation
// we can write a new kind of interpreter that documents the evaluation
// as it applies it; but not only that, it can also show intermediate results,
// and can return both as a pair:
function doDocEval(expr: Expr): [number, string] {
  switch (expr.kind) {
    case "val": return [expr.value, "the value " + String(expr.value)]
    case "add": return docBinOpAp(add, "+", <Add>expr)
    case "subtract": return docBinOpAp(sub, "-", <Sub>expr)
    case "multiply": return docBinOpAp(mul, "x", <Mul>expr)
    case "divide": return docBinOpAp(div, "/", <Div>expr)
  }
}

function docBinOpAp(op: (n1: number, n2: number) => number, opName: string, expr: IBinOp): [number, string] {
  const [[result1, doc1], [result2, doc2]] = [expr.expr1, expr.expr2].map(doDocEval)
  const result = op(result1, result2)
  return [result, "(" + doc1 + " " + opName + " " + doc2 + ") = " + String(result)]
}

// Almost finally, we rewrite our program again, but note that all we have to do
// is change the evaluation function to do this... at which point it now documents
// itself, or "shows its working", too:
const prog3: [number, string] = doDocEval(expr)
console.log(prog3)
// yields: (8,"(the value 3 + ((the value 2 x the value 5 = 10) / the value 2 = 5) = 8)")


// We'd like to note that this is (hopefully obviously) not the end of the possibilities
// for these kinds of algebra. We could relatively easily adjust it so that a tree
// of computation is built, or a "scanr"/list of accumulation lists (like [[1],[1,2],[1,2,3]], etc),
// or a list of sub-expressions that could be, say, executed in parallel,
// or built in some other way.

// Not only that, but if we also introduce a parser and effectful computation into the mix,
// it should be clear how we could use this to pretty easily build up a plan of computation,
// really nice error reporting, or say, a set of dependent requirements for phased execution
// (like asking a bunch of questions of the user all at once before beginning execution,
// and also possibly showing dry runs; or displaying a plan of what will happen before it does,
// or code that can explain what was being attempted when something went wrong).

// If multiple algebra are layered, it may also be possible to achieve a semantic chunking
// effect; that is, if some compound operation breaks, say, then we could have the error
// reporting mechanism explain a top-down path of intent down to the individual function
// or method where the error took place. This would allow much easier debugging.

