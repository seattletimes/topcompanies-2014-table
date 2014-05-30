(function() {

  var module = window.module = angular.module("nw100", []);

  module.controller("TableController", function($scope, $http) {

    $scope.tooltip = tooltip;

    $scope.industries = ["business", "computer", "travel", "consumer", "banking", "insurance", "semiconductors", "manufacturing", "retail", "forest", "utilities", "telecom", "hardware", "personal", "mining", "biotech", "comm"]

    $scope.columns = ["pe", "sales", "profit", "marketCap", "freeCash", "roa", "roic"];

    $scope.list = [];

    $http({ url: "nw100.json" }).then(function(json) {
      $scope.list = json.data.list;
    });

    $scope.filterBy = "all";
    $scope.industryFilter = function(value) {
      if ($scope.filterBy == "all") return true;
      return value.sector == $scope.filterBy;
    }

    $scope.compareRank = function(item) {
      if (item.rank == item.prev) return "same";
      if (item.rank > item.prev) return "up";
      return "down";
    }

    $scope.formatColumn = function(type, input) {
      input = input || 0;
      var types = {
        "pe": "=",
        "stockDelta": "%"
      }
      type = types[type] || "$";
      switch(type) {
        case "$":
          if (input > 1000) {
            var rounded = Math.round(input / 10) / 100;
            return "$" + rounded.toFixed(1) + " B";
          }
          return "$" + input.toFixed(1) + " M";
          break;

        case "%":
          return input + "%";

        default:
          return input;
      }
    }

    $scope.sort = "rank";
    $scope.sortDesc = false;
    $scope.sortOn = function(column) {
      if (column == $scope.sort) {
        $scope.sortDesc = !$scope.sortDesc;
      } else if (column == "rank") {
        $scope.sortDesc = false;
      } else {
        $scope.sortDesc = true;
      }
      $scope.sort = column;
      var desc = $scope.sortDesc ? -1 : 1;
      $scope.list.sort(function(itemA, itemB) {
        var a, b;
        if (column in itemA) {
          a = itemA[column];
          b = itemB[column];
          if (typeof a == "string") a = a.toLowerCase();
          if (typeof b == "string") b = b.toLowerCase();
        } else {
          a = itemA.data[2014][column];
          b = itemB.data[2014][column];
        }
        if (a == b) return itemA.rank - itemB.rank;
        if (a > b) return desc;
        return desc * -1;
      });
    };

    $scope.graphOn = "profit";
    $scope.graphable = ["profit", "marketCap", "roic", "stock", "stockDelta"];

  });

})();