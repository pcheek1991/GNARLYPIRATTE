# Windy public plugin gallery inventory

The captured public gallery contained **46 rendered plugin cards** at **2026-10-03 19:49:54 UTC** (12:49:54 p.m. Pacific). This records the cards present in that rendered gallery, not every historical, private, installed or unpublished plugin. Titles, source links and license evidence are preserved in the accompanying CSV and JSON. Gallery marketing descriptions and third-party source code are not republished. Plugin functionality and safety claims have not been independently tested.

The bounded source audit established six author-linked repository mappings. Five repositories had an explicit license file inspected. One repository declared ISC only in package metadata. The other 40 source and license mappings remain unknown in this audit. A missing mapping is not evidence that a project is closed source.

## Publication and reuse

The [official publishing guide](https://docs.windy-plugins.com/getting-started/publishing-plugin.html) permits GitHub repositories that are private or public. Gallery publication and delivery of a browser bundle therefore do not establish an open-source license. A public repository makes source readable; its applicable license determines reuse conditions. Repository software licenses do not automatically cover third-party libraries, icons, weather data, map imagery or external services.

No foreign plugin code was copied or executed for this inventory. No credentials were used. The captured gallery metadata did not record authors, versions, bundle URLs or commit hashes, so an inspected repository is not asserted to be byte-for-byte identical to a deployed plugin release.

## Checked repository mappings

| Gallery title | Repository | Inspected license evidence | Limits |
| --- | --- | --- | --- |
| Light Pollution Atlas Plugin | [Source](https://github.com/DuckSoft/windy-plugin-light-pollution-atlas) | [Unlicense (repository license file inspected)](https://github.com/DuckSoft/windy-plugin-light-pollution-atlas/blob/main/LICENSE) | Repository purpose and author publication disclosure match the gallery plugin. The Unlicense file was inspected. This does not establish external light-pollution dataset licensing or exact deployed bundle identity. |
| flyXC Soundings | [Source](https://github.com/vicb/flyXC) | [MIT (current monorepo license file inspected)](https://github.com/vicb/flyXC/blob/master/LICENSE) | The legacy sounding repository explicitly moved to flyXC. The current component README names flyXC Soundings and its Windy installation. The current monorepo MIT file was inspected; this is not an assumption that the legacy license covers a current deployed bundle. Deployed version, dependencies and data rights were not audited. |
| Sun & Moon Path | [Source](https://github.com/bytepoem/windy-plugin-sun-moon-path) | [MIT (repository license file inspected)](https://github.com/bytepoem/windy-plugin-sun-moon-path/blob/main/LICENSE) | The author and repository identify this plugin. License applies to inspected repository source; the exact deployed gallery version and commit were not matched. Dependencies, imagery and weather-data rights were not audited. |
| Pressure Diff Charts Alps | [Source](https://github.com/wetterheidi/windy-plugin-pressure-difference) | [Not fully established; ISC declared in package metadata](https://github.com/wetterheidi/windy-plugin-pressure-difference/blob/main/package.json) | Author publication disclosure and repository pressure-difference purpose match this gallery entry. The package declares ISC, but no separate license text was verified. Some package metadata still names the Windy template or older repository, so a complete applicable grant is not established. Deployed version and data rights were not audited. |
| 中央气象台 (CMA) 台风路径追踪 | [Source](https://github.com/jianghanzhi2006-dotcom/windy-plugin-cma-typhoon) | [MIT (repository license file inspected)](https://github.com/jianghanzhi2006-dotcom/windy-plugin-cma-typhoon/blob/main/LICENSE) | Repository README and author publication disclosure identify the CMA typhoon plugin. The MIT file was inspected. Published and submitted releases can differ; the exact gallery version was not recorded. External CMA data licensing and dependencies were not audited. |
| USA NWS Alerts | [Source](https://github.com/RyanMathewson/windy-plugin-usa-nws-alerts) | [GPL-3.0 (license file inspected; only/or-later grant not resolved)](https://github.com/RyanMathewson/windy-plugin-usa-nws-alerts/blob/main/LICENSE) | Repository README and author publication disclosure identify the USA NWS Alerts plugin. The GNU GPL version 3 file was inspected; only-versus-or-later was not inferred. Exact deployed bundle, dependencies and upstream data terms were not audited. |

Each checked row also stores the author/repository mapping evidence URLs in the JSON and CSV. The current flyXC monorepo was checked after following the legacy sounding repository migration; its current component README explicitly names flyXC Soundings. The Pressure Diff Charts Alps declaration is deliberately kept separate from the five inspected license files.

## Official architecture reference

The [Windy plugin template](https://github.com/windycom/windy-plugin-template) is the official developer starter. Its [package metadata](https://github.com/windycom/windy-plugin-template/blob/main/package.json) declares ISC. A separate license text was not verified. This reference explains the starter architecture; no mapping to the gallery examples was established from name similarity, and it supplies no blanket license for plugins by other authors.

## All captured cards

Order follows the rendered [public gallery](https://www.windy.com/plugins). The inventory records names and license evidence rather than repeating gallery marketing claims.

| # | Gallery title | Source/license evidence in this audit |
| --- | --- | --- |
| 1 | Traj | Not established |
| 2 | Multipicker | Not established |
| 3 | Light Pollution Atlas Plugin | [Repository](https://github.com/DuckSoft/windy-plugin-light-pollution-atlas); Unlicense (repository license file inspected) |
| 4 | WindyVR LSV Team | Not established |
| 5 | Fishing Index | Not established |
| 6 | spearo — water visibility & no-take zones | Not established |
| 7 | flyXC Soundings | [Repository](https://github.com/vicb/flyXC); MIT (current monorepo license file inspected) |
| 8 | SoarCast | Not established |
| 9 | Sun & Moon Path | [Repository](https://github.com/bytepoem/windy-plugin-sun-moon-path); MIT (repository license file inspected) |
| 10 | Clouds Horizon Distance | Not established |
| 11 | Nav Tools | Not established |
| 12 | Aero Clear | Not established |
| 13 | Paraglider Wind Profile | Not established |
| 14 | Pressure Diff Charts Alps | [Repository](https://github.com/wetterheidi/windy-plugin-pressure-difference); Not fully established; ISC declared in package metadata |
| 15 | 中央气象台 (CMA) 台风路径追踪 | [Repository](https://github.com/jianghanzhi2006-dotcom/windy-plugin-cma-typhoon); MIT (repository license file inspected) |
| 16 | Prevención de incendios forestales · Navarra | Not established |
| 17 | FieldGuard — HSE Field Safety | Not established |
| 18 | Windy IFR Planner | Not established |
| 19 | Globe mini | Not established |
| 20 | Riesgo de Heladas | Not established |
| 21 | RAQDPS Wildfire Smoke (Canada) | Not established |
| 22 | Paragliding Mapa | Not established |
| 23 | Pronóstico de Viento Zonda | Not established |
| 24 | Upper winds | Not established |
| 25 | 地理院淡色地図レイヤー | Not established |
| 26 | Wind & Solar Power Forecast | Not established |
| 27 | The Buoy | Not established |
| 28 | Passage Planner | Not established |
| 29 | Weather Why | Not established |
| 30 | Picker Rings | Not established |
| 31 | SoarCalc | Not established |
| 32 | Day Night | Not established |
| 33 | Airspaces | Not established |
| 34 | Flight planner | Not established |
| 35 | Ship Position | Not established |
| 36 | Astro Seeing & Transparency | Not established |
| 37 | Sun Position | Not established |
| 38 | Meteoblue Meteograms | Not established |
| 39 | USA NWS Alerts | [Repository](https://github.com/RyanMathewson/windy-plugin-usa-nws-alerts); GPL-3.0 (license file inspected; only/or-later grant not resolved) |
| 40 | Snow resorts | Not established |
| 41 | Contrail finder | Not established |
| 42 | Boat Tracker | Not established |
| 43 | Foehn and Bise Chart | Not established |
| 44 | Airspaces example | Not established |
| 45 | Aircraft range | Not established |
| 46 | Hello World plugin | Not established |

## Files and coverage

- `public-plugin-catalog.json`: original capture time and scope, all 46 original titles, row-level evidence/limits, and audit summary.
- `public-plugin-catalog.csv`: the same 46 rows in a portable table, with UTF-8 text, evidence links, and explicit unknowns.
- `PUBLIC-PLUGINS.md`: this readable inventory and bounded source audit.

Coverage does not include full source audits, dependency inventories, deployed release matching, data-license reviews, vulnerability testing, validation of weather calculations, or an exhaustive historical/private plugin census.
