

function gotoPage(stockCode, universe) {
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
    window.open(tempRefLink, '_blank').focus();
}
