const fetch = require('node-fetch')
const cheerio = require('cheerio')
const intervalPromise = require('interval-promise')

module.exports = {monitor, get}

function monitor(url, selector, ignoreText, interval, callback) {
  let content = null
  intervalPromise(async () => {
    let text = await get(url, selector, ignoreText)
    if (text === null) {  // this get is ignored
      // If first fetch was not sucessfully, mark content as empty so we will
      // know when the website is back.
      if (content === null)
        content = ''
    } else if (text !== content) {  // text changed
      if (content !== null)  // do not report the initial fetch
        callback(text)
      content = text
    }
  }, interval)
}

async function get(url, selector, ignoreText) {
  const options = {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0 Safari/605.1.15'
    }
  }
  let text = ''
  try {
    const fullText = await (await fetch(url, options)).text()
    if (includesIgnoreText(fullText, ignoreText))
      return null
    if (selector) {
      const $ = cheerio.load(fullText, {decodeEntities: false})
      text = $(selector).html()
      if (text === null)  // null is returned when there is no matching
        text = ''
    } else {
      text = fullText
    }
  } catch {
    text = null
  }
  return text.trim()
}

function includesIgnoreText(text, ignoreText) {
  if (!ignoreText)
    return false
  if (typeof ignoreText === 'string')
    return text.includes(ignoreText)
  if (Array.isArray(ignoreText)) {
    for (const t of ignoreText) {
      if (includesIgnoreText(text, t))
        return true
    }
    return false
  }
  return false
}
