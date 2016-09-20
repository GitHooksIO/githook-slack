module.exports = function (data, process) {

    var request = require('request');

    if (data.payload.ref_type !== 'tag') {
        process.succeed('Nothing to see here. (No tag was created)');
    }
    else {
        var options = {
            url:      data.parameters.url,
            headers: {
                'Content-Type':  'application/json',
                'User-Agent':    'githook-post-to-twitter',
            },
            json: data.parameters
        };

        request.post(options, function (err, httpResponse, body) {
            if (err) {
                process.fail('Fail! Response: ' + err);
            }
            else {
                process.succeed('Success! Response:' + body);
            }
        });
    }

};
