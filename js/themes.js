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

function fetchJSONData(key, linkDesc, hrefAddr, parentId) {
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

    fetchStockCodesSortBy("AAPL,MSFT", "M5");

}

function fetchStockCodesSortBy(stockCodes, taIndicator) {
    const sortBylink = "https://stockcharts.com/def/servlet/SC.uscan?cgo={stockCodes}|{taIndicator}&p=1&format=json&order=d";
    const tempSortByLink = encodeURIComponent(sortBylink.replace(/{stockCodes}/i, stockCodes).replace(/{taIndicator}/i, taIndicator));
    const hrefAddr = "https://api.allorigins.win/get?url=" + tempSortByLink;
    console.log(hrefAddr);

    // CORs issue
    fetch(hrefAddr)
        .then((res) => {
            if (!res.ok) {
                throw new Error
                    (`HTTP error! Status: ${res.status}`);
            }
            return res.json();
        })
        .then((data) => {
            console.log(data.content);
            var res = data.content.stocks.flat().map(({ symbol }) => symbol);
            console.log(res);
        })
        .catch((error) => {
            console.error("Unable to fetch data:", error);
        });

}
// fetchJSONData();
