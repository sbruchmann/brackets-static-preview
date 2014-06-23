Static Preview
==============

This extension for [Brackets][brackets] allows you to run your current project on a static web server.
**Note**: _Static Preview_ is currently work in progress.

LiveDevelopment vs. Static Preview
----------------------------------

LiveDevelopment opens a live connection via the remote debugger protocol to your local browser and updates HTML and CSS updates as you type, along with some other niceties.

Problems with LiveDevelopment:
  - currently works only with Google Chrome
  - you can’t open your developer tools while LiveDevelopment is active
  - although the project is served via a local server, you can’t visit it with a different browser/device
    Static Preview

Static Preview starts an express server behind the scenes and uses your current project root as its base directory. This allows you to use your developer tools and/or visit your project with any browser/device you want.

Usage
-----

1. Open Brackets
2. Start _Static Preview_ via the `File -> Static Preview` or by clicking on the toolbar icon

**Note**: _Static Preview_ will be automatically stopped when switching projects or reloading Brackets.

Settings
--------

Open your preferences via `Debug -> Open Preferences File` and edit the following settings:

  - `sbruchmann.staticpreview.port` (default: `3000`)  
    Specifies which port _Static Preview_ will listen at
  - `sbruchmann.staticpreview.hostname` (default: `"0.0.0.0"`)  
    Specifies which hostname _Static Preview_ will use

Roadmap
-------

  - [ ] Live reload web pages on save
  - [ ] Launch (major) browsers automatically
    - [ ] [Google Chrome][chrome]
    - [ ] [Mozilla Firefox][firefox]
    - [ ] [Apple Safari][safari]
    - [ ] [Microsoft Internet Explorer][ie]

[brackets]: http://brackets.io/
[chrome]: https://www.google.com/chrome/browser/
[firefox]: http://www.mozilla.org/en-US/firefox/new/
[ie]: http://windows.microsoft.com/en-us/internet-explorer/download-ie
[safari]: http://www.apple.com/safari/
