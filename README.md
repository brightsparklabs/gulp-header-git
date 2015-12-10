# gulp-header-git

`gulp` plugin for adding headers containing information from git.

Based off the excellent
[gulp-header](https://github.com/godaddy/gulp-header).

Adds a `Document Control` header table to the beginning of markdown
documents.  Primarily used to include document metadata in files prior
to export into PDFs via `pandoc`.

# Installation

```shell
# shell 
npm install gulp-header-git --save-dev 
```

# Usage

Within `gulpfile.js`:

```javascript 
// javascript

var header = require('gulp-header-git');

gulp.task('build', function() {
    gulp.src('src/markdown/**/*.md')
        .pipe(header()) 
        .pipe(gulp.dest('build/markdown'));
});
```

# Licenses

Refer to the `LICENSE` file for details.

