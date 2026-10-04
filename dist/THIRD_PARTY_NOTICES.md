# Third-party notices

The plugin wrapper and build configuration follow Windy's official plugin
architecture and build pipeline:

- Documentation: https://docs.windy-plugins.com/
- Template: https://github.com/windycom/windy-plugin-template
- Template revision inspected: `94b40336f39da6e155ad39faf77cd63895eaa52a`
- The template's package metadata identifies Windyty, S.E. as author and ISC
  as its license. Its standard build setup informed this starter; sample
  plugin code and sample images are not included.

`@windycom/plugin-devtools` 3.0.4 and its dependencies retain their own licenses.
Installed package license notices are available inside `node_modules`, and
exact dependency versions are recorded in `package-lock.json`. The MIT
license of this starter does not relicense those dependencies.

## Svelte runtime

The compiled plugin includes portions of Svelte 4.2.20's runtime. Its license
notice is reproduced from the installed package's `LICENSE.md`:

Copyright (c) 2016-23 [these people](https://github.com/sveltejs/svelte/graphs/contributors)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

## Weather data

Forecast delivery is provided by [Open-Meteo](https://open-meteo.com/), using
ECMWF IFS, DWD ICON, and NOAA/NCEP GFS model data. Open-Meteo API data is offered
under [CC BY 4.0](https://open-meteo.com/en/licence). Preserve attribution,
license links, and the indication that GNARLYPIRATTE requests wind in m/s and
calculates summaries.

The free hosted endpoint's [usage terms](https://open-meteo.com/en/terms) are
separate from the code and data licenses and restrict the service to
noncommercial use with request limits. Open-Meteo's server code has its own
[AGPLv3-or-later license](https://github.com/open-meteo/open-meteo); that server
code is not bundled here. Consult README.md for the request details and
provenance boundaries.
