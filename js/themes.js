var getObjectByValue = function (array, key, value) {
    return array.filter(function (object) {
        return object[key] === value;
    });
};

function appendThemesLink(data, key, linkDesc, hrefAddr, parentId) {
    // retrieve data from json
    var themes = getObjectByValue(data.themes, "name", key)[0];
    const tempChartLink = hrefAddr.replace(/{stockCodes}/i, themes.holdings.join());

    // create link element
    var linkElement = document.createElement('a');
    linkElement.href = tempChartLink;
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
            appendThemesLink(data, key, linkDesc, hrefAddr, parentId);
        })
        .catch((error) => {
            console.error("Unable to fetch data:", error);
        });
}

function fetchStockCodesSortBy() {
    const sortBylink = "https://stockcharts.com/def/servlet/SC.uscan?cgo=AAPL,AXP,AMGN,AMZN,BA,CAT,CRM,CSCO,CVX,DOW,DIS,GS,HD,HON,IBM,INTC,JNJ,JPM,KO,MCD,MMM,MRK,MSFT,NKE,PG,TRV,UNH,V,VZ,WMT|M120&p=1&format=json&order=d";

    fetch(sortBylink,
        {
            method: "GET",
            // referrer: "https://stockcharts.com/freecharts/candleglance.html?AAPL,AXP,AMGN,AMZN,BA,CAT,CRM,CSCO,CVX,DOW,DIS,GS,HD,HON,IBM,INTC,JNJ,JPM,KO,MCD,MMM,MRK,MSFT,NKE,PG,TRV,UNH,V,VZ,WMT|B|M120|1",
            // referrerPolicy: "no-referrer",
            cache: "no-cache",
            redirect: "follow",
            integrity: "",
            keepalive: false,
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
                'Referer':'https://stockcharts.com/freecharts/candleglance.html'
            }
        }
    )
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
