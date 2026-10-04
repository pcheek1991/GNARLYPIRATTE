import test from 'node:test';
import assert from 'node:assert/strict';
import { MODELS, VARIABLES, windVector, normalizeForecast, forecastUrl, rainWindow, modelSpread } from '../src/weather.js';
const point = { latitude: 13.4443, longitude: 144.7937 };
function fixture() {
  const units = ['°C', 'm/s', '°', 'm/s', 'hPa', 'mm'];
  const raw = { latitude: 13.5, longitude: 144.75, utc_offset_seconds: 0, hourly: { time: Array.from({ length: 49 }, (_, i) => new Date(Date.UTC(2026, 9, 3, i)).toISOString().slice(0, 16)) }, hourly_units: {} };
  for (const model of MODELS) VARIABLES.forEach((variable, i) => { const key = `${variable}_${model.id}`; raw.hourly_units[key] = units[i]; raw.hourly[key] = Array(49).fill([28, 10, 270, 15, 1000, 2][i]); });
  return raw;
}
test('a wind from west moves east; from north moves south', () => {
  const west = windVector(10, 270), north = windVector(10, 0);
  assert.ok(Math.abs(west.u - 10) < 1e-10); assert.ok(Math.abs(west.v) < 1e-10);
  assert.ok(Math.abs(north.u) < 1e-10); assert.equal(north.v, -10);
});
test('missing wind is not converted to a calm vector', () => { assert.equal(windVector(null, 270), null); assert.equal(windVector(10, null), null); });
test('rain integrates 24 preceding-hour amounts and excludes the earlier interval', () => {
  const raw = fixture(); raw.hourly.precipitation_ecmwf_ifs025[0] = 1000;
  const forecast = normalizeForecast(raw, point, forecastUrl(point)); assert.equal(rainWindow(forecast.models[0]), 48);
});
test('missing rain makes the total unavailable, not zero', () => {
  const raw = fixture(); raw.hourly.precipitation_ecmwf_ifs025[12] = null;
  assert.equal(rainWindow(normalizeForecast(raw, point, forecastUrl(point)).models[0]), null);
});
test('foreign units and a broken time axis are rejected', () => {
  const raw = fixture(); raw.hourly_units.wind_speed_10m_icon_global = 'km/h'; assert.throws(() => normalizeForecast(raw, point, 'url'), /units/);
  const gap = fixture(); gap.hourly.time[2] = gap.hourly.time[3]; assert.throws(() => normalizeForecast(gap, point, 'url'), /consecutive/);
});
test('model spread uses matching times and requires all three values', () => {
  const raw = fixture(); raw.hourly.wind_speed_10m_gfs_global[3] = 15;
  let forecast = normalizeForecast(raw, point, 'url'); assert.equal(modelSpread(forecast.models, 'wind_speed_10m', 3), 5);
  raw.hourly.wind_speed_10m_icon_global[3] = null; forecast = normalizeForecast(raw, point, 'url'); assert.equal(modelSpread(forecast.models, 'wind_speed_10m', 3), null);
});
test('generation duration does not become a fabricated initialization time', () => {
  const raw = fixture(); raw.generationtime_ms = 1.23;
  const result = normalizeForecast(raw, point, 'url', '2026-10-03T19:00:00Z'); assert.equal(result.modelInitialization, null); assert.equal(result.retrievedAt, '2026-10-03T19:00:00Z');
});
test('out of bounds and missing coordinates are rejected before a request', () => { assert.throws(() => forecastUrl({ latitude: 100, longitude: 0 })); assert.throws(() => forecastUrl({ latitude: null, longitude: 0 })); });
