import { resolveChartLink, emoji, resolveImageLink } from "./utils.js";
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

/**
 * sort by taIndicator and add show chart to parent element
 */
export function sortStockCodesAndShowChart(inputStockCodes, chartType, taIndicator, imageHome, progressHome) {
    if (inputStockCodes == null) {
        console.error("parameter o is null!!"); //show 1
        return;
    } else if (chartType == "HK") {
        partitionStockCodesAndSort("2800.HK," + inputStockCodes, taIndicator, progressHome, "DEFAULT", true)
            .then(function (sortedStockCodes) {
                sortedStockCodes.forEach(stockCode => {
                    var borderStyle = null;
                    if (stockCode.symbol == '2800.HK') {
                        borderStyle = "5px solid green";
                    }
                    appendImageToParent(imageHome, chartType, stockCode.symbol, null, null, taIndicator, borderStyle);
                });
            })
            .catch(function (error) {
                console.error(error);
            });
    } else if (chartType == "SC" || chartType == "SC6M") {
        partitionStockCodesAndSort("SPY," + inputStockCodes, taIndicator, progressHome, "DEFAULT", true)
            .then(function (sortedStockCodes) {
                sortedStockCodes.forEach(stockCode => {
                    var desc = stockCode.industry + "|" + stockCode.sector + "|" + stockCode.name;
                    var borderStyle = null;
                    if (stockCode.symbol == 'SPY') {
                        borderStyle = "5px solid green";
                    }
                    appendImageToParent(imageHome, chartType, stockCode.symbol, stockCode.universe, desc, taIndicator, borderStyle);
                });
            })
            .catch(function (error) {
                console.error(error);
            });
    } else {
        console.error("chart type not define");
        return;
    }
}

/**
 * Partition chunks
 */
export const partitionStockCodesAndSort = async (stockCodeStr, taIndicator, ldBarName, dataScanType, shouldSort) => {
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

/**
 * format line and append to parent by CSV file
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
 * async fetch index close
 * yahoo data support only
 * https://render-ealy.onrender.com/yahoo?cgo=^IXIC,^GSPC,^DJI|S50&p=1&format=json&order=d
 */
export function fetchInGrid(parentId, stockCodes, taIndicator) {
    if(stockCodes.includes("$")) {
        return;
    }

    var dataLink = "https://render-ealy.onrender.com/yahoo?cgo={stockCodes}|{taIndicator}&p=1&format=json&order=d";
    const tempSortByLink = dataLink
        .replace(/{stockCodes}/i, stockCodes)
        .replace(/{taIndicator}/i, taIndicator);

    new gridjs.Grid({
        columns: [
            {
                name: 'symbol',
                formatter: (cell, row) => {
                    const symbol = row.cells[0].data;
                    const universe = row.cells[6].data;

                    return gridjs.h('button', {
                        class: 'button-6',
                        onClick: () => gotoPage(`${symbol}`,`${universe}`)
                    }, `${symbol}`);
                }
            },
            {
                name: 'name',
                width: "350px",
                formatter: (cell, row) => {
                    const symbol = row.cells[0].data;
                    const name = row.cells[1].data;
                    const universe = row.cells[6].data;
                    const imageLink = resolveImageLink(symbol, universe);
                    const hrefLink = resolveChartLink(symbol, universe);

                    return gridjs.h('img', {
                        referrerpolicy: "no-referrer",
                        src: imageLink,
                        href: hrefLink,
                        width: "305",
                        height: "225",
                        alt: name
                    }, `${name}`);
                }                
            },
            'sma50', 
            'close', 
            { 
                name: 'difference', 
                formatter: (cell) => {
                  return gridjs.h('b', { style: {
                    'color': cell > 0 ? 'green' : 'red'
                  }}, cell);
                }
            },
            {
                name: '20R/50R/150R/200R',
                width: "350px",                
                formatter: (cell, row) => {
                    if (cell.includes("undefined")) {
                        return "";
                    }

                    // red if either one is less than 30
                    var colorStr = "green";
                    cell.split("/").map(function(el) {
                        var f = parseFloat(el);
                        if(f <= 30) {
                            colorStr = "red";
                        }
                    });

                    return gridjs.h('b', { style: {
                        'color': colorStr
                      }}, cell);
                }                
            },
            'universe'
        ],
        sort: true,
        resizable: true,
        server: {
            url: tempSortByLink,
            then: data => data.stocks.map(stock => [stock.symbol, stock.name, stock.extra, stock.close, stock.diff, stock.A20R + " / " + stock.A50R + " / " + stock.A150R + " / " + stock.A200R, stock.universe])
        }   
    }).render(document.getElementById(parentId));    
}

/**
 * goto and opening new tab from Grid
 * @param {*} stockCode 
 * @param {*} universe 
 */
function gotoPage(stockCode, universe) {
    const hrefLink = resolveChartLink(stockCode, universe);
    console.log(hrefLink);
    window.open(hrefLink, '_blank').focus();
}

/**
 * load stock codes image as input codes list
 */
export const loadStockCodesImageWithProgressBar = (inputStockCodes, chartType, taIndicator, imageHome, ldBarName, dataScanType, shouldSort) => {
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
