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

module.exports = function(opts) {

    // set default options
    opts = Object.assign({
        includeTag: false,
        footer: false
    }, opts);

    // format to pass to 'git log'
    var headerFormat = "\\newpage%n%n\
-------------------------------------------------------------------%n\
**Document Control**%n\
---------------------  --------------------------------------------%n\
Last Modified On:      %ci%n%n\
Last Modified By:      %cn%n%n\
Generated From:        <%%= file.relative %%>%n%n\
Version Identifier:    %h <%%= describe %%>%n%n\
--------------------------------------------------------------------%n%n"
    if (!opts.asFooter) {
        // add page break after header
        headerFormat = headerFormat + "\\newpage%n%n"
    }

    var gitCommand = 'git --no-pager log -n1 --pretty=tformat:\'' +
                        headerFormat +'\'';

    var describe = '';
    if (opts.includeTag) {
        var gitDescribeCommand = 'git describe --dirty';
        describe = exec(gitDescribeCommand).stdout || '';
        describe = describe.replace(/\s+$/g, ''); // trim any trailing newlines
        if (describe.length) {
            describe = '(' + describe + ')';
        }
    }

    return es.map(function(file, cb){
        var headerText = exec(gitCommand + ' ' + file.path).stdout;
        headerText = headerText || '';

        var data = {
            file : file,
            describe : describe
        };
        var contents = [file.contents];
        var header = new Buffer(gutil.template(headerText, data));
        if (opts.asFooter) {
            contents.push(header);
        }
        else {
            contents.unshift(header)
        }
        file.contents = Buffer.concat(contents);
        cb(null, file);
    });
};

