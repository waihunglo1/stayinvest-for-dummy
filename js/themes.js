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

// stock chart config
const scConf2m = {
    chartWidth: 305,
    chartHeight: 225,
    period: "dg"
    };

const scConf6m = {
    chartWidth: 605,
    chartHeight: 447,
    period: "dc"
    };
        
function emoji() {
    if(emojiIdx >= emojiTheme.length) {
        emojiIdx = 0;
    }
    return emojiTheme[emojiIdx++];
}

var getObjectByValue = function (array, key, value) {
    return array.filter(function (object) {
        return object[key] === value;
    });
};

function isEmpty(value) {
    return (
        value === null || value === undefined || value === '' ||
        (Array.isArray(value) && value.length === 0) ||
        (!(value instanceof Date) && typeof value === 'object' && Object.keys(value).length === 0)
    );
}

function appendThemesLinkToParent(parentId, hrefAddr, linkDesc, shouldReplaceDesc) {

    const hrefAddrStr = hrefAddr.replace(/{linkDesc}/i, linkDesc);

    // create link element
    var linkElement = document.createElement('a');
    linkElement.href = hrefAddrStr;
    linkElement.setAttribute("target", "_" + linkDesc.replace(" ","_"));
    linkElement.text = linkDesc;

    // parent
    var parent = document.getElementById(parentId);

    if(shouldReplaceDesc) {
        parent.innerText = "";
        parent.appendChild(linkElement);
    } else {
        // append new Line
        const para1 = document.createElement("p");
        para1.appendChild(document.createTextNode(emoji() + " "));
        para1.appendChild(linkElement);
        para1.appendChild(document.createElement("br"));
        parent.appendChild(para1); 
    }
}

/**
 * format line and append to parent by CSV file
 * @param {a} hrefAddr 
 * @param {*} parentId 
 */
function fetchCsvThemesAndAppendLink(hrefAddr, parentId, extraDesc) {
    const csvDataFile = "data/equity-holdings.csv"

    Papa.parse(csvDataFile, {
        download: true,
        complete: results => {
            console.log("Read from CSV file");
            console.log(results);

            results.data.forEach(dataRow => {
                const rowId = dataRow.shift();
                const rowType = dataRow.shift();
                const rowCategory = dataRow.shift();
                const rowDesc = dataRow.shift();
                const tempChartLink = hrefAddr
                    .replace(/{type}/i, rowType)
                    .replace(/{stockCodes}/i, dataRow.join(","));

                if (rowCategory == extraDesc) {
                    appendThemesLinkToParent(parentId, tempChartLink, rowDesc, false);
                }
                else if (rowDesc == extraDesc) {
                    appendThemesLinkToParent(parentId, tempChartLink, extraDesc, true);
                }
            });
        }
    });

}

// deprecate
function fetchThemeDataAndAppendLink(key, linkDesc, hrefAddr, parentId) {
    const jsonDataFile = "data/equity-holdings.json"
    fetch(jsonDataFile)
        .then((res) => {
            if (!res.ok) {
                throw new Error
                    (`HTTP error! Status: ${res.status}`);
            }
            return res.json();
        })
        .then((data) => {
            console.log(data);

            // retrieve data from json data
            var themes = getObjectByValue(data.themes, "name", key)[0];
            const stockCodes = themes.holdings.join();
            const tempChartLink = hrefAddr.replace(/{stockCodes}/i, stockCodes);
            appendThemesLinkToParent(parentId, tempChartLink, linkDesc);
        })
        .catch((error) => {
            console.error("Unable to fetch data:", error);
        });
}

/**
 * Partition chunks
 */
const partitionStockCodesAndSort = async (stockCodeStr, taIndicator, ldBarName) => {
    const chunkSize = 25;
    var stocks = [];
    var stockCodes = stockCodeStr
        .split(",")
        .filter(function (el) {
            if(el != null && el !== '' && el.charCodeAt(0) < 128) {
                return true;
            } else {
                console.log("unicode detected : " + el + " " + encodeURI(el));
                return false;
            }
        });

    // progressBar
    var count = 0;
    var totalSize = stockCodes.length / chunkSize;
    var progressBar = new ldBar(ldBarName);
    progressBar.set(count);
    progressBar.set(1); // start calling SC api to sort data

    // splice and request data from stockcharts
    while (stockCodes.length > 0) {
        var chunk = stockCodes.splice(0, chunkSize);

        await fetchStockCodesSortBy(chunk, taIndicator)
            .then(function (sortedStocks) {
                sortedStocks.forEach(element => {
                    stocks.push(element);                   
                });
            });

        var progress = (++count / totalSize) * 100;
        progressBar.set(progress);
        console.log("progress : " + progress);
    }

    progressBar.set(100);
    console.log("total stock size : " + stocks.length);

    if(stocks.length > 0) {
        // sort by StockChart TA
        // let stocksSortByTA = stocks.sort((a,b) => b.extra - a.extra);
        // var sortedSymbols = stocksSortByTA.flat().map(({ symbol }) => symbol);
        return stocks.sort((a,b) => b.extra - a.extra);
    } else {
        return stockCodeStr.split(","); // return original lists
    }
}

/**
 * async request
 * const sortBylink = "https://stockcharts.com/def/servlet/SC.uscan?cgo={stockCodes}|{taIndicator}&p=1&format=json&order=d";
 * @returns 
 */
const fetchStockCodesSortBy = async (stockCodes, taIndicator) => {
    const stockCodesStr = stockCodes.join(",");

    var sortBylink = "https://render-ealy.onrender.com/stockcharts/def/servlet/SC.uscan?cgo={stockCodes}|{taIndicator}&p=1&format=json&order=d";
    if(stockCodesStr.indexOf(".HK") >= 0) {
        sortBylink = "https://render-ealy.onrender.com/yahoo?cgo={stockCodes}|{taIndicator}&p=1&format=json&order=d";
    }

    const tempSortByLink = sortBylink
        .replace(/{stockCodes}/i, stockCodesStr)
        .replace(/{taIndicator}/i, taIndicator);

    console.log(tempSortByLink);
    const res = await fetch(tempSortByLink);

    if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
    } else {
        const data = await res.json();
        return data.stocks;
    }
}

/**
 *  Append AA / SC
 * 
 */


function appendAA(parentId, stockCode, period, desc, borderStyle) {
    const chartWidth = 400;
    const chartHeight = 350;
    const stockChartLink = "https://charts.aastocks.com/servlet/Charts?fontsize=12&15MinDelay=T&lang=1&titlestyle=1&vol=1&Indicator=1&indpara1=10&indpara2=20&indpara3=50&indpara4=100&indpara5=150&subChart1=5&ref1para1=12&ref1para2=0&ref1para3=0&scheme=1&com=100&chartwidth={chartWidth}&chartheight={chartHeight}&stockid={stockCode}&period={period}&type=1&logoStyle=1&";
    const tempChartLink = stockChartLink
      .replace(/{chartWidth}/i, chartWidth)
      .replace(/{chartHeight}/i, chartHeight)
      .replace(/{stockCode}/i, stockCode)
      .replace(/{period}/i,period);

    const refLink = "https://www.stockfisher.com.hk/ticker/{stockCode}";
    const tempRefLink = refLink
      .replace(/{chartWidth}/i, chartWidth)
      .replace(/{chartHeight}/i, chartHeight)
      .replace(/{stockCode}/i, stockCode)
      .replace(/{period}/i,period);

    appendImageAndHrefAddr(parentId, tempChartLink, tempRefLink, chartWidth, chartHeight, desc, borderStyle);
}

function appendSC(parentId, stockCode, universe, scConf, taIndicator, desc, borderStyle) {
    const stockChartLink = "https://stockcharts.com/c-sc/sc?r=1717221704662&chart={stockCode},uu[{chartWidth},a]dacayaci[pb20!b50][{period}][il{taIndicator}]";

    const tempChartLink = stockChartLink
      .replace(/{chartWidth}/i, scConf.chartWidth)
      .replace(/{chartHeight}/i, scConf.chartHeight)
      .replace(/{stockCode}/i, stockCode)
      .replace(/{period}/i, scConf.period)
      .replace(/{taIndicator}/i, taIndicator);

    const refLink = "https://www.stockfisher.com.hk/us-stock/ticker/{stockCode}";

    if ("etf" == universe) {
        refLink = "https://www.tradingview.com/chart/?symbol={stockCode}";
    } else if (stockCode.startsWith("$") >= 0) {
        refLink = "https://stockcharts.com/sc3/ui/?s={stockCode}";
    }

    const tempRefLink = refLink
      .replace(/{stockCode}/i, stockCode);

    appendImageAndHrefAddr(parentId, tempChartLink, tempRefLink, scConf.chartWidth, scConf.chartHeight, desc, borderStyle);
}        

function appendImageAndHrefAddr(parentId, imageLinkAddr, hrefAddr, chartWidth, chartHeight, desc, borderStyle) {
    // image element
    var imageElement = new Image();
    imageElement.setAttribute("referrerpolicy","no-referrer");
    imageElement.src = imageLinkAddr;
    imageElement.width = chartWidth;
    imageElement.height = chartHeight;
    imageElement.setAttribute("alt", desc);
    imageElement.title = desc;

    if (borderStyle != null) {
        imageElement.style.border = borderStyle;
    }    

    // href element
    var linkElement = document.createElement('a');
    linkElement.href = hrefAddr;
    linkElement.setAttribute("target","_blank");

    // img_home.appendChild(img);
    linkElement.appendChild(imageElement);            
    document.getElementById(parentId).appendChild(linkElement);
}