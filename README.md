# Simple Netlify
[![npm](https://img.shields.io/npm/v/simple-netlify)](https://www.npmjs.com/package/simple-netlify)
[![David](https://img.shields.io/david/woubuc/simple-netlify)](https://david-dm.org/woubuc/simple-netlify)

A simple development server CLI for Netlify sites. Because `netlify dev` does too much and is very involved if all you want is to serve some html files.

- Handles basic redirect rules from a `_redirects` file
- Serves the `publish` directory from a `netlify.toml` file
- Runs the `command` from a `netlify.toml` file
- Handles & serves js `functions` directory from a `netlify.toml` file

This package is very basic. If you need the full power of Netlify, use `netlify dev` from their official CLI.

# How to use
Install as a dev dependency in your project
```sh
yarn add --dev simple-netlify
```

Run it
```sh
simple-netlify
```

It will use the properties set in a `netlify.toml` file if you have one, either from the `[dev]` section or falling back to the `[build]` section.

You can also override it with your own directory or commands:
```she
simple-netlify --publish dist
# or
simple-netlify -p dist

simple-netlify --command "yarn dev"
# or
simple-netlify -c "yarn dev"

simple-netlify --functions functions
# or
simple-netlify -f functions
```

# Issues
If you find any bugs or missing features, feel free to [open an issue](https://github.com/woubuc/simple-netlify/issues).

# Contributing
I welcome pull requests to fix bugs, add features and more. Feel free to fork the repository and work on it, but don't forget to open an issue to discuss the changes you intend to make before submitting your PR.

See the [contributing guide](./CONTRIBUTING.md) for more information.

# License
[MIT licensed](./LICENSE.txt).
