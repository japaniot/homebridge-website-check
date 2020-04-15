const fetch = require('node-fetch')
const cheerio = require('cheerio')

module.exports = {monitor, get}

function monitor(url, selector, ignoreText, interval, callback) {
  let content = null
  return setInterval(async () => {
    let text = await get(url, selector, ignoreText)
    if (text === null) {
      // This get is ignored.
    } else if (text != content) {
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
    text = await (await fetch(url, options)).text()
    if (selector) {
      const $ = cheerio.load(text, {decodeEntities: false})
      text = $(selector).html()
      if (text === null)  // null is returned when there is no matching
        text = ''
    }
  } catch {
    text = ''
  }
  if (ignoreText && text.includes(ignoreText)) {
    text = null
  }
  return text
}
