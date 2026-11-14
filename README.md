# Oddly Yours

A small, dependency-free concept shop for turning a written idea into a set of 1–6 matched or mismatched earring concepts.

## Run locally

Open `index.html` in a modern browser, or serve this directory with any static file server. For example:

```sh
npx serve .
```

Enter an idea, choose the number of pieces and matching style, then select **Make my set**. **Download design brief** saves the concepts and approximate dimensions as JSON. The brief is not an STL or a slicer-ready model; use it as a starting point for modeling and verify dimensions, attachment fit, support needs, resin compatibility, and curing for your own workflow.

## Test

```sh
npm test
```