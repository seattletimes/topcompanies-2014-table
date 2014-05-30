module.exports = function(grunt) {

  var fs = require("fs");
  var shell = require("shelljs");

  grunt.loadNpmTasks("grunt-contrib-concat");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-contrib-connect");
  grunt.loadNpmTasks("grunt-contrib-less");

  grunt.initConfig({
    concat: {
      js: {
        src: [
          "src/js/angular.min.js",
          "src/js/tooltip.js",
          "src/js/sticky.js",
          "src/js/nw100.js",
          "src/js/filters.js",
          "src/js/sparkline.js"
        ],
        dest: "build/js/nw100.js"
      }
    },
    less: {
      dev: {
        src: "src/css/nw100.less",
        dest: "build/css/nw100.css"
      }
    },
    build: {
      dev: "dev.html",
      full: "full.html",
      mattbase: "matt.html"
    },
    watch: {
      js: {
        files: ["src/js/*"],
        tasks: ["build:dev", "concat:js"]
      },
      templates: {
        files: ["src/index.html", "frames/*"],
        tasks: ["build:dev"]
      },
      css: {
        files: ["src/css/*"],
        tasks: ["less"]
      }
    },
    connect: {
      dev: {
        options: {
          base: "./build"
        }
      }
    }
  });

  require("./json-task").task(grunt);

  grunt.registerTask("default", ["build:dev", "concat:js", "json:dev", "less"]);
  grunt.registerTask("live", ["build:dev", "concat:js", "json:live", "less"]);
  grunt.registerTask("dev", ["connect:dev", "default", "watch"]);

  grunt.registerMultiTask("build", "Copy files to the build directory", function() {

    var template = this.data;

    grunt.file.mkdir("build");

    var base = fs.readFileSync("src/index.html", { encoding: "utf8" });
    template = fs.readFileSync("frames/" + template, { encoding: "utf8" });
    var output = grunt.template.process(template, {
      data: {
        content: base
      }
    });

    if (!grunt.file.exists("build")) shell.cp("-r", "src/icons", "build");

    fs.writeFileSync("build/index.html", output);

  });

}