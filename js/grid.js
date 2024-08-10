import { resolveTargetPageLink } from "./utils.js";
import { resolveStockChartImageLink } from "./chart-image-formatter.js";

/**
 * async fetch index close
 * yahoo data support only
 * https://render-ealy.onrender.com/yahoo?cgo=^IXIC,^GSPC,^DJI|S50&p=1&format=json&order=d
 */
export function fetchInGrid(parentId, stockCodes, taIndicator, hideMarketBreadth) {
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
                    const imageLink = resolveStockChartImageLink(symbol, universe, "2m");

                    return gridjs.h('img', {
                        referrerpolicy: "no-referrer",
                        src: imageLink,
                        width: "305",
                        height: "225",
                        alt: name,
                        onClick: () => gotoPage(`${symbol}`,`${universe}`,`${tradingViewSymbol}`)
                    }, `${name}`);
                }                
            },
            {
                name: '6month',
                hidden: false,
                formatter: (cell, row) => {
                    const symbol = row.cells[0].data;
                    const name = row.cells[1].data;
                    const universe = row.cells[4].data;
                    const tradingViewSymbol = row.cells[5].data;
                    const imageLink = resolveStockChartImageLink(symbol, universe, "6m");

                    return gridjs.h('img', {
                        referrerpolicy: "no-referrer",
                        src: imageLink,
                        width: "360",
                        height: "305",
                        alt: name,
                        onClick: () => gotoPage(`${symbol}`,`${universe}`,`${tradingViewSymbol}`)
                    }, `${name}`);
                }   
            },            
            {
                name: 'sma50/sma20/sma10df',
                width: "250px",                
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
                }                
            },
            {
                name: '20R/50R/150R/200R',
                width: "250px",                
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
                name: 'sma50df',
                hidden: false,
                formatter: (cell) => {
                    return gridjs.h('b', { style: {
                    'color': -8 < cell && cell < 8 ? 'green' : 'red'
                    }}, cell);
                }
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
                    stock.sma50df + " / " + stock.sma20df + " / " + stock.sma10df, 
                    stock.A20R + " / " + stock.A50R + " / " + stock.A150R + " / " + stock.A200R,
                    stock.universe,
                    stock.tradingViewSymbol,
                    stock.extra
                ]
            )
        }   
    }).render(document.getElementById(parentId));    
}

/**
 * goto and opening new tab from Grid
 * @param {*} stockCode 
 * @param {*} universe 
 */
function gotoPage(stockCode, universe, tradingViewSymbol) {
    const hrefLink = resolveTargetPageLink(stockCode, universe, tradingViewSymbol);
    // console.log(hrefLink);
    window.open(hrefLink, '_blank').focus();
}