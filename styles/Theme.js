// Color values

const COLORS = {
    Black: '#000000',    
    White: '#FFFFFF',

    primary_50 : "#B1D8B7",
    //primary_500 : "#94C973",
    primary_500 : "#2F5233",
    //brand : "#C8AF91",
    brand: "#C8B640", 

    success_500 : "#0dac1d",
    success_900 : "#075F10",

    error_500 : "#e81b1b",
    error_900 : "#610b0b",

    warning_500 : "#ffc107",
    warning_900 : "#6b5103",

    text_50 : "#e6e6e6",
    text_500 : "#020202",
    text_200 : "#8b8b8b",    
};
  
const FONTSIZE = {
    size_8: 8,
    size_10: 10,
    size_12: 12,
    size_14: 14,
    size_16: 16,
    size_18: 18,
    size_20: 20,
    size_22: 22,
    size_24: 24,
    size_30: 30,
};
  
// Border radius values
const BORDERRADIUS = {
    radius_4: 4,
    radius_8: 8,
    radius_10: 10,
    radius_15: 15,
    radius_20: 20,
    radius_25: 25,
    radius_50: 50,
};


const REACTIONS = [    
    { name: 'okay', emoji: require('../assets/images/icon_okay.png') },
    { name: 'happy', emoji: require('../assets/images/icon_happy.png') },
    { name: 'heart', emoji: require('../assets/images/icon_heart.png') },    
    { name: 'angry', emoji: require('../assets/images/icon_angry.png') },
  ];

export {
    COLORS,
    REACTIONS,
    FONTSIZE,
    BORDERRADIUS,
};
  