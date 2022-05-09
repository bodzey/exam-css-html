"use strict"

const { src, dest } = require("gulp");
const gulp = require("gulp");
const autoprefixer = require("gulp-autoprefixer");
const cssbeautify = require("gulp-cssbeautify");
const removeComments = require('gulp-strip-css-comments');
const rename = require("gulp-rename");
const sass = require("gulp-sass")(require('sass'));
const cssnano = require("gulp-cssnano");
const rigger = require("gulp-rigger");
const uglify = require("gulp-uglify");
const plumber = require("gulp-plumber");
const imagemin = require("gulp-imagemin");
const del = require("del");
const panini = require("panini");
const notify = require("gulp-notify");
const browsersync = require("browser-sync").create();


/* Paths */
let path = {
	build: {
		html: "dist/",
		js: "dist/assets/js/",
		css: "dist/assets/css/",
		vendor_css: "dist/assets/css/vendor",
		images: "dist/assets/img/",
		favicon: "dist/"
	},
	src: {
		html: "src/*.html",
		js: "src/assets/js/**/*.js",
		css: "src/assets/sass/style.scss",
		vendor_css: "src/assets/css/vendor/*.css",
		images: "src/assets/img/**/*.{jpg,png,svg,gif,ico}",
		favicon: "src/*.{xml,webmanifest}"
	},
	watch: {
		html: "src/**/*.html",
		js: "src/assets/js/**/*.js",
		css: "src/assets/sass/**/*.scss",
		vendor_css: "src/assets/css/vendor/*.css",
		images: "src/assets/img/**/*.{jpg,png,svg,gif,ico}",
		favicon: "src/*.{xml,webmanifest}"

	},
	clean: "./dist"
}



/* Tasks */
function browserSync(done) {
	browsersync.init({
		server: {
			baseDir: "./dist/"
		},
		port: 3000
	});
}

function browserSyncReload(done) {
	browsersync.reload();
}

function html() {
	panini.refresh();
	return src(path.src.html, { base: "src/" })
		.pipe(plumber())
		.pipe(panini({
			root: 'src/',
			layouts: 'src/tpl/layouts/',
			partials: 'src/tpl/partials/',
			helpers: 'src/tpl/helpers/',
			data: 'src/tpl/data/'
		}))
		.pipe(dest(path.build.html))
		.pipe(browsersync.stream());
}

function css() {
	return src(path.src.css, { base: "src/assets/sass/" })
		.pipe(plumber({
			errorHandler: function (err) {
				notify.onError(("Error: <%= error.message %>"))(err)
				this.emit('end')
			}
		}))

		.pipe(sass())

		.pipe(autoprefixer({
			grid: false,
			overrideBrowserslist: ["last 3 versions"],
			cascade: true,
		}))

		.pipe(cssbeautify())
		.pipe(dest(path.build.css))
		.pipe(cssnano({
			zindex: false,
			discardComments: {
				removeAll: true
			}
		}))
		.pipe(removeComments())
		.pipe(rename({
			suffix: ".min",
			extname: ".css"
		}))
		.pipe(dest(path.build.css))
		.pipe(browsersync.stream());
}

function vendor_css() {
	return src(path.src.vendor_css, { base: "src/assets/css/vendor" })
		.pipe(plumber({
			errorHandler: function (err) {
				notify.onError(("Error: <%= error.message %>"))(err)
				this.emit('end')
			}
		}))
		.pipe(cssbeautify())
		.pipe(dest(path.build.vendor_css))
		.pipe(cssnano({
			zindex: false,
			discardComments: {
				removeAll: true
			}
		}))
		.pipe(removeComments())
		.pipe(rename({
			suffix: ".min",
			extname: ".css"
		}))
		.pipe(dest(path.build.vendor_css))
		.pipe(browsersync.stream());
}

function js() {
	return src(path.src.js, { base: './src/assets/js/' })
		.pipe(plumber())
		.pipe(rigger())
		.pipe(gulp.dest(path.build.js))
		.pipe(uglify())
		.pipe(rename({
			suffix: ".min",
			extname: ".js"
		}))
		.pipe(dest(path.build.js))
		.pipe(browsersync.stream());
}

function images() {
	return src(path.src.images)
		.pipe(imagemin())
		.pipe(dest(path.build.images));
}

function favicon() {
	return src(path.src.favicon)
		.pipe(dest(path.build.favicon));
}

function clean() {
	return del(path.clean);
}

function watchFiles() {
	gulp.watch([path.watch.html], html);
	gulp.watch([path.watch.css], css);
	gulp.watch([path.watch.vendor_css], vendor_css);
	gulp.watch([path.watch.js], js);
	gulp.watch([path.watch.images], images);
	gulp.watch([path.watch.favicon], favicon);

}

const build = gulp.series(clean, gulp.parallel(html, vendor_css, css, js, images, favicon));
const watch = gulp.parallel(build, watchFiles, browserSync);



/* Exports Tasks */
exports.html = html;
exports.css = css;
exports.vendor_css = vendor_css;
exports.js = js;
exports.images = images;
exports.favicon = favicon;
exports.clean = clean;
exports.build = build;
exports.watch = watch;
exports.default = watch;
