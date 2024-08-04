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

export function resolveChartLink(stockCode, universe) {
    var refLink = "https://www.stockfisher.com.hk/us-stock/ticker/{stockCode}";

    if (stockCode.includes(".HK")) {
        refLink = "https://www.stockfisher.com.hk/ticker/{stockCode}";
    } else if ("ETF" == universe || "etf" == universe || stockCode.startsWith("^")) {
        refLink = "https://www.tradingview.com/chart/?symbol={stockCode}";
        stockCode = stockCode.replace("^","");
    } else if (stockCode.startsWith("$")) {
        refLink = "https://stockcharts.com/sc3/ui/?s={stockCode}";
    }

    const tempRefLink = refLink
        .replace(/{stockCode}/i, stockCode);

    console.log(tempRefLink);
    return tempRefLink;
}

/**
 * general input parameter for pages
 */
export function handleInputParameters() {
    // handler input parameter
    const params = new URLSearchParams(document.location.search);
    const inputStockCodes = params.get("o");
    const title = params.get("d");
    var taIndicator = params.get("a");
    var chartType = params.get("t");

    // stock codes
    console.log("parseLocationAndShowCharts o = " + inputStockCodes);
    console.log("parseLocationAndShowCharts t = " + taIndicator);
    console.log("parseLocationAndShowCharts a = " + chartType);
    console.log("parseLocationAndShowCharts d = " + title);

    // chart type
    if (chartType == null) {
        console.info("parameter t is null!!"); //show t
        chartType = "HK";
    }

    // taIndicator
    if (taIndicator == null) {
        console.info("taIndicator is null");
        taIndicator = "M12";
    }

    // title description
    if (title != null) {
        let title_el = document.querySelector("title");
        if (title_el) {
            title_el.innerHTML = title;
        }
    }

    return {
        inputStockCodes,
        taIndicator,
        chartType
    }
}