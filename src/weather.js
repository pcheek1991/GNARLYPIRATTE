// Original GNARLYPIRATTE code, MIT. Forecast data carries its own attribution.
export const MODELS = Object.freeze([
  { id: 'ecmwf_ifs025', name: 'ECMWF IFS 0.25°', agency: 'ECMWF', className: 'gp-ecmwf', source: 'https://www.ecmwf.int/en/forecasts/datasets/open-data' },
  { id: 'icon_global', name: 'ICON Global', agency: 'DWD', className: 'gp-icon', source: 'https://opendata.dwd.de/weather/nwp/' },
  { id: 'gfs_global', name: 'GFS Global', agency: 'NOAA / NCEP', className: 'gp-gfs', source: 'https://nomads.ncep.noaa.gov/' },
]);
export const VARIABLES = Object.freeze(['temperature_2m', 'wind_speed_10m', 'wind_direction_10m', 'wind_gusts_10m', 'pressure_msl', 'precipitation']);
const EXPECTED_UNITS = { temperature_2m: '°C', wind_speed_10m: 'm/s', wind_direction_10m: '°', wind_gusts_10m: 'm/s', pressure_msl: 'hPa', precipitation: 'mm' };
const cache = new Map();
const CACHE_MS = 10 * 60 * 1000;

export function validateLocation(location) {
  const latitude = location?.latitude;
  const longitude = location?.longitude;
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude) || latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
    throw new Error('Enter a latitude from −90 to 90 and longitude from −180 to 180.');
  }
  return { latitude, longitude };
}

export function forecastUrl(location) {
  const point = validateLocation(location);
  const query = new URLSearchParams({ latitude: String(point.latitude), longitude: String(point.longitude), hourly: VARIABLES.join(','), models: MODELS.map(m => m.id).join(','), wind_speed_unit: 'ms', timezone: 'UTC', forecast_hours: '49', cell_selection: 'nearest' });
  return `https://api.open-meteo.com/v1/forecast?${query}`;
}

export function windVector(speed, fromDegrees) {
  if (!Number.isFinite(speed) || speed < 0 || !Number.isFinite(fromDegrees)) return null;
  const radians = fromDegrees * Math.PI / 180;
  return { u: -speed * Math.sin(radians), v: -speed * Math.cos(radians) };
}

export function finiteValue(value) {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

export function normalizeForecast(raw, location, requestUrl, retrievedAt = new Date().toISOString()) {
  validateLocation(location);
  if (raw?.error) throw new Error(raw.reason || 'The provider could not return this forecast.');
  if (raw?.utc_offset_seconds !== 0 || !Array.isArray(raw?.hourly?.time) || raw.hourly.time.length !== 49) throw new Error('The provider returned an incomplete 48-hour span or a non-UTC time axis.');
  const times = raw.hourly.time;
  for (let i = 0; i < times.length; i++) {
    if (!/^\d{4}-\d{2}-\d{2}T\d{2}:00$/.test(times[i]) || !Number.isFinite(Date.parse(`${times[i]}Z`))) throw new Error('A forecast time could not be verified.');
    if (i && Date.parse(`${times[i]}Z`) - Date.parse(`${times[i - 1]}Z`) !== 3600000) throw new Error('The forecast hours are not consecutive.');
  }
  const models = MODELS.map(model => {
    const fields = {};
    for (const variable of VARIABLES) {
      const key = `${variable}_${model.id}`;
      if (raw.hourly_units?.[key] !== EXPECTED_UNITS[variable]) throw new Error(`Unexpected units for ${model.name}: ${variable}.`);
      if (!Array.isArray(raw.hourly[key]) || raw.hourly[key].length !== times.length) throw new Error(`Incomplete time alignment for ${model.name}.`);
      fields[variable] = raw.hourly[key].map(value => {
        const n = finiteValue(value);
        if (n === null) return null;
        if (['wind_speed_10m', 'wind_gusts_10m', 'precipitation'].includes(variable) && n < 0) return null;
        if (variable === 'wind_direction_10m' && (n < 0 || n > 360)) return null;
        return n;
      });
    }
    return { ...model, fields };
  });
  return { schemaVersion: 1, provider: 'Open-Meteo', kind: 'model forecast', requestedLocation: { ...location }, returnedLocation: { latitude: raw.latitude, longitude: raw.longitude, elevation: raw.elevation }, retrievedAt, requestUrl, timezone: 'UTC', modelInitialization: null, times, models, attribution: 'Weather data: Open-Meteo, ECMWF, DWD, NOAA/NCEP. CC BY 4.0; converted to m/s and summarised by GNARLYPIRATTE.', raw };
}

export async function fetchForecast(location, { signal, force = false, fetchImpl = fetch } = {}) {
  const url = forecastUrl(location);
  const entry = cache.get(url);
  if (!force && entry && Date.now() - entry.savedAt < CACHE_MS) return entry.forecast;
  const response = await fetchImpl(url, { signal, credentials: 'omit', referrerPolicy: 'no-referrer' });
  if (!response.ok) {
    if (response.status === 429) throw new Error('Open-Meteo has limited requests. Please wait before trying again.');
    throw new Error(`The forecast service returned HTTP ${response.status}. Please try again later.`);
  }
  const raw = await response.json();
  const forecast = normalizeForecast(raw, location, url);
  cache.set(url, { savedAt: Date.now(), forecast });
  if (cache.size > 30) cache.delete(cache.keys().next().value);
  return forecast;
}

export function rainWindow(model, startIndex = 0, hours = 24) {
  // Each precipitation timestamp is the sum for the preceding hour.
  // (t0, t24] contains indices 1..24; index 0 includes an earlier interval.
  const values = model.fields.precipitation.slice(startIndex + 1, startIndex + hours + 1);
  if (values.length !== hours || values.some(v => v === null)) return null;
  return values.reduce((sum, v) => sum + v, 0);
}

export function maximum(values) {
  const known = values.filter(v => v !== null && Number.isFinite(v));
  return known.length ? Math.max(...known) : null;
}

export function modelSpread(models, variable, index) {
  const values = models.map(m => m.fields[variable][index]);
  if (values.some(v => v === null)) return null;
  return Math.max(...values) - Math.min(...values);
}
