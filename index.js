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
-------------------------------------------------------------------%n\
**Document Control**%n\
---------------------  --------------------------------------------%n\
Last Modified On:      %ci%n%n\
Last Modified By:      %cn%n%n\
Generated From:        <%%= file.relative %%>%n%n\
Version Identifier:    <%%= describe %%> (%h)%n%n\
--------------------------------------------------------------------%n\
%n\\newpage%n%n"

    var gitCommand = 'git --no-pager log -n1 --pretty=tformat:\'' +
                        headerFormat +'\'';

    var gitDescribeCommand = 'git describe --dirty';

    return es.map(function(file, cb){
        var headerText = exec(gitCommand + ' ' + file.path).stdout;
        headerText = headerText || '';
        var describe = exec(gitDescribeCommand).stdout;
        describe = describe || '';
        describe = describe.replace(/\s+$/g, ''); // trim any trailing newlines
        var data = {
            file : file,
            describe : describe
        };
        file.contents = Buffer.concat([
            new Buffer(gutil.template(headerText, data)),
            file.contents
        ]);

        cb(null, file);
    });
};

