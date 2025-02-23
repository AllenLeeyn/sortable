let sortCriteria = 'Name';
let isAscd = true;

export function sortTable(
    heroes,
    reqCriteria,
){
    if (sortCriteria === reqCriteria){
        isAscd = !isAscd;
    } else {
        sortCriteria = reqCriteria;
        isAscd = true;
    };
    const reqOrder = (isAscd) ? 1 : -1;

    let sortFunc = sortName;
    if (sortCriteria === 'Full Name') sortFunc = sortFullName;
    if (sortCriteria === 'Powerstats') sortFunc = sortPowerStats;
    if (sortCriteria === 'Race') sortFunc = sortRace;
    if (sortCriteria === 'Gender') sortFunc = sortGender;
    if (sortCriteria === 'Height') sortFunc = sortHeight;
    if (sortCriteria === 'Weight') sortFunc = sortWeight;
    if (sortCriteria === 'Place Of \nBirth') sortFunc = sortPOB;
    if (sortCriteria === 'Alignment') sortFunc = sortAlignment;

    heroes.sort((a, b) =>sortFunc(a,b,reqOrder));
};

export function sortAB(a,b, reqOrder, invalidCase){
    if (a === invalidCase) return 1;
    if (b === invalidCase) return -1;
    if (a < b) return -reqOrder;
    if (a > b) return reqOrder;
    return 0;
};

export function sortName(a, b, reqOrder) {
    return sortAB(a.name, b.name, reqOrder, '');
};

export function sortFullName(a, b, reqOrder) {
    return sortAB(a.biography.fullName , b.biography.fullName , reqOrder, '');
};

export function sortPowerStats(a, b, reqOrder) {
    const aPowerStats = Object.values(a.powerstats).reduce((sum, value) => sum + value, 0);
    const bPowerStats = Object.values(b.powerstats).reduce((sum, value) => sum + value, 0);
    return sortAB(aPowerStats, bPowerStats, reqOrder, 'null');
};

export function sortRace(a, b, reqOrder) {
    return sortAB(a.appearance.race, b.appearance.race, reqOrder, null);
};

export function sortGender(a, b, reqOrder) {
    return sortAB(a.appearance.gender, b.appearance.gender, reqOrder, '-');
};

export function sortHeight(a, b, reqOrder) {
    return sortAB(a.appearance.height, b.appearance.height, reqOrder, 0);
};

export function sortWeight(a, b, reqOrder) {
    return sortAB(a.appearance.weight, b.appearance.weight, reqOrder, 0);
};

export function sortPOB(a, b, reqOrder) {
    let valA = a.biography.placeOfBirth || "-";
    let valB = b.biography.placeOfBirth || "_";

    valA = valA.replace(/[^a-zA-Z- ]/g, '').trim();
    valB = valB.replace(/[^a-zA-Z- ]/g, '').trim();

    return sortAB(valA, valB, reqOrder, '-');
};

export function sortAlignment(a, b, reqOrder) {
    return sortAB(a.biography.alignment, b.biography.alignment, reqOrder, '-');
};