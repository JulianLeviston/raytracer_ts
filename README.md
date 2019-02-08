# raytracer_ts

A [ray tracer](https://en.wikipedia.org/wiki/Ray_tracing_(graphics)) in [typescript](https://www.typescriptlang.org) using a functional style

This is an experiment in writing a raytracer using typescript, using the book https://pragprog.com/book/jbtracer/the-ray-tracer-challenge by Jamis Buck https://github.com/jamis

We write a test-driven version as per the book's [cucumber](https://cucumber.io) description of the ray tracer. Note that we don't use cucumber in this project at all.

## Understanding the project

You will find the [src](src) directory contains the typescript source for the project

The [test](test) directory contains tests that are written in the [ava](https://github.com/avajs/ava) testing framework. Tests can be run with the invocation `npm t` and if you want to use a watched version, `npm t -- --watch` will ask `ava` to continue to wait for changes to the test code then rerun all your tests for you.

We use node to build the project, so setting up should be a matter of downloading the source and running `npm i`.

## Purpose

While primarily being an experiment in typescript, we also intend to use this codebase as a mental framework to ponder other ways to program; for example, to implement simple functionality as an implementation of an [algebra of expressions](https://www.schoolofhaskell.com/user/bartosz/understanding-algebras#the-essence-of-algebra), maybe as descriptions of effectful commands, and then using that to extract documentation, interactive help or even providing educationally and pragmatically useful debugging information on failure.
