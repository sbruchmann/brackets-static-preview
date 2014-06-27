Static Preview
==============

This extension for [Brackets](http://brackets.io/) allows you to run your current project on a static web server.
**Note**: _Static Preview_ is currently work in progress.

Usage
-----

1. Open Brackets
2. Start _Static Preview_ via the `File -> Static Preview` or by clicking on the toolbar icon

**Note**: _Static Preview_ will be automatically stopped when switching projects or reloading Brackets.


LiveDevelopment vs. Static Preview
----------------------------------

LiveDevelopment opens a live connection via the remote debugger protocol to your local browser and updates HTML and CSS updates as you type, along with some other niceties.

Problems with LiveDevelopment:
  - currently works only with Google Chrome
  - you can’t open your developer tools while LiveDevelopment is active
  - although the project is served via a local server, you can’t visit it with a different browser/device
    Static Preview

Static Preview starts an [express.js](http://expressjs.com/) server behind the scenes and uses your current project root as its base directory. This allows you to use your developer tools and/or visit your project with any browser/device you want.

License
-------

The MIT License. See [LICENSE](LICENSE).
