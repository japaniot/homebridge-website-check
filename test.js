#!/usr/bin/env node

const {get} = require('./lib/check')

if (process.argv.length < 3) {
  console.log('Usage: test.js url [selector] [ignoreText]')
  process.exit(1)
}

main(process.argv[2], process.argv[3], process.argv[4])

async function main(url, selector, ignoreText) {
  const text = await get(url, selector, ignoreText)
  console.log(text)
}
