var getObjectByValue = function (array, key, value) {
    return array.filter(function (object) {
        return object[key] === value;
    });
};

function appendThemesLinkToParent(parentId, hrefAddr, linkDesc) {

    // create link element
    var linkElement = document.createElement('a');
    linkElement.href = hrefAddr;
    linkElement.setAttribute("target", "_blank");
    linkElement.text = linkDesc;

    // append
    document.getElementById(parentId).innerText = "";
    document.getElementById(parentId).appendChild(linkElement);
}

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
 * Parition chunks
 */
const partitionStockCodes = (stockCodeStr, taIndicator) => {
    let chunkSize = 20;
    let chunks = [];
    let stocks = [];
    var stockCodes = stockCodeStr.split(",");
    
    while (stockCodes.length > 0) {
        var chunk = stockCodes.splice(0, chunkSize);
        console.log("chunk : " + chunk);

        fetchStockCodesSortBy(chunk.join(","), "M5")
            .then(function (sortedStocks) {
                sortedStocks.forEach((element) => stocks.push(sortedStocks));
            });
    }

    console.log("stock lenght : " + stocks.length);
}

/**
 * async request
 * @returns 
 */
const fetchStockCodesSortBy = async (stockCodes, taIndicator) => {
    const sortBylink = "https://stockcharts.com/def/servlet/SC.uscan?cgo={stockCodes}|{taIndicator}&p=1&format=json&order=d";
    const tempSortByLink = encodeURIComponent(sortBylink.replace(/{stockCodes}/i, stockCodes).replace(/{taIndicator}/i, taIndicator));
    const hrefAddr = "https://api.allorigins.win/get?url=" + tempSortByLink;
    console.log(hrefAddr);

    // CORs issue
    const res = await fetch(hrefAddr);

    if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
    } else {
        const data = await res.json();

        // parse data.contents and return sorted symbol
        // var sortedSymbols = JSON.parse(data.contents).stocks.flat().map(({ symbol }) => symbol);
        // return sortedSymbols.join(",");
        return JSON.parse(data.contents).stocks;
    }
}

/**
 *  Append AA / SC
 * 
 */
function appendAA(parentId, stockCode, period) {
    const chartWidth = 400;
    const chartHeight = 350;
    const stockChartLink = "https://charts.aastocks.com/servlet/Charts?fontsize=12&15MinDelay=T&lang=1&titlestyle=1&vol=1&Indicator=1&indpara1=10&indpara2=20&indpara3=50&indpara4=100&indpara5=150&subChart1=5&ref1para1=12&ref1para2=0&ref1para3=0&scheme=1&com=100&chartwidth={chartWidth}&chartheight={chartHeight}&stockid={stockCode}&period={period}&type=1&logoStyle=1&";
    const tempChartLink = stockChartLink.replace(/{chartWidth}/i, chartWidth).replace(/{chartHeight}/i, chartHeight).replace(/{stockCode}/i, stockCode).replace(/{period}/i,period);

    const refLink = "https://www.stockfisher.com.hk/ticker/{stockCode}";
    const tempRefLink = refLink.replace(/{chartWidth}/i, chartWidth).replace(/{chartHeight}/i, chartHeight).replace(/{stockCode}/i, stockCode).replace(/{period}/i,period);

    appendImageAndHrefAddr(parentId, tempChartLink, tempRefLink, chartWidth, chartHeight);
}

function appendSC(parentId, stockCode, period, taIndicator) {
    const chartWidth = 303;
    const chartHeight = 223;
    const stockChartLink = "https://stockcharts.com/c-sc/sc?r=1717221704662&chart={stockCode},uu[305,a]dacayaci[pb20!b50][dg][il{taIndicator}]";
    const tempChartLink = stockChartLink.replace(/{chartWidth}/i, chartWidth).replace(/{chartHeight}/i, chartHeight).replace(/{stockCode}/i, stockCode).replace(/{period}/i, period).replace(/{taIndicator}/i, taIndicator);

    const refLink = "https://www.stockfisher.com.hk/us-stock/ticker/{stockCode}";
    const tempRefLink = refLink.replace(/{chartWidth}/i, chartWidth).replace(/{chartHeight}/i, chartHeight).replace(/{stockCode}/i, stockCode).replace(/{period}/i, period);

    appendImageAndHrefAddr(parentId, tempChartLink, tempRefLink, chartWidth, chartHeight);
}        

function appendImageAndHrefAddr(parentId, imageLinkAddr, hrefAddr, chartWidth, chartHeight) {
    // image element
    var imageElement = new Image();
    imageElement.setAttribute("referrerpolicy","no-referrer");
    imageElement.src = imageLinkAddr;
    imageElement.width = chartWidth;
    imageElement.height = chartHeight;

    // href element
    var linkElement = document.createElement('a');
    linkElement.href = hrefAddr;
    linkElement.setAttribute("target","_blank");

    // img_home.appendChild(img);
    linkElement.appendChild(imageElement);            
    document.getElementById(parentId).appendChild(linkElement);
}
