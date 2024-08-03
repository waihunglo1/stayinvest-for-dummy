/**
 * async fetch index close
 * yahoo data support only
 * https://render-ealy.onrender.com/yahoo?cgo=^IXIC,^GSPC,^DJI|S50&p=1&format=json&order=d
 */
function fetchInGrid(parentId, stockCodes, taIndicator) {
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
                    return gridjs.h('button', {
                        class: 'button-6',
                        onClick: () => gotoPage(`${row.cells[0].data}`,`${row.cells[9].data}`)
                    }, `${row.cells[0].data}`);
                }
            },
            'name',
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
            'A20R', 
            'A50R',
            'A150R', 
            'A200R',
            'universe'
        ],
        sort: true,
        resizable: true,
        server: {
            url: tempSortByLink,
            then: data => data.stocks.map(stock => [stock.symbol, stock.name, stock.extra, stock.close, stock.diff, stock.A20R, stock.A50R, stock.A150R, stock.A200R, stock.universe])
        },
        style: {
          td: {
            border: '1px solid #ccc'
          },
          table: {
            'font-size': '12px'
          },
          th: {
            'background-color': 'rgba(0, 0, 0, 0.1)',
            color: '#000',
            'border-bottom': '1px solid #ccc',
            'text-align': 'center'
          }
        } 
        }).render(document.getElementById(parentId));    
}

function gotoPage(stockCode, universe) {
    var refLink = "https://www.stockfisher.com.hk/us-stock/ticker/{stockCode}";
    if ("ETF" == universe || "etf" == universe || stockCode.startsWith("^")) {
        refLink = "https://www.tradingview.com/chart/?symbol={stockCode}";
    } else if (stockCode.startsWith("$")) {
        refLink = "https://stockcharts.com/sc3/ui/?s={stockCode}";
    }

    const tempRefLink = refLink
        .replace(/{stockCode}/i, stockCode);

    console.log(tempRefLink);
    window.open(tempRefLink, '_blank').focus();
}
