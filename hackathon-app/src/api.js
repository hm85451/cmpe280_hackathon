export function getIndicatorData(from, to, country, indicator) {
    const url = `https://api.worldbank.org/v2/countries/${country}/indicators/${indicator}?date=${from}:${to}&format=json`;

    return fetch(url)
        .then((response) => response.json())
        .then((result) => {
            if (result.length < 2 || !Array.isArray(result[1])) {
                throw new Error("No data returned for indicator: " + indicator);
            }

            return result[1]
                .map((dataPoint) => ({
                    year: parseInt(dataPoint.date),
                    value: parseFloat(dataPoint.value),
                }))
                .filter((item) => !isNaN(item.value) && item.year);
        });
}

export function getGDP(country, fromYear, toYear) {
    return getIndicatorData(fromYear, toYear, country, "NY.GDP.MKTP.CD");
}

export function getFDIInflow(country, fromYear, toYear) {
    return getIndicatorData(fromYear, toYear, country, "BX.KLT.DINV.WD.GD.ZS");
}

export function getFDIOutflow(country, fromYear, toYear) {
    return getIndicatorData(fromYear, toYear, country, "BM.KLT.DINV.WD.GD.ZS");
}

export function getImports(country, fromYear, toYear) {
    return getIndicatorData(fromYear, toYear, country, "NE.IMP.GNFS.CD");
}

export function getExports(country, fromYear, toYear) {
    return getIndicatorData(fromYear, toYear, country, "NE.EXP.GNFS.CD");
}

export function getContribution(country, fromYear, toYear) {
    return getIndicatorData(fromYear, toYear, country, "NV.AGR.TOTL.ZS");
}

export function getCredit(country, fromYear, toYear) {
    return getIndicatorData(fromYear, toYear, country, "NV.AGR.TOTL.KD.ZG");
}

export function getFertilizer(country, fromYear, toYear) {
    return getIndicatorData(fromYear, toYear, country, "AG.CON.FERT.ZS");
}
export function getFertilizerProd(country, fromYear, toYear) {
    return getIndicatorData(fromYear, toYear, country, "AG.CON.FERT.PT.ZS");
}

export function getReverses(country, fromYear, toYear) {
    return getIndicatorData(fromYear, toYear, country, "FI.RES.TOTL.MO");
}

export function getGNI(country, fromYear, toYear) {
    return getIndicatorData(fromYear, toYear, country, "NY.GNP.PCAP.PP.KD");
}

export function getTotalDebt(country, fromYear, toYear) {
    return getIndicatorData(fromYear, toYear, country, "DT.TDS.DECT.GN.ZS");
}