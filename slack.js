module.exports = function (gh) {

    var events = {
        'PR opened': {
            conditions: [
                {
                    exists: 'pull_request'
                },
                {
                    exists: 'action',
                    value:  'opened'
                }
            ],
            variables: {
                'title':  'pull_request.title',
                'number': 'number',
                'url':    'pull_request.html_url'
            },
            message: 'PR #%{number} opened: %{title} (%{url})'
        },
        'PR closed': {
            conditions: [
                {
                    exists: 'pull_request'
                },
                {
                    exists: 'action',
                    value:  'closed'
                }
            ],
            variables: {
                'title':  'pull_request.title',
                'number': 'number',
                'url':    'pull_request.html_url'
            },
            message: 'PR #%{number} closed: %{title} (%{url})'
        },
        'PR reopened': {
            conditions: [
                {
                    exists: 'pull_request'
                },
                {
                    exists: 'action',
                    value:  'reopened'
                }
            ],
            variables: {
                'title':  'pull_request.title',
                'number': 'number',
                'url':    'pull_request.html_url'
            },
            message: 'PR #%{number} re-opened: %{title} (%{url})'
        },
        'PR edited': {
            conditions: [
                {
                    exists: 'pull_request'
                },
                {
                    exists: 'action',
                    value:  'edited'
                }
            ],
            variables: {
                'title':  'pull_request.title',
                'number': 'number',
                'url':    'pull_request.html_url'
            },
            message: 'PR #%{number} edited: %{title} (%{url})'
        },
        'PR assigned': {
            conditions: [
                {
                    exists: 'pull_request'
                },
                {
                    exists: 'action',
                    value:  'assigned'
                }
            ],
            variables: {
                'title':    'pull_request.title',
                'number':   'number',
                'url':      'pull_request.html_url',
                'assignee': 'pull_request.user.login' // @TODO
            },
            message: 'PR #%{number} assigned to %{assignee}: %{title} (%{url})'
        },
        'PR/Issue comment': {
            conditions: [
                {
                    exists: 'issue'
                },
                {
                    exists: 'action',
                    value:  'created'
                }
            ],
            variables: {
                'title':   'issue.title',
                'number':  'issue.number',
                'url':     'issue.comment.html_url',
                'author':  'issue.comment.user.login',
                'comment': 'issue.comment.body'
            },
            message: 'New comment on #%{number} (%{title}) by %{author}: %{url}'
        },
        'Issue opened': {
            conditions: [
                {
                    exists: 'issue'
                },
                {
                    exists: 'action',
                    value:  'opened'
                }
            ],
            variables: {
                'title':   'issue.title',
                'number':  'issue.number',
                'url':     'issue.html_url'
            },
            message: 'Issue #%{number} opened: %{title} (%{url})'
        },
        'Issue closed': {
            conditions: [
                {
                    exists: 'issue'
                },
                {
                    exists: 'action',
                    value:  'closed'
                }
            ],
            variables: {
                'title':   'issue.title',
                'number':  'issue.number',
                'url':     'issue.html_url'
            },
            message: 'Issue #%{number} closed: %{title} (%{url})'
        },
        'Issue reopened': {
            conditions: [
                {
                    exists: 'issue'
                },
                {
                    exists: 'action',
                    value:  'reopened'
                }
            ],
            variables: {
                'title':   'issue.title',
                'number':  'issue.number',
                'url':     'issue.html_url'
            },
            message: 'Issue #%{number} re-opened: %{title} (%{url})'
        },
        'Issue edited': {
            conditions: [
                {
                    exists: 'issue'
                },
                {
                    exists: 'action',
                    value:  'edited'
                }
            ],
            variables: {
                'title':   'issue.title',
                'number':  'issue.number',
                'url':     'issue.html_url'
            },
            message: 'Issue #%{number} edited: %{title} (%{url})'
        },
        'Issue assigned': {
            conditions: [
                {
                    exists: 'issue'
                },
                {
                    exists: 'action',
                    value:  'assigned'
                }
            ],
            variables: {
                'title':    'issue.title',
                'number':   'issue.number',
                'url':      'issue.html_url',
                'assignee': 'issue.user.login' // @TODO
            },
            message: 'Issue #%{number} assigned to %{assignee}: %{title} (%{url})'
        },
        'Fork': {
            conditions: [
                {
                    exists: 'forkee'
                }
            ],
            variables: {
                'project': 'forkee.repository.full_name',
                'url':     'forkee.html_url',
                'author':  'forkee.owner.login'
            },
            message: '%{project} was forked by %{author}: %{url}'
        },
        'Tag': {
            conditions: [
                {
                    exists: 'release'
                },
                {
                    exists: 'action',
                    value:  'published'
                }
            ],
            variables: {
                'project': 'repository.full_name',
                'version': 'release.tag_name'
            },
            message: 'New version of %{project} published: %{version}'
        }
    };

    var eventName = gh.data.parameters.event; // e.g. 'Issue assigned'

    if (!events[eventName]) {
        gh.process.fail('Invalid event: "' + eventName + '"');
    }

    // this block checks if this is the event we want to subscribe to
    var event = events[eventName];
    for (var i = 0; i < event.conditions.length; i++) {
        var propertyToExist = event.conditions[i].exists,
            valueToHave     = event.conditions[i].value;

        if (!gh.data.payload.hasOwnProperty(propertyToExist)) {
            gh.process.succeed('Event not identified as a "' + eventName + '" event. Skipping.');
        }
        else if (valueToHave && valueToHave !== gh.data.payload[propertyToExist]) {
            gh.process.succeed('Event not identified as a "' + eventName + '" event. Skipping.');
        }
    }

    // if we get this far, then this IS the event we've subscribed to, so we want to send the Slack message
    // just need to replace any template variables first.

    var message = gh.data.parameters.text;
    // override with default message if blank
    if (message === '') {
        message = event.message;
    }
    // now replace the template variables
    for (var name in event.variables) {
        var nestedProperties = event.variables[name]; // e.g. 'foo.bar'
        var getter = new Function('obj', 'return obj.' + nestedProperties + ';');
        var value  = getter(gh.data.payload);
        message = message.replace('%{' + name + '}', value);
    }
    // update the parameter before we pass to Slack
    gh.data.parameters.text = message;

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
};
