# Contributing
I welcome pull requests to fix bugs, add features and more. Below are some rules and guidelines for contributing.

These rules are not necessarily always fully enforced - that's better left to bigger projects. Just try to keep things consistent.

## Code style
Respect the .editorconfig rules in the project root. Try to keep the rest of the code style at least somewhat consistent with what's already there.

The module is written in Typescript, but strict rules are disabled. This means you're not *required* to type everything. However, you are encouraged to add types where it makes sense, to help out other developers who need to work with your code in the future.

### Documentation & comments
_Do as I say, not as I do_. I haven't set a great example so far, but try to add (doc) comments where needed, to document what the application is doing.

## PRs & Squashing
Before submitting a pull request, always open an issue to discuss the changes you intend to make. This will prevent you from making changes that are incompatible with the goals of the project, or with other features being worked on.

Commits don't need to be squashed for a PR.

## Commit messages
Commit messages should be in present tense ("what does this commit change" rather than "what did I do leading up to this commit").

Prefix your commit messages with the most relevant emoji from the [gitmoji](https://gitmoji.carloscuesta.me/) list, but try to use actual unicode emoji characters instead of the `:emoji:` codes.

See previous commit messages for examples.
