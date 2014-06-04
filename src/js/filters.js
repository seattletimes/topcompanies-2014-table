(function() {
  var module = angular.module("nw100");

  module.filter("icon", function() {
    var icons = {
      "business": "icon_bizservices_2.jpg",
      "computer": "icon_computer_2.jpg",
      "hardware": "icon_computer_2.jpg",
      "semiconductors": "icon_semiconductor_2.jpg",
      "travel": "icon_transportation_2.jpg",
      "utilities": "icon_utilities_2.jpg",
      "forest": "icon_forest_2.jpg",
      "comm": "icon_communications_2.jpg",
      "telecom": "icon_communications_2.jpg",
      "biotech": "icon_biotech_2.jpg",
      "banking": "icon_banking_2.jpg",
      "mining": "icon_mining_2.jpg",
      "retail": "icon_retail_2.jpg",
      "personal": "icon_retail_2.jpg",
      "manufacturing": "icon_manufacturing_2.jpg",
      "consumer": "icon_retail_2.jpg",
      "insurance": "icon_banking_2.jpg"
    }
    return function(value) {
      if (value in icons) {
        return "icons/" + icons[value];
      }
      return "X";
    }
  });

  module.filter("strings", function() {

    var strings = {
      //columns
      "pe": "P-E",
      "sales": "Sales",
      "profit": "Profits",
      "freeCash": "Free cash flow",
      "marketCap": "Market cap",
      "revenue": "Revenue",
      "profitDelta": "Profit/ Loss %",
      "roa": "ROA",
      "roic": "ROIC",
      "stock": "Stock price",
      "stockDelta": "Change in stock price",
      "employees": "Employees",
      //sectors
      "business": "Business services",
      "computer": "Computer software/services",
      "travel": "Travel & transportation",
      "consumer": "Consumer products",
      "banking": "Banking",
      "insurance": "Insurance",
      "semiconductors": "Semiconductors & equipment",
      "manufacturing": "Manufacturing",
      "retail": "Retail",
      "forest": "Forest products",
      "utilities": "Utilities",
      "telecom": "Telecommunications",
      "hardware": "Computer hardware",
      "personal": "Personal services",
      "mining": "Mining",
      "biotech": "Biotechnology/biomedical",
      "comm": "Communications/media",
      //ranking HTML
      "same": "-",
      "up": "\u21E7",
      "down": "\u21E9"
    };

    return function(key) {
      return strings[key] || "[" + key + "]";
    }

  });

  module.filter("checkNA", function() {
    return function(value) {
      if (!value) return "N/A";
      return value;
    }
  });

  module.filter("compareRank", function() {
    return function(item) {
      if (!item.prev || item.prev == item.rank) return "same";
      if (item.prev < item.rank) return "down";
      return "up";
    }
  });

  module.filter("rankIcons", function() {
    var icons = {
      "same": "–",
      "up": "▲",
      "down": "▼"
    };
    return function(rank) {
      return icons[rank] || icons.same;
    }
  })

})();