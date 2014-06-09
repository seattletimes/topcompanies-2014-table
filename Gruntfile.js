module.exports = function(grunt) {

  var fs = require("fs");
  var shell = require("shelljs");

  grunt.loadNpmTasks("grunt-contrib-concat");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-contrib-connect");
  grunt.loadNpmTasks("grunt-contrib-less");
  grunt.loadNpmTasks("grunt-contrib-uglify");

  grunt.initConfig({
    concat: {
      js: {
        src: [
          "src/js/angular.min.js",
          "src/js/tooltip.js",
          "src/js/sticky.js",
          "src/js/nw100.js",
          "src/js/filters.js",
          "src/js/sparkline.js",
          "src/js/data.js"
        ],
        dest: "build/js/nw100.js"
      },
      json: {
        src: "build/nw100.json",
        dest: "src/js/data.js",
        options: {
          banner: "angular.module('nw100').service('dataService', function() { return ",
          footer: "});"
        }
      }
    },
    uglify: {
      options: {
        mangle: false,
        report: "gzip"
      },
      out: {
        files: {
          "./build/js/nw100.js": "./build/js/nw100.js"
        }
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
      mattbase: "matt.html",
    },
    watch: {
      js: {
        files: ["src/js/*"],
        tasks: ["build:full", "concat:js"]
      },
      templates: {
        files: ["src/index.html", "frames/*"],
        tasks: ["build:full"]
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
      },
      cli: {
        options: {
          base: "./build",
          keepalive: true
        }
      }
    }
  });

  require("./json-task").task(grunt);
  require("./s3-task").task(grunt);

  grunt.registerTask("default", ["build:full", "json:live", "concat:json", "concat:js", "less"]);
  grunt.registerTask("live", ["build:full", "json:live", "concat:json", "concat:js", "less", "uglify"]);
  grunt.registerTask("dev", ["connect:dev", "default", "watch"]);

  grunt.registerMultiTask("build", "Copy files to the build directory", function() {

    var template = this.data;

    grunt.file.mkdir("build");

    var base = fs.readFileSync("src/index.html", { encoding: "utf8" });
    template = fs.readFileSync("frames/" + template, { encoding: "utf8" });
    template = template.replace("{{ content }}", "<%= content %>");
    var output = grunt.template.process(template, {
      data: {
        content: base
      }
    });

    if (!grunt.file.exists("build") || !grunt.file.exists("build/icons")) {
      shell.cp("-r", "src/icons", "build");
    }

    if (!grunt.file.exists("build") || !grunt.file.exists("build/img")) {
      shell.cp("-r", "src/img", "build");
    }

    shell.cp("-r", "src/share.min.js", "build");

    fs.writeFileSync("build/index.html", output);

  });

}