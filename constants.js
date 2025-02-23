export const searchFields = [
    "",
    "Name",
    "Full Name",
    "Race",
    "Gender",
    "Height",
    "Weight",
    `Place Of \nBirth`,
    "Alignment",
];

export const searchStrOperators = [
    "Include",
    "Exclude",
];

export const searchNumOperators = [
    "Equal",
    "Not Equal",
    "Greater Than",
    "Lesser Than",
];

export const pwrStatsAbrv = {
    intelligence: "INT",
    strength: "STR",
    speed: "SPD",
    durability: "DUR",
    power: "PWR",
    combat: "COM",
};

export const headers = [
    "",
    "Name",
    "Full Name",
    "Powerstats",
    "Race",
    "Gender",
    "Height",
    "Weight",
    `Place Of \nBirth`,
    "Alignment",
];

export const heroTable = document.createElement('table');
export const searchBarDiv = document.createElement("div");
export const searchStrOperator = document.createElement('select');
export const searchNumOperator = document.createElement('select');
export const searchField = document.createElement('select');
  
export const prevButton = document.createElement('a');
export const viewResult = document.createElement('a');
export const nextButton = document.createElement('a');
