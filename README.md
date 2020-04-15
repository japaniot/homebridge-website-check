# homebridge-website-check

Homebridge plugin for monitoring website changes.

## Usage

```js
"accessories": [
  {
    "accessory": "WebsiteCheck",
    "name": "NintendoRingFit",
    "url": "https://store.nintendo.co.jp/category/STORELIMITEDGOODS/HAC_Q_AL3PA.html",
    "selector": ".item-cart-and-wish-button-area",
    "ignoreText": "大変混雑している",
    "interval": 300000
  }
]
```

* `url`: The URL to monitor.
* `interval`: Check interval in ms.
* `selector`: Optional, CSS selector used for filtering content.
* `ignoreText`: Optional, do nothing if the page contains the text.

## License

[CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/)
