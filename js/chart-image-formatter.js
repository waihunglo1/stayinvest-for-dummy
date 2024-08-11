import { resolveTargetPageLink } from "./utils.js";

// stock chart config
const scConf2m = {
    chartWidth: 305,
    chartHeight: 225,
    period: "dg"
    };

const scConf6m = {
    chartWidth: 350,
    chartHeight: 259,
    period: "dc"
    };
    
/**
 *  Append chart images from AA / SC
 * 
 */
function appendAA(parentId, stockCode, universe, period, taIndicator, desc, borderStyle) {
    const chartWidth = 400;
    const chartHeight = 350;
    const techIndicatorROC = 5;
    const techIndicatorRSI = 2;
    var aaTaIndicator = techIndicatorROC;

    if ("B14" == taIndicator) {
        aaTaIndicator = techIndicatorRSI;
    } else {
        aaTaIndicator = techIndicatorROC;
    }

    const stockChartLink = "https://charts.aastocks.com/servlet/Charts?fontsize=12&15MinDelay=T&lang=1&titlestyle=1&vol=1&Indicator=1&indpara1=10&indpara2=20&indpara3=50&indpara4=100&indpara5=150&subChart1={taIndicator}&ref1para1=12&ref1para2=0&ref1para3=0&scheme=1&com=100&chartwidth={chartWidth}&chartheight={chartHeight}&stockid={stockCode}&period={period}&type=1&logoStyle=1&";
    const tempChartLink = stockChartLink
      .replace(/{chartWidth}/i, chartWidth)
      .replace(/{chartHeight}/i, chartHeight)
      .replace(/{stockCode}/i, stockCode)
      .replace(/{taIndicator}/i, aaTaIndicator)
      .replace(/{period}/i,period);

    const hrefLink = resolveTargetPageLink(stockCode, universe);
    appendImageAndHrefAddr(parentId, tempChartLink, hrefLink, chartWidth, chartHeight, desc, borderStyle);
}

function appendSC(parentId, stockCode, universe, scConf, taIndicator, desc, borderStyle) {
    console.log("snapshot: " + stockCode + " universe:" + universe + " startWith:" + stockCode.startsWith("$"));

    // SC not support other than B14 / M12
    if("M12" != taIndicator && "B14" != taIndicator) {
        taIndicator = "M12";
    }

    const stockChartLink = "https://stockcharts.com/c-sc/sc?r=1717221704662&chart={stockCode},uu[{chartWidth},a]dacayaci[pb20!b50][{period}][il{taIndicator}]";
    const tempChartLink = stockChartLink
      .replace(/{chartWidth}/i, scConf.chartWidth)
      .replace(/{chartHeight}/i, scConf.chartHeight)
      .replace(/{stockCode}/i, stockCode)
      .replace(/{period}/i, scConf.period)
      .replace(/{taIndicator}/i, taIndicator);

    const hrefLink = resolveTargetPageLink(stockCode, universe);
    appendImageAndHrefAddr(parentId, tempChartLink, hrefLink, scConf.chartWidth, scConf.chartHeight, desc, borderStyle);
}        

function appendImageAndHrefAddr(parentId, imageLinkAddr, hrefAddr, chartWidth, chartHeight, desc, borderStyle) {
    // image element
    var imageElement = new Image();
    imageElement.setAttribute("referrerpolicy","no-referrer");
    imageElement.src = imageLinkAddr;
    imageElement.width = chartWidth;
    imageElement.height = chartHeight;
    imageElement.setAttribute("alt", desc);
    imageElement.title = desc;

    if (borderStyle != null) {
        imageElement.style.border = borderStyle;
    }    

    // href element
    var linkElement = document.createElement('a');
    linkElement.href = hrefAddr;
    linkElement.setAttribute("target","_blank");

    // img_home.appendChild(img);
    linkElement.appendChild(imageElement);
    
    const imageLink = resolveStockChartImageLink(symbol, universe, "2m");

    const gImgElement = gridjs.h('img', {
        referrerpolicy: "no-referrer",
        src: imageLink,
        width: "305",
        height: "225",
        alt: desc,
        onClick: () => gotoPage(`${symbol}`,`${universe}`,`${tradingViewSymbol}`)
    }, `${desc}`);

    document.getElementById(parentId).appendChild(gImgElement);
    
    // document.getElementById(parentId).appendChild(linkElement);
}


export function appendImageToParent(parentId, chartType, stockCode, universe, desc, taIndicator, borderStyle) {
    if (chartType == 'HK') {
        appendAA(parentId, stockCode, universe, 7, taIndicator, desc, borderStyle);
    }

    if (chartType == 'SC') {
        appendSC(parentId, stockCode, universe, scConf2m, taIndicator, desc, borderStyle);
    }

    if (chartType == 'SC6M') {
        appendSC(parentId, stockCode, universe, scConf6m, taIndicator, desc, borderStyle);
    }                
}

export function resolveStockChartImageLink(stockCode, universe, period) {
    var scPeriod = "g";

    if ("6m" == period) {
        scPeriod = "c";
    } 
    var scImageLink = "https://stockcharts.com/c-sc/sc?r=1717221704662&amp;chart={stockCode},uu[305,a]dacayaci[pb20!b50][d{period}][ilB14]";

    // no indicator
    // const scImageLink = "https://stockcharts.com/c-sc/sc?r=1723291776117&chart={stockCode},uu[305,a]dacayaci[pb20!b50][dg]";
    
    return scImageLink
        .replace(/{stockCode}/i, stockCode)
        .replace(/{period}/i, scPeriod);    
}