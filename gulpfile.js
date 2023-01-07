const gulp = require("gulp");
const fileinclude = require("gulp-file-include");
const del = require("del");
const browserSync = require("browser-sync");

const server = browserSync.create();

const pathSrc = "./src";
const pathDist = "./docs";

var paths = {
  html: {
    src: `${pathSrc}/html/pages/**/*.html`,
    dist: pathDist,
  },
  css: {
    src: `${pathSrc}/css/*.css`,
    dist: pathDist,
  },
  images: {
    src: `${pathSrc}/images/*`,
    dist: `${pathDist}/images/`,
  },
  copy: {
    src: `${pathSrc}/others/*`,
    dist: pathDist,
  },
};

function clean() {
  return del(["./**/.DS_Store", pathDist]);
}

function copy() {
  return gulp.src(paths.copy.src).pipe(gulp.dest(paths.copy.dist));
}

function html() {
  return gulp
    .src(paths.html.src)
    .pipe(
      fileinclude({
        prefix: "@@",
        basepath: "@file",
      })
    )
    .pipe(gulp.dest(paths.html.dist));
}

function css() {
  return gulp.src(paths.css.src).pipe(gulp.dest(paths.css.dist));
}

function images() {
  return gulp.src(paths.images.src).pipe(gulp.dest(paths.images.dist));
}

function reload(done) {
  server.reload();
  done();
}

function serve(done) {
  server.init({
    server: {
      baseDir: pathDist,
    },
  });
  done();
}

const watch = () =>
  gulp.watch(pathSrc, gulp.series(copy, html, css, images, reload));

const build = gulp.series(clean, copy, html, css, images);
const dev = gulp.series(clean, copy, html, css, images, serve, watch);

exports.clean = clean;
exports.copy = copy;
exports.html = html;
exports.css = css;
exports.images = images;
exports.build = build;

exports.default = dev;
