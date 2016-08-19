/*
 * Created brightSPARK Labs
 * www.brightsparklabs.com
 */

'use strict';

// -----------------------------------------------------------------------------
// MODULES
// -----------------------------------------------------------------------------

var es       = require('event-stream');
var exec     = require('sync-exec');
var gutil    = require('gulp-util');
var moment   = require('moment');

// -----------------------------------------------------------------------------
// EXPORTS
// -----------------------------------------------------------------------------

module.exports = function() {
    // format to pass to 'git log'
    var headerFormat = "\\newpage%n%n\
|**Document Control**|%n\
|-:|-%n\
|Last Modified On:|%cI%n\
|Last Modified By:|%cn%n\
|Generated On:| <%%= date %%>%n\
|Generated From:| <%%= file.relative %%>%n\
|Version Identifier:|%h%n\
%n\\newpage%n%n"

    var gitCommand = 'git --no-pager log -n1 --pretty=tformat:\'' +
                        headerFormat +'\'';

    return es.map(function(file, cb){
        var headerText = exec(gitCommand + ' ' + file.path).stdout;
        headerText = headerText || '';
        var data = {
            date : moment().utc().format(),
            file : file
        };
        file.contents = Buffer.concat([
            new Buffer(gutil.template(headerText, data)),
            file.contents
        ]);
        cb(null, file);
    });
};

