var async = require("async");
var fs = require("fs");
var path = require("path");
var mime = require("mime");
var join = function() {
  return path.join.apply(path, arguments).replace(/\\/g, "/");
}

var aws = require("aws-sdk");
var creds = require("./auth.json");
var config = require("./project.json");

aws.config.update(creds.s3);

var walk = function(dir) {
  var list = [];
  var files = fs.readdirSync(dir);
  files.forEach(function(f) {
    f = join(dir, f);
    var stat = fs.statSync(f);
    if (stat.isDirectory()) {
      list.push.apply(list, walk(f));
    } else {
      var buffer = fs.readFileSync(f);
      list.push({
        path: f,
        buffer: buffer
      });
    }
  });
  return list;
};

module.exports = {
  name: "s3",
  task: function(grunt) {

    grunt.config.merge({
      publish: config.s3
    });

    grunt.registerMultiTask("publish", "Pushes the build folder to S3", function(deploy) {
      var c = this.async();
      var bucketConfig = this.data;
      var s3 = new aws.S3();
      s3.createBucket({
        Bucket: bucketConfig.bucket
      }, function(err) {
        if (err && err.code != "BucketAlreadyOwnedByYou") {
          return console.log(err);
        }
        var uploads = walk("./build");
        async.each(uploads, function(upload, c) {
          var obj = {
            Bucket: bucketConfig.bucket,
            Key: join(bucketConfig.path, upload.path.replace(/^\\?build/, "")),
            Body: upload.buffer,
            ACL: "public-read",
            ContentType: mime.lookup(upload.path)
          };
          //console.log(obj), c();
          console.info("Uploading", obj.Key);
          s3.putObject(obj, c);
        }, function(err) {
          if (err) return console.log(err);
          console.log("All files uploaded successfully");
        })
      });
    });

  }
}