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

const CRYPTOCCYS = await fetch("data/crypto-list.json")
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error ${response.status}`);
        }
        return response.json();
    })
    .catch(error => {
        return [];
    });
        
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
    } else if (tradingViewSupport(universe, stockCode)) {
        refLink = "https://www.tradingview.com/chart/?symbol={stockCode}";
        if(!isEmpty(tradingViewCode, stockCode)) {
            refStockCode = tradingViewCode;
        }
        refStockCode = refStockCode.replace("^","");
    } else if (isCcyPair(stockCode)) {
        refLink = "https://www.tradingview.com/chart/?symbol={stockCode}";
        refStockCode = refStockCode.replace("$","");
    } else if (stockCode.startsWith("$")) {
        refLink = "https://stockcharts.com/sc3/ui/?s={stockCode}";
    }

    const tempRefLink = refLink
        .replace(/{stockCode}/i, refStockCode);

    console.log(tempRefLink);
    return tempRefLink;
}

function tradingViewSupport(universe, stockCode) {
    if(!isEmpty(universe)) {
        if ("etf" == universe.toLowerCase() || "index" == universe.toLowerCase() || stockCode.startsWith("^")) {
            return true;
        }
    }

    return false;
}

export function fixedDecimalPlaces(n, fixed) {
    return parseFloat(n).toFixed(fixed);
}

function isCcyPair(ccypair) {
    var res = ccypair.replace("$", "");
    if(res.length == 6) {
        var ccy1 = res.substring(0,3);
        var ccy2 = res.substring(3,6);

        var currencies = Intl.supportedValuesOf("currency");
        if(currencies.includes(ccy1) && currencies.includes(ccy2)) {
            return true;
        }
    }
    
    return false;    
}