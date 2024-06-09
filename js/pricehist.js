/**
 * async fetch price request
 * @returns 
 */
const fetchHisticalPriceByStockCode = async (stockCodes, taIndicator) => {
    const hrefAddr = "https://api.nasdaq.com/api/quote/CRM/historical?assetclass=stocks&fromdate=2024-05-09&limit=9999&todate=2024-06-09&random=43";
    console.log(hrefAddr);

    // CORs issue
    const res = await fetch(hrefAddr);

    if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
    } else {
        const stock = await res.json();
        return JSON.parse(stock.data).tradesTable;
    }
}

