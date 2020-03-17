const gulp = require("gulp");

/* sass */
const sass = require("gulp-sass");
const plumber = require("gulp-plumber");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");

/* browser-sync */
const browserSync = require("browser-sync");

/* imagemin */
const imagemin = require("gulp-imagemin");
const imageminPngquant = require("imagemin-pngquant");
const imageminMozjpeg = require("imagemin-mozjpeg");
const imageminOption = [
	imageminPngquant({ quality: "65-80" }),
	imageminMozjpeg({ quality: 85 }),
	imagemin.gifsicle({
		interlaced: false,
		optimizationLevel: 1,
		colors: 256
	}),
	imagemin.optipng(),
	imagemin.svgo()
];

gulp.task("sass", function() {
	return gulp
		.src("./src/sass/**/*.scss")
		.pipe(sass({ outputStyle: "expanded" }))
		.pipe(postcss([autoprefixer()]))
		.pipe(gulp.dest("./src/css/"));
});

gulp.task("watch", function(done) {
	gulp.watch("./src/sass/**/*.scss", gulp.task("sass"));
	gulp.watch("./src/sass/**/*.scss", gulp.task("bs-reload"));
	gulp.watch("./src/js/*.js", gulp.task("bs-reload"));
	gulp.watch("./src/*.html", gulp.task("bs-reload"));
});

gulp.task("browser-sync", function(done) {
	browserSync.init({
		server: {
			baseDir: "./src",
			index: "index.html"
		}
	});
	done();
});

gulp.task("bs-reload", function(done) {
	browserSync.reload();
	done();
});

gulp.task("imagemin", function() {
	return gulp
		.src("./src/img/**/*")
		.pipe(imagemin(imageminOption))
		.pipe(gulp.dest("./src/img"));
});

gulp.task("default", gulp.series(gulp.parallel("browser-sync", "watch")));