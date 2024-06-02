var getObjectByValue = function (array, key, value) {
    return array.filter(function (object) {
        return object[key] === value;
    });
};

function appendThemesLink(data, key, linkDesc, hrefAddr, parent) {
    // retrieve data from json
    var themes = getObjectByValue(data.themes, "name", key)[0];
    const tempChartLink = hrefAddr.replace(/{stockCodes}/i, themes.holdings.join());

    // create link element
    var linkElement = document.createElement('a');
    linkElement.href = tempChartLink;
    linkElement.setAttribute("target", "_blank");
    linkElement.text = linkDesc;

    // append
    parent.appendChild(linkElement);
}

function fetchJSONData(key, linkDesc, hrefAddr, parent) {
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
            appendThemesLink(data, key, linkDesc, hrefAddr, parent);
        })
        .catch((error) => {
            console.error("Unable to fetch data:", error);
        });
}
// fetchJSONData();
