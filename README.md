Static Preview
==============

This extension for [Brackets][brackets] allows you to run your current project on a static web server.
**Note**: _Static Preview_ is currently work in progress.

Usage
-----

1. Open Brackets
2. Start _Static Preview_ via the `File -> Static Preview` or by clicking on the toolbar icon
3. Visit http://localhost:3000 in your browser(s).

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
