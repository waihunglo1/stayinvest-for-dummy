import { resolveTargetPageLink } from "./utils.js";

// stock chart config
const scConf2m = {
    chartWidth: 305,
    chartHeight: 225,
    period: "dg",
    techIndicatorRSI: "B14",
    techIndicatorROC: "M12"
};

const scConf6m = {
    chartWidth: 305,
    chartHeight: 225,
    period: "dc",
    techIndicatorRSI: "B14",
    techIndicatorROC: "M12"
};

const hkConf3m = {
    chartWidth: 400,
    chartHeight: 350,
    period: "7",
    techIndicatorROC: "5",
    techIndicatorRSI: "2"
};

export function createImageElement(stockCode, period, taIndicator, desc) {
    var chartImg = resolveStockChartImageLink(stockCode, period, taIndicator);
    var imageElement = document.createElement("img");
    imageElement.setAttribute("src", chartImg.imageLinkAddr);
    imageElement.setAttribute("width", chartImg.imageWidth);
    imageElement.setAttribute("height", chartImg.imageHeight);
    imageElement.setAttribute("alt", stockCode + " Chart Image");
    imageElement.setAttribute("title", stockCode + " Chart Image");
    imageElement.setAttribute("referrerpolicy","no-referrer");
    imageElement.setAttribute("alt", desc);
    imageElement.setAttribute("loading", "lazy");
    imageElement.src = chartImg.imageLinkAddr;
    imageElement.title = desc;

    return imageElement;
}

// Add test buttons
function createTestBtn(name, onClick, isContextMenu = false) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.innerHTML = name;
    if (isContextMenu) btn.oncontextmenu = onClick;
    else btn.onclick = onClick;
    return btn;
}

export function addMouseEventListenerToImage(element, stockCode, universe) {
    element.addEventListener('contextmenu', (event) => {
        event.preventDefault();
        gotoPage(stockCode, universe);
    });

    element.addEventListener('click', function(ev) {
        ev.preventDefault();
        gotoPage(stockCode, 'und');
        return false;
    }, false);    
}

export function appendImageToParent(parentId, chartType, stockCode, universe, desc, taIndicator, borderStyle) {
    var period = "2m";

    if("SC6M" == chartType) {
        period = "6m";
    }

    var imageElement = createImageElement(stockCode, period, taIndicator, desc);
    addMouseEventListenerToImage(imageElement, stockCode, universe);  

    // border style
    if (borderStyle != null) {
        imageElement.style.border = borderStyle;
    }
    
    // add the parent
    document.getElementById(parentId).appendChild(imageElement);
}

/**
 * this function is used to resolve the stock chart image link
 * @param {*} stockCode 
 * @param {*} period 
 * @param {*} taIndicator 
 * @returns 
 */
export function resolveStockChartImageLink(stockCode, period, taIndicator) {
    var stockChartLink = "https://stockcharts.com/c-sc/sc?r=1717221704662&chart={stockCode},uu[{chartWidth},a]dacayaci[pb20!b50][{period}][il{taIndicator}]";
    var chartConf = scConf2m;

    if("6m" == period) {
        chartConf = scConf6m;
    }

    // SC not support other than B14 / M12 / U
    if("M12" != taIndicator && "B14" != taIndicator && "U" != taIndicator) {
        taIndicator = "M12";
    }

    if (stockCode.includes(".HK")) {
        stockChartLink = "https://charts.aastocks.com/servlet/Charts?fontsize=12&15MinDelay=T&lang=1&titlestyle=1&vol=1&Indicator=1&indpara1=10&indpara2=20&indpara3=50&indpara4=100&indpara5=150&subChart1={taIndicator}&ref1para1=12&ref1para2=0&ref1para3=0&scheme=1&com=100&chartwidth={chartWidth}&chartheight={chartHeight}&stockid={stockCode}&period={period}&type=1&logoStyle=1&";
        chartConf = hkConf3m;
        if ("B14" == taIndicator) {
            taIndicator = hkConf3m.techIndicatorRSI;
        } else {
            taIndicator = hkConf3m.techIndicatorROC;
        }
    }

    const tempChartLink = stockChartLink
      .replace(/{chartWidth}/i, chartConf.chartWidth)
      .replace(/{chartHeight}/i, chartConf.chartHeight)
      .replace(/{stockCode}/i, stockCode)
      .replace(/{period}/i, chartConf.period)
      .replace(/{taIndicator}/i, taIndicator);

    var chartImg = new Object();
    chartImg.imageLinkAddr = tempChartLink;
    chartImg.imageWidth = chartConf.chartWidth;
    chartImg.imageHeight = chartConf.chartHeight;

    return chartImg;
}

/**
 * goto and opening new tab from Grid
 * @param {*} stockCode 
 * @param {*} universe 
 */
export function gotoPage(stockCode, universe, tradingViewSymbol) {
    const hrefLink = resolveTargetPageLink(stockCode, universe, tradingViewSymbol);
    window.open(hrefLink, Date.now()).focus();
}

export function addButton(parentId, buttonLabel, taIndicator, chartType, title, inputStockCodes, needNewTab) {
    const buttonElement = document.createElement("button");
    buttonElement.setAttribute("class","button-6");
    buttonElement.innerText = buttonLabel;
    buttonElement.onclick = function() { snapshotsForStockCodes(taIndicator, chartType, title, inputStockCodes, needNewTab); };
    document.getElementById(parentId).appendChild(buttonElement);
}

export function addHref(parentId, buttonLabel, taIndicator, chartType, title, inputStockCodes, needNewTab) {
    const hrefElement = document.createElement("a");
    hrefElement.setAttribute("class","dropdown-item");
    hrefElement.innerText = buttonLabel;
    hrefElement.setAttribute('href', 'javascript:void(0);');
    hrefElement.onclick = function() { snapshotsForStockCodes(taIndicator, chartType, title, inputStockCodes, needNewTab); };
    document.getElementById(parentId).appendChild(hrefElement);
}

function snapshotsForStockCodes(taIndicator, period, title, inputStockCodes, needNewTab) {
    const stockChartLink = "snapshots-aa.html?d={title}&t={type}&a={taIndicator}&o={stockCodes}";
    // const params = new URLSearchParams(document.location.search);

    const tempChartLink = stockChartLink
            .replace(/{title}/i, title)
            .replace(/{type}/i, period)
            .replace(/{taIndicator}/i, taIndicator)
            .replace(/{stockCodes}/i, inputStockCodes);

    console.log(tempChartLink);

    if(needNewTab) {
        window.open(tempChartLink, Date.now()).focus();
    } else {
        window.location = tempChartLink;
    }

    
}

export function addButtonTableLink(parentId, buttonLabel, taIndicator, chartType, title, inputStockCodes) {
    const buttonElement = document.createElement("button");
    buttonElement.setAttribute("class","button-6");
    buttonElement.innerText = buttonLabel;
    buttonElement.onclick = function() { gotoTablePage(taIndicator, chartType, title, inputStockCodes); };
    document.getElementById(parentId).appendChild(buttonElement);
}

function gotoTablePage(taIndicator, period, title, inputStockCodes) {
    const stockChartLink = "sma50.html?d={title}&t={type}&a={taIndicator}&o={stockCodes}";
    const params = new URLSearchParams(document.location.search);

    const tempChartLink = stockChartLink
            .replace(/{title}/i, title)
            .replace(/{type}/i, period)
            .replace(/{taIndicator}/i, taIndicator)
            .replace(/{stockCodes}/i, inputStockCodes);

    console.log(tempChartLink);
    // window.location = tempChartLink;
    window.open(tempChartLink, '_blank').focus();
}