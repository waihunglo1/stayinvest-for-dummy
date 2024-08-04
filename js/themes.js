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
    chartWidth: 350,
    chartHeight: 259,
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

/**
 * load stock codes image as input codes list
 */
const loadStockCodesImageWithProgressBar = (inputStockCodes, taIndicator, imageHome, ldBarName, dataScanType, shouldSort) => {
    partitionStockCodesAndSort(inputStockCodes, taIndicator, ldBarName, dataScanType, shouldSort)
    .then(function (sortedStockCodes) {
        sortedStockCodes.forEach(stockCode => {
            var desc = stockCode.industry + "|" + stockCode.sector + "|" + stockCode.name;
            var borderStyle = null;
            appendImageToParent(imageHome, chartType, stockCode.symbol, stockCode.universe, desc, taIndicator, borderStyle);
        });
    })
    .catch(function (error) {
        console.error(error);
    });		    
} 

/**
 * Partition chunks
 */
const partitionStockCodesAndSort = async (stockCodeStr, taIndicator, ldBarName, dataScanType, shouldSort) => {
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
    const copiedStockCodes = stockCodes.slice();

    // progressBar
    var count = 0;
    var totalSize = stockCodes.length / chunkSize;
    var progressBar = new ldBar(ldBarName);
    progressBar.set(count);
    progressBar.set(1); // start calling SC api to sort data

    // splice and request data from stockcharts
    while (stockCodes.length > 0) {
        var chunk = stockCodes.splice(0, chunkSize);

        await fetchStockCodesSortBy(chunk, taIndicator, dataScanType)
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
        if(! shouldSort) {
            var unsortStocks = [];
            copiedStockCodes.forEach((stockCode) => {
                stocks.forEach((stock) => {
                    console.log("unsort : " + stockCode + ", " + stock.symbol);
                    if(stockCode == stock.symbol) {
                        unsortStocks.push(stock);         
                    }
                });
            });

            console.log(unsortStocks);
            return unsortStocks;
        }

        if ("VOL" == taIndicator) {
            return stocks.sort((a,b) => (b.close * b.vol) - (a.close * a.vol));
        } else {
            return stocks.sort((a,b) => b.extra - a.extra);
        }
    } else {
        return stockCodeStr.split(","); // return original lists
    }
}

/**
 * async request
 * const sortBylink = "https://stockcharts.com/def/servlet/SC.uscan?cgo={stockCodes}|{taIndicator}&p=1&format=json&order=d";
 * @returns 
 */
const fetchStockCodesSortBy = async (stockCodes, taIndicator, dataScanType) => {
    const stockCodesStr = stockCodes.join(",");

    var sortBylink = "https://render-ealy.onrender.com/stockcharts/def/servlet/SC.uscan?cgo={stockCodes}|{taIndicator}&p=1&format=json&order=d";
    if(stockCodesStr.indexOf(".HK") >= 0 || "YH" === dataScanType) {
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