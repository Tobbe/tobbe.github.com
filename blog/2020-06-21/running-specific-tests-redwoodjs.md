---
date: "2020-06-21"
title: "Running specific tests in RedwoodJS core"
category: "RedwoodJS"
tags: ["RedwoodJS", "Testing", "JavaScript", "Jest"]
banner: "/assets/bg/4.jpg"
---

Running the test suite for the RedwoodJS Framework is pretty straighforward. `yarn install` followed by `yarn test` is all that's needed. You will probably see some warnings about missing peer dependencies when installing, but those can safely be ignored.

Running all the tests takes a little while however, so when working on a specific feature it's somethimes helpful to be able to just run the tests for a specific package, or even just a specific test. So that's what I want to show here.

Let's say for example you want to run the tests for the `cli` package. First, go in to the cli directory; `cd packages/cli`. Then run all the tests by issuing `yarn test` (or `yarn jest`).

For more granularity you can run a single test-file by passing the path to it to jest. Here's the command and example output from running the page generator tests.

```
$ yarn test src/commands/generate/page/__tests__/page.test.js
yarn run v1.22.4
$ jest src/commands/generate/page/__tests__/page.test.js
 FAIL  src/commands/generate/page/__tests__/page.test.js (5.467s)
  √ returns exactly 2 files (4ms)
  × creates a page component (4ms)
  × creates a page test
  × creates a page component (1ms)
  × creates a page test (2ms)
  √ creates a single-word route name (1ms)
  √ creates a camelCase route name for multiple word names (1ms)
  √ creates a path equal to passed path
```

To run just one of the testcases, open up the test-file in your code editor, find the test definition and add `.only` to it. E.g. changing it from `test('creates a page test', () => {` to `test.only('creates a page test', () => {`. Run the test file again, and only the selected test case will execute. You can add `.only` to however many tests you like, and all the selected tests will run. The other tests in the file will be skipped.

Example output when selecting three testcases to run

```
$ yarn test src/commands/generate/page/__tests__/page.test.js
yarn run v1.22.4
$ jest src/commands/generate/page/__tests__/page.test.js
 PASS  src/commands/generate/page/__tests__/page.test.js (5.598s)
  √ creates a page test (3ms)
  √ creates a page test (1ms)
  √ creates a page component with a plural word for name
  ○ skipped returns exactly 2 files
  ○ skipped creates a page component
  ○ skipped creates a page component
  ○ skipped creates a single-word route name
  ○ skipped creates a camelCase route name for multiple word names
  ○ skipped creates a path equal to passed path

Test Suites: 1 passed, 1 total
Tests:       6 skipped, 3 passed, 9 total
Snapshots:   0 total
Time:        7.306s
Ran all test suites matching /src\\commands\\generate\\page\\__tests__\\page.test.js/i.
Done in 9.28s.
```