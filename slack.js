module.exports = function (gh) {

    if (gh.data.payload.ref_type !== 'tag') {
        gh.process.succeed('No tag was created.');
    }
    else {
        var options = {
            url:      gh.data.parameters.url,
            headers: {
                'Content-Type':  'application/json',
                'User-Agent':    'githook-slack',
            },
            json: gh.data.parameters
        };

        gh.modules.request.post(options, function (err, httpResponse, body) {
            if (err) {
                gh.process.fail('Fail! Response: ' + err);
            }
            else {
                gh.process.succeed('Successfully posted to Slack.');
            }
        });
    }

};
