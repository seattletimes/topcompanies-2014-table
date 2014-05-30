var fs = require("fs");
var async = require("async");
var csv = require("csv");

module.exports = {
  name: "json",
  task: function(grunt) {

    grunt.config.merge({
      json: {
        dev: {
          spacing: 2
        },
        live: {
          spacing: 0
        }
      }
    });

    var sets = {
      freeCash: "free cash flow.csv",
      marketCap: "market cap.csv",
      pe: "pe_ratio.csv",
      profit: "profit.csv",
      revenue: "revenue.csv",
      roa: "ROA.csv",
      roic: "ROIC.csv",
      stock: "stock price.csv",
      stockDelta: "stock price growth.csv"
    };

    var parseFiles = function(rows, done) {
      var self = this;
      async.each(Object.keys(sets), function(set, c) {
        var file = fs.readFileSync("csv/" + sets[set], { encoding: "utf8" });
        var parser = csv.parse({
          columns: true,
          auto_parse: true
        });
        parser.on("data", function(line) {
          var company = rows[line.TICKER];
          for (var key in line) {
            if (key == "TICKER") continue;
            if (!company.data[key]) {
              company.data[key] = {};
            }
            company.data[key][set] = isNaN(parseFloat(line[key])) ? null : line[key];
          }
        });
        parser.on("finish", c);
        parser.write(file);
        parser.end();
      }, function() {
        //done
        var output = [];
        for (var company in rows) {
          output.push(rows[company]);
        }
        fs.writeFileSync("./build/nw100.json", JSON.stringify({ list: output }, null, self.data.spacing));
        done();
      });
    };

    var parseMaster = function(rows, c) {
      var self = this;
      var master = fs.readFileSync("csv/2014.csv", { encoding: "utf8" });
      var masterParser = csv.parse({
        columns: true,
        auto_parse: true
      });
      masterParser.on("data", function(row) {
        var dataColumns = "roic|marketCap|freeCash|sales|profit|profitDelta|roa|employees|pe".split("|");
        
        var company = {
          symbol: row.symbol,
          name: row.company,
          hq: row.hq,
          rank: row.rank,
          prev: row.previous,
          sector: row.sector,
          data: {
            2014: {}
          }
        };

        dataColumns.forEach(function(col) {
          //if (!row[col]) return;
          company.data[2014][col] = row[col] || null;
        });

        rows[row.symbol] = company;

      });

      masterParser.on("finish", function(){
        parseFiles.call(self, rows, c);
      });

      masterParser.write(master);
      masterParser.end();
    };

    grunt.registerMultiTask("json", "Turn CSV into a unified JSON file", function() {
      var c = this.async();
      parseMaster.call(this, {}, c);
    });
  }
}