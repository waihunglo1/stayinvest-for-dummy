import { resolveStockChartImageLink, gotoPage } from "./chart-image-formatter.js";
import { fixedDecimalPlaces } from "./utils.js";

/**
 * async fetch index close
 * yahoo data support only
 * https://render-ealy.onrender.com/yahoo?cgo=^IXIC,^GSPC,^DJI|S50&p=1&format=json&order=d
 */
export function fetchInGrid(parentId, stockCodes, taIndicator, shouldShowMarketBreadth) {
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
                name: '2month',
                hidden: false,
                formatter: (cell, row) => {
                    const symbol = row.cells[0].data;
                    const name = row.cells[1].data;
                    const universe = row.cells[4].data;
                    const tradingViewSymbol = row.cells[5].data;
                    const chartImg = resolveStockChartImageLink(symbol, "2m", "B14");

                    return gridjs.h('img', {
                        referrerpolicy: "no-referrer",
                        src: chartImg.imageLinkAddr,
                        width: chartImg.imageWidth,
                        height: chartImg.imageHeight,
                        alt: name,
                        onClick: () => gotoPage(`${symbol}`,`${universe}`,`${tradingViewSymbol}`)
                    }, `${name}`);
                }                
            },                                
            {
                name: '6month',
                hidden: ! shouldShowMarketBreadth,              
                formatter: (cell, row) => {
                    const symbol = row.cells[0].data;
                    const name = row.cells[1].data;
                    const universe = row.cells[4].data;
                    const tradingViewSymbol = row.cells[5].data;
                    const chartImg = resolveStockChartImageLink(symbol, "6m", "B14");

                    return gridjs.h('img', {
                        referrerpolicy: "no-referrer",
                        src: chartImg.imageLinkAddr,
                        width: chartImg.imageWidth,
                        height: chartImg.imageHeight,
                        alt: name,
                        onClick: () => gotoPage(`${symbol}`,`${universe}`,`${tradingViewSymbol}`)
                    }, `${name}`);
                }   
            },            
            {
                name: 'SMA50/20/10-DF',
                // width: "250px",                
                formatter: (cell, row) => {
                    if (cell.includes("undefined")) {
                        return "";
                    }

                    var colorStr = "green";
                    cell.split("/").map(function(el) {
                        var f = parseFloat(el);
                        if(f >= 8) {
                            colorStr = "red"; // red if > 8
                        }
                    });

                    return gridjs.h('b', { style: {
                        'color': colorStr
                      }}, cell);
                },
                sort: {
                    compare: (a, b) => {
                        const splitAndParseFloat = (x) => parseFloat(x.split('/')[0]);
                        return splitAndParseFloat(a) - splitAndParseFloat(b);
                    }
                }                
            },
            {
                name: 'A20/50/150/200R',
                hidden: ! shouldShowMarketBreadth,
                // width: "250px",                
                formatter: (cell, row) => {
                    if (cell.includes("undefined")) {
                        return "";
                    }

                    var colorStr = "green";
                    cell.split("/").map(function(el) {
                        var f = parseFloat(el);
                        if(f <= 30) {
                            colorStr = "red"; // red if either one is less than 30
                        }
                    });

                    return gridjs.h('b', { style: {
                        'color': colorStr
                      }}, cell);
                },
                sort: {
                    compare: (a, b) => {
                        const splitAndParseFloat = (x) => parseFloat(x.split('/')[0]);
                        return splitAndParseFloat(a) - splitAndParseFloat(b);
                    }
                } 
            },
            { 
                name: 'universe',
                hidden: true
            },
            { 
                name: 'tradingViewSymbol',
                hidden: true
            },
            {
                name: 'extra',
                hidden: true
            },
            {
                name: 'marketBreadthSymbol',
                hidden: true
            }       
        ],
        sort: true,
        search: false,
        resizable: true,
        server: {
            url: tempSortByLink,
            then: data => data.stocks.map(
                stock => [
                    stock.symbol,                     
                    stock.name,
                    stock.sma50df + " / " + 
                    stock.sma20df + " / " + 
                    stock.sma10df, 
                    fixedDecimalPlaces(stock.A20R, 2) + " / " +
                    fixedDecimalPlaces(stock.A50R, 2) + " / " + 
                    fixedDecimalPlaces(stock.A150R,2) + " / " + 
                    fixedDecimalPlaces(stock.A200R,2),
                    stock.universe,
                    stock.traadingViewSymbol,
                    stock.extra
                ]
            )
        }   
    }).render(document.getElementById(parentId));    
}
