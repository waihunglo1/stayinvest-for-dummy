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
    var shouldTradingView = false;

    if (stockCode.includes(".HK")) {
        refLink = "https://www.stockfisher.com.hk/ticker/{stockCode}";
    } else if (tradingViewSupport(universe)) {
        refLink = "https://www.tradingview.com/chart/?symbol={stockCode}";
        if(!isEmpty(tradingViewCode)) {
            stockCode = tradingViewCode;
        }
        stockCode = stockCode.replace("^","");
    } else if (stockCode.startsWith("$")) {
        refLink = "https://stockcharts.com/sc3/ui/?s={stockCode}";
    }

    const tempRefLink = refLink
        .replace(/{stockCode}/i, stockCode);

    console.log(tempRefLink);
    return tempRefLink;
}

function tradingViewSupport(universe) {
    if(!isEmpty(universe)) {
        if ("etf" == universe.toLowerCase() || "index" == universe.toLowerCase() || stockCode.startsWith("^")) {
            return true;
        }
    }

    return false;
}

export function resolveStockChartImageLink(stockCode, universe, type) {
    var scImageLink = "https://stockcharts.com/c-sc/sc?r=1717221704662&amp;chart={stockCode},uu[305,a]dacayaci[pb20!b50][dg][ilB14]";

    if ("weekly" == type) {
        scImageLink = "https://stockcharts.com/c-sc/sc?r=1717221704662&chart={stockCode},uu[305,a]dacayaci[pb20!b50][dc][ilB14]";
    }
    // const scImageLink = "https://stockcharts.com/c-sc/sc?r=1723291776117&chart={stockCode},uu[305,a]dacayaci[pb20!b50][dg]";
    
    return scImageLink
        .replace(/{stockCode}/i, stockCode);    
}