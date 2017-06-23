const gulp = require('gulp');
const ts = require('gulp-typescript');
const clean = require('gulp-clean');
const yaml = require('gulp-yaml');
const BUILD_DIRECTORY = 'dist';

const tsProject = ts.createProject('tsconfig.json');

gulp.task('watch', ['scripts'], () => {
    gulp.watch('src/**/*.ts', ['scripts']);
    gulp.watch('api-doc/api/swagger/swagger.yaml', ['scripts']);
});

gulp.task('clean-scripts', function () {
    return gulp.src(BUILD_DIRECTORY, {read: false}).pipe(clean());
});

gulp.task('swagger', ['clean-scripts'], () => {
    return gulp.src(['api-doc/**/*']).pipe(gulp.dest(BUILD_DIRECTORY + '/api-doc'));
});

gulp.task('swagger-yaml', ['swagger'], () => {
    return gulp.src(BUILD_DIRECTORY + '/api-doc/api/swagger/swagger.yaml')
        .pipe(yaml({ safe: true }))
        .pipe(gulp.dest(BUILD_DIRECTORY + '/api-doc/'));
});

gulp.task('scripts', ['swagger-yaml'], function () {
    const tsResult = tsProject.src()
        .pipe(tsProject());

    return tsResult.js.pipe(gulp.dest(BUILD_DIRECTORY));
});

gulp.task('build', ['scripts']);