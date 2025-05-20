let emojiIdx = 0;
const emojiTheme = 
   ["🚃", "🚀", "💛", "❗️", "📈", "📏", "🔂", "🐓", "📇", "🐁", "💝", "🚸", "🔮", "🕖", "🗽", 
    "🕞", "📞", "💋", "💫", "🚡", "🖨", "✏️", "🈷️", "🎱", "🙉", "🚪", "💾", "↗️", "🔣", "🚋", 
    "💷", "🕹", "🧀", "🛅", "😱", "🌟", "🌖", "📘", "🎐", "🍏", "📙", "👷", "⬆️", "🏗", "🍕", 
    "🎊", "🎀", "🕉", "🌏", "🐊", "🍪", "9️⃣", "🚝", "🎆", "🌦", "📟", "🍌", "☁️", "😩", "📂", 
    "🍋", "💟", "☕️", "🎓", "🕌", "🙎", "🆙", "🔟", "😋", "🔛", "🏍", "🔓", "👱", "👡", "c", 
    "😒", "⬛️", "🚈", "📝", "🔱", "👽", "💆", "🎒", "🔎", "⛹", "🎚", "🎦", "*⃣", "🚣", "🏓", 
    "🤐", "🎤", "🐷", "📨", "🔜", "📑", "📛", "🔕", "😉", "🚉", "↔️", "❌", "▶️", "✝", "🍘", 
    "🦁", "✍", "📴", "🍜", "💢", "🕛", "‼️", "💜", "🐡", "💕", "🍚", "📺", "🎥", "🖲", "⛔️", 
    "📜", "💽", "☸", "👇", "🚾", "↩️", "🚞", "👆", "🐗", "🚨", "👊", "🐅", "🌗", "🏘", "😴", "🎅", 
    "👲", "🌭", "🤗", "📻", "🌇", "📣", "🔻", "🌲", "🕸", "🍠", "🚤", "🙏", "🚑", "😃", "👏", "🍄", 
    "🎻", "🛥", "➿", "➰", "6️⃣", "❕", "🍫", "✂️", "🎲", "↕️", "🐸", "🏐", "😵", "🍁", "☄", "👎", "🎷", 
    "♑️", "2️⃣", "🚲", "🚐", "🌑", "📍", "🕵", "🚳", "👝", "⏭", "🔍", "🎺", "▫️", "↪️", "🛍", "🌡", "🎌", 
    "🈁", "🕚", "🍯", "👴", "🏔", "😿", "🐃", "🏷"];

const crytoCcy = {
    "BTC": "Bitcoin",
    "ETH": "Ethereum",
    "USDT": "Tether",
    "BNB": "Binance Coin",
    "SOL": "Solana",
    "XMR": "Monero",
    "TRX": "TRON",
    "LTC": "Litecoin",
    "DOGE": "Dogecoin",
    "XRP": "XRP",
    "LINK": "Chainlink",
    "BCH": "Bitcoin Cash",
    "XLM": "Stellar"
};

var currencies = Intl.supportedValuesOf("currency");
for (const key in crytoCcy) {
    currencies.push(key);
}
            
export function emoji() {
    if(emojiIdx >= emojiTheme.length) {
        emojiIdx = 0;
    }
    return emojiTheme[emojiIdx++];
}

export function isEmpty(value) {
    return (
        value === null || value === undefined || value === '' ||
        (Array.isArray(value) && value.length === 0) ||
        (!(value instanceof Date) && typeof value === 'object' && Object.keys(value).length === 0)
    );
}

export function resolveTargetPageLink(stockCode, universe, tradingViewCode) {
    var refLink = "https://www.stockfisher.com.hk/us-stock/ticker/{stockCode}";
    var refStockCode = stockCode;

    if (stockCode.includes(".HK")) {
        refLink = "https://www.stockfisher.com.hk/ticker/{stockCode}";
    } else if (isCcyPair(stockCode)) {
        refLink = "https://www.tradingview.com/chart/?symbol={stockCode}";
        refStockCode = refStockCode.replace("$","");
    } else if (stockCode.startsWith("$")) {
        refLink = "https://stockcharts.com/sc3/ui/?s={stockCode}";
    } else if (shouldTradingViewSupport(universe, stockCode)) {
        refLink = "https://www.tradingview.com/chart/?symbol={stockCode}";
        if(!isEmpty(tradingViewCode, stockCode)) {
            refStockCode = tradingViewCode;
        }
        refStockCode = refStockCode.replace("^","");
    }

    const tempRefLink = refLink
        .replace(/{stockCode}/i, refStockCode);

    console.log(tempRefLink);
    return tempRefLink;
}

function shouldTradingViewSupport(universe, stockCode) {
    if(!isEmpty(universe)) {
        if ("lrg" == universe.toLowerCase() || "sml" == universe.toLowerCase() || "mid" == universe.toLowerCase()) {
            return false;
        }
    }

    return true;
}

export function fixedDecimalPlaces(n, fixed) {
    return parseFloat(n).toFixed(fixed);
}

function isCcyPair(ccypair) {
    var res = ccypair.replace("$", "");
    var last3Char = res.substring(res.length - 3, res.length);

    if(res.length == 6) {
        var ccy1 = res.substring(0,3);
        var ccy2 = res.substring(3,6);

        if(currencies.includes(ccy1) && currencies.includes(ccy2)) {
            return true;
        }
    } else if (last3Char == "USD") {
        var prefixLength = res.length - 3;
        var ccy1 = res.substring(0, prefixLength);

        if(currencies.includes(ccy1)) {
            return true;
        }
    }
    
    return false;    
}

export function uniqueArray3(a) {
  function onlyUnique(value, index, self) { 
      return self.indexOf(value) === index;
  }
  
  // usage
  var unique = a.filter( onlyUnique ); // returns ['a', 1, 2, '1']
  
  return unique;
}