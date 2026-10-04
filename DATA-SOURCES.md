# Which service supplies which data?

Checked against public provider documentation on 3 October 2026. No account
password or supplied API key was used to build this prototype or obtain its
Open-Meteo forecasts.

## The service and the source are separate

ECMWF, DWD and NOAA produce weather models. Open-Meteo and Windy provide
services around model output: processing, point extraction, delivery and
visualization. An open data license can allow a provider to charge for such
a service. The availability of free source data does not establish wrongdoing
by a paid service.

The identifiers `arome`, `iconEu`, `gfs`, `gfsWave`, `namConus`, `namHawaii`,
`namAlaska` and `cams` appear in Windy's Point Forecast product documentation.
They are not interchangeable with Open-Meteo's API model identifiers. This
prototype uses three explicitly requested Open-Meteo IDs:
`ecmwf_ifs025`, `icon_global` and `gfs_global`. Its successful live response
contains separately suffixed fields for those three models.

[Windy Point Forecast docs](https://api.windy.com/point-forecast/docs),
[Open-Meteo forecast docs](https://open-meteo.com/en/docs).

## Windy's products have distinct rules

| Product | What the checked documentation establishes |
| --- | --- |
| Point Forecast testing | Returns shuffled and slightly modified sample data for development; this plan is not a source of operational forecasts. |
| Map Forecast testing | Limited models and layers, development-only. Its page does not state the Point Forecast randomization rule. Absence of that statement is not an accuracy guarantee. |
| Webcams | Images and timelapse players, with free/professional access differences. Ads do not establish false images. Image URL expiry is not the photograph's capture time. |
| Plugins | Applications that run inside Windy.com, documented at a separate developer guide; a plugin key is not itself a weather forecast. |

Webcam documentation conflicts on the free image URL lifetime: pricing says
15 minutes, while API documentation says 10 minutes. The discrepancy is kept
here rather than resolved by assumption. Both list 24 hours for Professional.
The Point Forecast sample-data statement does not establish that ordinary
Windy.com browser maps or webcams use those sample responses. A Windy Premium
purchase should not be assumed to grant all separate developer API plans.

[Point Forecast pricing](https://api.windy.com/point-forecast/pricing),
[Map Forecast pricing](https://api.windy.com/map-forecast/pricing),
[Webcams pricing](https://api.windy.com/webcams/pricing),
[Webcams docs](https://api.windy.com/webcams/docs),
[Plugin guide](https://docs.windy-plugins.com/).

## ECMWF access routes serve different purposes

| Route | Documented base / source | Purpose and access |
| --- | --- | --- |
| Copernicus CDS | `https://cds.climate.copernicus.eu/api` | Dataset retrieval, including ERA5; account, personal token and dataset terms are required. |
| ECMWF ECDS | `https://ecds.ecmwf.int/api` | A distinct ECMWF data store; use its dataset-specific access instructions. |
| ECMWF XDS | `https://xds.ecmwf.int/api` | A real Cross Data Store, distinct from ECDS. |
| Web API / MARS | `https://api.ecmwf.int/v1` | Archive retrieval with account and access entitlements, not an unlimited anonymous forecast endpoint. |
| Open Data | `https://data.ecmwf.int/forecasts/` | Anonymous forecast-file access to the documented public subset; GRIB2 processing is required. |
| ECaccess | ECMWF's computing gateways | Authenticated computing, file transfer and job access; not a public weather point-forecast API. |

[CDS setup](https://cds.climate.copernicus.eu/how-to-api),
[ECDS setup](https://ecds.ecmwf.int/how-to-api),
[XDS setup](https://xds.ecmwf.int/how-to-api),
[Web API](https://www.ecmwf.int/en/computing/software/ecmwf-web-api),
[ECaccess](https://confluence.ecmwf.int/spaces/ECAC/overview).

ECMWF opened licensing for its real-time catalogue on 1 October 2025. Its
anonymous Open Data distribution still describes a subset, generally at
0.25-degree resolution, retaining the latest 12 runs. Higher-resolution or
custom delivery can have service arrangements and charges. Open licensing,
anonymous download availability and delivery cost are separate properties.
The prototype explicitly uses the IFS 0.25-degree model; it does not claim to
match Windy's 9 km ECMWF layer.

[ECMWF Open Data](https://www.ecmwf.int/en/forecasts/datasets/open-data),
[Open-data transition and redistribution](https://forum.ecmwf.int/t/open-data-transition-on-01-october-2025/14121).

ERA5 is a reconstruction of past weather using a model and observations.
It is useful for historical analysis; it is not a future cyclone forecast.
Selecting an API hostname is insufficient: check the particular dataset's
type, model, run time, valid time, fields, units and license.

[Copernicus climate reanalysis](https://climate.copernicus.eu/climate-reanalysis).

## What “free as in freedom” means for GNARLYPIRATTE

Our original client code is MIT licensed, allowing use, modification and
redistribution under that license. Open-Meteo's weather data requires CC BY
4.0 attribution. Its free hosted endpoint has noncommercial-use restrictions
and rate limits; hosting is a service with finite resources. Open-Meteo's
server code is separately AGPLv3 and is not bundled here. Self-hosting it or
processing raw government forecast files would be an additional deployment
project, with its own storage and compute costs.

The current preview includes no advertising, subscription, account login,
background monitor or hidden fallback to testing data. It performs a direct
public API request for the place selected by the user, with a short in-memory
cache. Read [README.md](README.md) for the exact behavior.

[Open-Meteo terms](https://open-meteo.com/en/terms),
[data license](https://open-meteo.com/en/licence),
[Open-Meteo server source](https://github.com/open-meteo/open-meteo).
