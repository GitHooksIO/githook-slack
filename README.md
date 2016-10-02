#GitHook Slack
Posts a message to Slack on certain webhook events.

You are able to choose the event you want to Slack about, and specify a message to send to your channel. You can use template variables as defined below, and they will be automatically replaced by the real values before the message is sent.

## Events

### PR opened
Triggered when a PR is opened.

Template variables: `%{title}, %{number}, %{url}`

Default message: `PR #%{number} opened: %{title} (%{url})`

### PR closed
Triggered when a PR is closed or merged.

Template variables: `%{title}, %{number}, %{url}`

Default message: `PR #%{number} closed: %{title} (%{url})`

### PR reopened
Triggered when a PR is re-opened.

Template variables: `%{title}, %{number}, %{url}`

Default message: `PR #%{number} re-opened: %{title} (%{url})`

### PR edited
Triggered when a PR is edited.

Template variables: `%{title}, %{number}, %{url}`

Default message: `PR #%{number} edited: %{title} (%{url})`

### PR assigned
Triggered when a PR is assigned.

Template variables: `%{title}, %{number}, %{assignee}, %{url}`

Default message: `PR #%{number} assigned to %{assignee}: %{title} (%{url})`

### Issue opened
Triggered when an issue is opened.

Template variables: `%{title}, %{number}, %{url}`

Default message: `Issue #%{number} opened: %{title} (%{url})`

### Issue closed
Triggered when an issue is closed.

Template variables: `%{title}, %{number}, %{url}`

Default message: `Issue #%{number} closed: %{title} (%{url})`

### Issue reopened
Triggered when an issue is re-opened.

Template variables: `%{title}, %{number}, %{url}`

Default message: `Issue #%{number} re-opened: %{title} (%{url})`

### Issue edited
Triggered when an issue is closed.

Template variables: `%{title}, %{number}, %{url}`

Default message: `Issue #%{number} edited: %{title} (%{url})`

### Issue assigned
Triggered when an issue is assigned.

Template variables: `%{title}, %{number}, %{assignee}, %{url}`

Default message: `Issue #%{number} assigned to %{assignee}: %{title} (%{url})`

### PR/Issue comment
Triggered when somebody comments on an Issue or PR.

Template variables: `%{title}, %{comment}, %{number}, %{author}, %{url}`

Default message: `New comment on #%{number} (%{title}) by %{author}: %{url}`

### Fork
Triggered when a repository is forked.

Template variables: `%{author}, %{url}, %{project}`

Default message: `%{project} was forked by %{author}: %{url}`

### Tag
Triggered when you create a new tag.

Template variables: `%{version}, %{project}`

Default message: `New version of %{project} published: %{version}`
