# Spell Check

Check your progress in the New York Times [Spelling Bee] without leaving the puzzle.

## Bookmarklet Source

If you're interested in viewing the source of the bookmarklet itself, please see [init.mjs.njk](https://github.com/ashur/spellcheck/blob/main/src/bookmarklet/init.mjs.njk)

## Installation

> 💡 These are instructions for installing the source for the Spell Check website. For help installing the bookmarklet, please see [Spell Check].

### Requirements

- [Node and NPM](https://nodejs.org)

### Steps

1. Clone this repo
1. Run `npm install`

## Usage

To build HTML and CSS from source, run:

```
npm run build
```

To watch changes to the site contents and run a small local web server, run:

```
npm run serve
```

### Bookmarklet

To build the bookmarklet script independently of the site, run:

```
npm run build:js
```

---

🎈🐀 Built with [Eleventy]

[Eleventy]: https://11ty.dev
[Spell Check]: https://spellcheck.fun
[Spelling Bee]: https://www.nytimes.com/puzzles/spelling-bee
