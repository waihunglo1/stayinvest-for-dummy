import { emoji, isEmpty, fixedDecimalPlaces } from "./utils.js";
import { appendImageToParent } from "./chart-image-formatter.js";

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
    var sort = params.get("s");

    // stock codes
    console.log("parseLocationAndShowCharts o = " + inputStockCodes);
    console.log("parseLocationAndShowCharts t = " + taIndicator);
    console.log("parseLocationAndShowCharts a = " + chartType);
    console.log("parseLocationAndShowCharts d = " + title);
    console.log("parseLocationAndShowCharts s = " + sort)

    // chart type
    if (chartType == null) {
        console.info("parameter t is null!!"); //show t
        chartType = "HK";
    }

    // taIndicator
    if (taIndicator == null) {
        console.info("taIndicator is null");
        taIndicator = "B14";
    }

    if(sort == null) {
        console.info("sort is null");
        sort = "Y";
    }

    // title description
    if (title != null) {
        let title_el = document.querySelector("title");
        if (title_el) {
            title_el.innerHTML = title;
        }
    }

    return {
        title,
        inputStockCodes,
        taIndicator,
        chartType, 
        sort
    }
}

/**
 * sort by taIndicator and add show chart to parent element
 */
export function sortStockCodesAndShowChart(inputStockCodes, chartType, taIndicator, imageHome, progressHome, tinyPopupMenu) {
    if (inputStockCodes == null) {
        console.error("parameter o is null!!"); //show 1
        return;
    }

    var stockCodesStr = inputStockCodes;    
    if (chartType == "HK") {
        stockCodesStr = inputStockCodes + ",2800.HK"
    } else if (chartType == "SC" || chartType == "SC6M") {
        if (! inputStockCodes.split(",").includes("SPY")) {
            stockCodesStr = inputStockCodes + ",SPY";
        }
    } else {
        console.error("chart type not define");
        return;
    }

    // partition stock codes and sort by extra
    partitionStockCodesAndSort(stockCodesStr, taIndicator, progressHome, true)
        .then(function (sortedStockCodes) {
            sortedStockCodes.forEach(stockCode => {
                var potentialTurnOver = fixedDecimalPlaces(stockCode.vol * stockCode.high / 1000000, 2);
                var desc = 
                (isEmpty(stockCode.industry) ? "" : stockCode.industry + "|") + 
                (isEmpty(stockCode.sector)   ? "" : stockCode.sector   + "|") +                       
                (isEmpty(stockCode.name)     ? "" : stockCode.name     + " ") +                       
                "[SCTR:" + stockCode.sctr + " / " + potentialTurnOver + "m / " + stockCode.extra + "]";

                var borderStyle = null;
                if (stockCode.symbol == '2800.HK' || stockCode.symbol == 'SPY' || stockCode.symbol == '$SPX') {
                    borderStyle = "5px solid green";
                }
                appendImageToParent(imageHome, chartType, stockCode.symbol, stockCode.universe, desc, taIndicator, borderStyle, tinyPopupMenu);
            });
        })
        .catch(function (error) {
            console.error(error);
        });
}

/**
 * Partition chunks
 */
export const partitionStockCodesAndSort = async (stockCodeStr, taIndicator, ldBarName, shouldSort) => {
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
        } else if ("SCTR" == taIndicator) {
            return stocks.sort((a,b) => b.sctr - a.sctr);
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
 * sample https://stockcharts.com/def/servlet/SC.uscan?cgo=CTA,SLV,CEF,$CRB,DJP,GDX,LAND,XME,URA,$WTIC,XLE,MOO,COPX,SPY|B14&p=1&format=json&order=d
 * @returns 
 */
const fetchStockCodesSortBy = async (stockCodes, taIndicator) => {
    const stockCodesStr = stockCodes.join(",");
    var sortBylink = "";
    if(stockCodesStr.includes(".HK")) {
        sortBylink = "https://render-ealy.onrender.com/yahoo/taIndicator?cgo={stockCodes}|{taIndicator}&p=1&format=json&order=d";
    } else {
        sortBylink = "https://render-ealy.onrender.com/stockcharts/def/servlet/SC.uscan?cgo={stockCodes}|{taIndicator}&p=1&format=json&order=d";
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
 * fetch portfolio
 */
export const fetchPortfolios = async () => {
    const pLink = "data/portfolios.yaml";
    const res = await fetch(pLink);

    if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
    } else {
        let text = await res.text();
        var doc = jsyaml.load(text);
        return doc;
    }
}


/**
 * append link and update title
 */
export const appendLinkAndUpdateTitle = (portfolios, hrefAddr, parentId, extraDesc) => {
    portfolios.data.forEach(dataRow => {
        const rowType = dataRow.chartDataSource;
        const rowCategory = dataRow.category;
        const rowDesc = dataRow.desc;
        const sortIndicator = dataRow.shouldSort ? "Y" : "N";
        const tempChartLink = hrefAddr
            .replace(/{type}/i, rowType)
            .replace(/{stockCodes}/i, dataRow.data)
            .replace(/{sort}/i, sortIndicator);

        if (rowCategory == extraDesc) {
            appendThemesLinkToParent(parentId, tempChartLink, rowDesc, false);
        }
        else if (rowDesc == extraDesc) {
            appendThemesLinkToParent(parentId, tempChartLink, extraDesc, true);
        }
    });    
}

/**
 * format line and append to parent by CSV file
 * not use
 * @param {a} hrefAddr 
 * @param {*} parentId 
 */
export function fetchCsvThemesAndAppendLink(hrefAddr, parentId, extraDesc) {
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
 * append themes links to parent element
 * @param {*} parentId 
 * @param {*} hrefAddr 
 * @param {*} linkDesc 
 * @param {*} shouldReplaceDesc 
 */
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
 * load stock codes image as input codes list
 */
export const loadStockCodesImageWithProgressBar = (inputStockCodes, chartType, taIndicator, imageHome, ldBarName, tinyPopupMenu, shouldSort) => {
    partitionStockCodesAndSort(inputStockCodes, taIndicator, ldBarName, shouldSort)
        .then(function (sortedStockCodes) {
            sortedStockCodes.forEach(stockCode => {
                var desc = stockCode.industry + "|" + stockCode.sector + "|" + stockCode.name;
                var borderStyle = null;
                appendImageToParent(imageHome, chartType, stockCode.symbol, stockCode.universe, desc, taIndicator, borderStyle, tinyPopupMenu);
            });
        })
    .catch(function (error) {
        console.error(error);
    });		    
} 
