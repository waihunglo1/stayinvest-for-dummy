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
            
            fetchStockCodesSortBy(stockCodes, "M5");
            appendThemesLinkToParent(parentId, tempChartLink, linkDesc);
        })
        .catch((error) => {
            console.error("Unable to fetch data:", error);
        });
}

function fetchStockCodesSortBy(stockCodes, taIndicator) {
    const sortBylink = "https://cors-anywhere.herokuapp.com/https://stockcharts.com/def/servlet/SC.uscan?cgo={stockCodes}|{taIndicator}&p=1&format=json&order=d";
    const tempSortByLink = sortBylink.replace(/{stockCodes}/i,stockCodes).replace(/{taIndicator}/i,taIndicator);


    fetch(tempSortByLink)
        .then((res) => {
            if (!res.ok) {
                throw new Error
                    (`HTTP error! Status: ${res.status}`);
            }
            return res.json();
        })
        .then((data) => {
            console.log(data);
        })
        .catch((error) => {
            console.error("Unable to fetch data:", error);
        });

}
// fetchJSONData();
