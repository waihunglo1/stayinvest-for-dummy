import { resolveTargetPageLink } from "./utils.js";

// stock chart config
const scConf2m = {
    chartWidth: 305,
    chartHeight: 225,
    period: "dg"
    };

const scConf6m = {
    chartWidth: 305,
    chartHeight: 225,
    period: "dc"
    };

const hkConf3m = {
    chartWidth: 400,
    chartHeight: 350,
    period: "7",
    techIndicatorROC: "5",
    techIndicatorRSI: "2"
};    

export function appendImageToParent(parentId, chartType, stockCode, universe, desc, taIndicator, borderStyle) {
    var period = "2m";

    if("SC6M" == chartType) {
        period = "6m";
    }

    let { imageLinkAddr, chartConf } = resolveStockChartImageLink(stockCode, period, taIndicator);

    // create image element
    var imageElement = new Image();
    imageElement.setAttribute("referrerpolicy","no-referrer");
    imageElement.setAttribute("alt", desc);
    imageElement.src = imageLinkAddr;
    imageElement.title = desc;

    imageElement.addEventListener("click", function () {
        gotoPage(stockCode, universe);
    });

    // border style
    if (borderStyle != null) {
        imageElement.style.border = borderStyle;
    }
    
    // add the parent
    document.getElementById(parentId).appendChild(imageElement);
}

export function resolveStockChartImageLink(stockCode, period, taIndicator) {
    var stockChartLink = "https://stockcharts.com/c-sc/sc?r=1717221704662&chart={stockCode},uu[{chartWidth},a]dacayaci[pb20!b50][{period}][il{taIndicator}]";
    var chartConf = scConf2m;

    if("6m" == period) {
        chartConf = scConf6m;
    }

    // SC not support other than B14 / M12
    if("M12" != taIndicator && "B14" != taIndicator) {
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

    // return tempChartLink;
    return {
        tempChartLink,
        chartConf
    }
}

/**
 * goto and opening new tab from Grid
 * @param {*} stockCode 
 * @param {*} universe 
 */
export function gotoPage(stockCode, universe, tradingViewSymbol) {
    const hrefLink = resolveTargetPageLink(stockCode, universe, tradingViewSymbol);
    window.open(hrefLink, '_blank').focus();
}