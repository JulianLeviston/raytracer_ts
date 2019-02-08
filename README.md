# raytracer_ts

A retracer in typescript using a functional style

This is an experiment in writing a raytracer using typescript, using the book https://pragprog.com/book/jbtracer/the-ray-tracer-challenge by Jamis Buck https://github.com/jamis

We write a test driven version as per the book's cucumber description of the ray tracer.

We also use this code as a framework to ponder other ways to program such things - for example, to implement simple functionality as an implementation of an abstract algebra of commands.

## Understanding the project

You will find the [src](src) directory contains the typescript source for the project

The [test](test) directory contains tests that are written in the [ava](https://github.com/avajs/ava) testing framework. Tests can be run with the invocation `npm t` and if you want to use a watched version, `npm t -- --watch` will ask `ava` to continue to wait for changes to the test code then rerun all your tests for you.

We use node to build the project, so setting up should be a matter of downloading the source and running `npm i`.