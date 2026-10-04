import { MODELS, fetchForecast, validateLocation, windVector, rainWindow, modelSpread } from './weather.js';

const PRESETS = {
  guam: { latitude: 13.4443, longitude: 144.7937, label: 'Guam · Hagåtña' },
  pagan: { latitude: 18.125, longitude: 145.8, label: 'Pagan · Northern Marianas' },
  ogasawara: { latitude: 27.094, longitude: 142.191, label: 'Chichijima · Ogasawara' },
  taipei: { latitude: 25.033, longitude: 121.5654, label: 'Taipei · Taiwan' },
  miami: { latitude: 25.7617, longitude: -80.1918, label: 'Miami · South Florida' },
};
const METRICS = {
  wind_speed_10m: { label: 'Wind at 10 m', unit: 'm/s' },
  precipitation: { label: 'Precipitation per preceding hour', unit: 'mm' },
  pressure_msl: { label: 'Sea-level pressure', unit: 'hPa' },
  temperature_2m: { label: 'Temperature at 2 m', unit: '°C' },
};
const esc = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const number = (value, decimals = 1) => value === null || value === undefined ? 'Unavailable' : value.toFixed(decimals);
const timeLabel = time => `${time.slice(5, 10)} ${time.slice(11, 16)} UTC`;
const compass = degrees => degrees === null ? 'Unavailable' : ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'][Math.round(degrees / 22.5) % 16];
const sourceLink = (url, label) => `<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${label}</a>`;
const SOURCE_REPOSITORY = 'https://github.com/pcheek1991/GNARLYPIRATTE';

function tableRows(forecast, index) {
  return forecast.models.map(m => {
    const f = m.fields;
    return `<tr><th><i class="gp-key ${m.className}"></i>${m.name}</th><td>${number(f.wind_speed_10m[index])}</td><td>${number(f.wind_direction_10m[index], 0)}${f.wind_direction_10m[index] === null ? '' : `° ${compass(f.wind_direction_10m[index])}`}</td><td>${number(f.wind_gusts_10m[index])}</td><td>${number(f.temperature_2m[index])}</td><td>${number(f.pressure_msl[index])}</td><td>${number(f.precipitation[index], 2)}</td></tr>`;
  }).join('');
}

function vectorReadings(forecast, index) {
  return forecast.models.map(m => {
    const v = windVector(m.fields.wind_speed_10m[index], m.fields.wind_direction_10m[index]);
    return `<p><strong>${m.name}:</strong> ${v ? `eastward u = ${number(v.u)} m/s; northward v = ${number(v.v)} m/s.` : 'Vector unavailable because a wind value is missing.'}</p>`;
  }).join('');
}

function lineChart(forecast, variable, selectedIndex) {
  const all = forecast.models.flatMap(m => m.fields[variable]).filter(v => v !== null);
  if (!all.length) return '<p>No values are available for this field.</p>';
  let min = Math.min(...all), max = Math.max(...all);
  if (variable === 'precipitation' || variable === 'wind_speed_10m') min = 0;
  const range = max - min || 1;
  const padding = range * 0.1;
  if (min !== 0) min -= padding;
  max += padding;
  const x = i => 54 + i / (forecast.times.length - 1) * 596;
  const y = v => 186 - (v - min) / (max - min) * 146;
  const grid = [0, 0.5, 1].map(p => { const value = min + (max - min) * p; return `<line x1="54" x2="650" y1="${y(value)}" y2="${y(value)}" class="gp-grid"/><text x="46" y="${y(value) + 4}" text-anchor="end">${number(value)}</text>`; }).join('');
  const lines = forecast.models.map(model => {
    let connected = false;
    const d = model.fields[variable].map((v, i) => {
      if (v === null) { connected = false; return ''; }
      const command = connected ? 'L' : 'M'; connected = true;
      return `${command}${x(i).toFixed(2)},${y(v).toFixed(2)}`;
    }).join(' ');
    const value = model.fields[variable][selectedIndex];
    return `<path d="${d}" class="gp-line ${model.className}"/>${value === null ? '' : `<circle cx="${x(selectedIndex)}" cy="${y(value)}" r="5" class="gp-dot ${model.className}"/>`}`;
  }).join('');
  return `<svg viewBox="0 0 690 234" role="img" aria-label="${esc(METRICS[variable].label)} forecast comparison. Exact values are in the table below.">${grid}<line x1="${x(selectedIndex)}" x2="${x(selectedIndex)}" y1="28" y2="194" class="gp-cursor"/>${lines}<text x="54" y="218">${timeLabel(forecast.times[0])}</text><text x="650" y="218" text-anchor="end">${timeLabel(forecast.times.at(-1))}</text><text x="54" y="20">${METRICS[variable].unit}</text></svg>`;
}

export function mountPanel(host, { initialLocation = PRESETS.guam, locationLabel = 'Guam · Hagåtña', onUseMapCenter } = {}) {
  let location = validateLocation(initialLocation);
  let label = locationLabel;
  let forecast = null, selectedIndex = 0, metric = 'wind_speed_10m', controller = null, requestNumber = 0, disposed = false;
  host.innerHTML = `<div class="gnarlypiratte">
    <header class="gp-header"><span class="gp-eyebrow">A public weather workbench</span><div class="gp-brand"><span class="gp-flag" aria-hidden="true">⚑</span><h1>GNARLYPIRATTE</h1></div><p>Public forecasts. Shared knowledge.</p><span class="gp-badge">Local preview · 0.1</span></header>
    <div class="gp-layout"><aside class="gp-controls">
      <h2>Choose a place</h2><label for="gp-preset">Places</label><select id="gp-preset"><option value="">Custom coordinates</option>${Object.entries(PRESETS).map(([key, p]) => `<option value="${key}">${p.label}</option>`).join('')}</select>
      <form id="gp-form"><div class="gp-coordinate-inputs"><label>Latitude<input id="gp-lat" type="number" step="any" min="-90" max="90" required/></label><label>Longitude<input id="gp-lon" type="number" step="any" min="-180" max="180" required/></label></div><button class="gp-primary" type="submit">Compare forecasts</button></form>
      ${onUseMapCenter ? '<button id="gp-map-center" class="gp-secondary" type="button">Use Windy map center</button>' : ''}
      <p class="gp-small">The selected coordinates are sent to Open-Meteo to fetch the forecast.</p>
      <div class="gp-model-list"><h2>Three forecast models</h2>${MODELS.map(m => `<div><span class="gp-key ${m.className}"></span>${m.name}<small>${m.agency}</small></div>`).join('')}</div>
      <div class="gp-alerts"><h2>Official warnings</h2><p>Check the weather authority for the place you are protecting.</p>${sourceLink('https://www.weather.gov/gum/', 'NWS Guam / Marianas')}${sourceLink('https://www.jma.go.jp/bosai/information/#lang=en', 'Japan · JMA')}${sourceLink('https://www.cwa.gov.tw/eng/', 'Taiwan · CWA')}${sourceLink('https://www.weather.gov/', 'United States · NWS')}<p class="gp-small">These links open current agency pages. No warning feed or all-clear is inferred from this comparison.</p></div>
    </aside><main class="gp-main">
      <div class="gp-location"><h2 id="gp-location-title"></h2><span id="gp-point"></span></div><p id="gp-status" role="status" aria-live="polite"></p>
      <div id="gp-results" hidden></div>
      <div class="gp-use-note"><strong>Model forecasts for a grid point.</strong> Local winds, precipitation and terrain can differ. Model disagreement is a reason to investigate; it does not measure the probability of danger.</div>
      <details class="gp-details"><summary>Follow the data</summary><p>${sourceLink('https://open-meteo.com/', 'Forecast delivery: Open-Meteo')} · ${sourceLink('https://open-meteo.com/en/docs', 'Forecast documentation')}</p><p>${MODELS.map(m => sourceLink(m.source, m.agency)).join(' · ')}</p><p>Weather data is CC BY 4.0. GNARLYPIRATTE converts wind units and calculates the displayed summaries. Open-Meteo’s hosted free service is for noncommercial use and has rate limits; our original code is MIT licensed.</p><p>${sourceLink('https://open-meteo.com/en/terms', 'Service terms')} · ${sourceLink('https://open-meteo.com/en/licence', 'Data attribution')}</p><p>No sign-in, API key or personal account information is needed for this preview. Requests are manual; repeat requests use a ten-minute in-memory cache. A different place starts a new request.</p></details>
    </main></div><footer>Built for curious people, everywhere. <span>Knowledge is cool. Knowledge is fun.</span><span>${sourceLink(SOURCE_REPOSITORY, 'View source on GitHub')} · MIT licensed code</span></footer>
  </div>`;
  const root = host.querySelector('.gnarlypiratte');
  const $ = id => root.querySelector(`#${id}`);
  const syncLocation = () => {
    $('gp-lat').value = location.latitude; $('gp-lon').value = location.longitude;
    $('gp-location-title').textContent = label;
    $('gp-point').textContent = `${location.latitude.toFixed(4)}°, ${location.longitude.toFixed(4)}°`;
    const key = Object.keys(PRESETS).find(k => PRESETS[k].latitude === location.latitude && PRESETS[k].longitude === location.longitude);
    $('gp-preset').value = key ?? '';
  };

  function renderData() {
    if (!forecast || disposed) return;
    const time = forecast.times[selectedIndex];
    const spread = modelSpread(forecast.models, 'wind_speed_10m', selectedIndex);
    const rainEnd = forecast.times[24];
    $('gp-results').innerHTML = `<div class="gp-summary"><div><span>Forecast window</span><strong>48 hours</strong><small>${timeLabel(forecast.times[0])} onward</small></div><div><span>Wind spread at selected hour</span><strong id="gp-spread">${number(spread)}${spread === null ? '' : ' m/s'}</strong><small>Highest minus lowest of three models</small></div><div><span>Data retrieved</span><strong>${forecast.retrievedAt.slice(11, 16)} UTC</strong><small>${forecast.retrievedAt.slice(0, 10)}</small></div></div>
      <section class="gp-chart-card"><div class="gp-chart-heading"><h3>Follow the next 48 hours</h3><label for="gp-metric">Compare<select id="gp-metric">${Object.entries(METRICS).map(([key, info]) => `<option value="${key}" ${key === metric ? 'selected' : ''}>${info.label}</option>`).join('')}</select></label></div><div id="gp-chart">${lineChart(forecast, metric, selectedIndex)}</div><div class="gp-timeline"><label for="gp-hour">Selected forecast time <strong>${timeLabel(time)}</strong></label><input id="gp-hour" type="range" min="0" max="${forecast.times.length - 1}" value="${selectedIndex}" step="1"/></div><div class="gp-legend">${MODELS.map(m => `<span><i class="gp-key ${m.className}"></i>${m.name}</span>`).join('')}</div></section>
      <div class="gp-table-scroll"><table><caption id="gp-selected-caption">At ${timeLabel(time)} · winds describe where the air comes from</caption><thead><tr><th>Model</th><th>Wind<br>m/s</th><th>From<br>degrees</th><th>Model gust peak<br>m/s</th><th>Temperature<br>°C</th><th>Pressure<br>hPa</th><th>Precipitation<br>mm / preceding hour</th></tr></thead><tbody id="gp-values">${tableRows(forecast, selectedIndex)}</tbody></table></div><p class="gp-small">Gusts are maxima over model reporting intervals, which can differ. An hourly display may interpolate coarser output.</p>
      <section class="gp-rain"><h3>First 24-hour precipitation totals</h3><p>${timeLabel(forecast.times[0])} → ${timeLabel(rainEnd)}</p><div>${forecast.models.map(m => `<article><span>${m.name}</span><strong>${number(rainWindow(m), 1)}${rainWindow(m) === null ? '' : ' mm'}</strong><small>${rainWindow(m) === null ? 'At least one hourly amount is missing' : 'Rain + snow water equivalent'}</small></article>`).join('')}</div></section>
      <details class="gp-details gp-math"><summary>See how your arrows become math</summary><p>Wind direction is a “from” bearing, clockwise from north. The wind vector points where the air is going.</p><div class="gp-formula">u = −speed × sin(direction)<br>v = −speed × cos(direction)</div><div id="gp-vectors">${vectorReadings(forecast, selectedIndex)}</div><p>Hourly precipitation amounts add up to a total. A slow-moving storm can keep rain over a place longer, but measuring its motion needs timed storm-center positions. This point forecast does not track a cyclone center.</p></details>
      <div class="gp-provenance"><p><strong>Forecast times are UTC.</strong> Retrieved time records our request; it is not a model’s initialization time. This response does not supply the individual run times, and the models may come from different runs. Hourly values can be interpolated from coarser model output.</p><p>Requested point: ${forecast.requestedLocation.latitude}°, ${forecast.requestedLocation.longitude}°. Returned grid point: ${esc(forecast.returnedLocation.latitude)}°, ${esc(forecast.returnedLocation.longitude)}°.</p><p>${sourceLink(forecast.requestUrl, 'Open the exact data request')} · <button id="gp-export" class="gp-text-button" type="button">Download data + provenance</button></p><p class="gp-small">Weather data: Open-Meteo, ECMWF, DWD, NOAA/NCEP · CC BY 4.0. Wind units converted and summaries calculated here.</p></div>`;
    $('gp-results').hidden = false;
    $('gp-hour').addEventListener('input', event => {
      selectedIndex = Number(event.target.value);
      root.querySelector('.gp-timeline strong').textContent = timeLabel(forecast.times[selectedIndex]);
      $('gp-chart').innerHTML = lineChart(forecast, metric, selectedIndex);
      const spread = modelSpread(forecast.models, 'wind_speed_10m', selectedIndex);
      $('gp-spread').textContent = `${number(spread)}${spread === null ? '' : ' m/s'}`;
      $('gp-selected-caption').textContent = `At ${timeLabel(forecast.times[selectedIndex])} · winds describe where the air comes from`;
      $('gp-values').innerHTML = tableRows(forecast, selectedIndex);
      $('gp-vectors').innerHTML = vectorReadings(forecast, selectedIndex);
    });
    $('gp-metric').addEventListener('change', event => { metric = event.target.value; renderData(); });
    $('gp-export').addEventListener('click', () => {
      const blob = new Blob([JSON.stringify(forecast, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a'); anchor.href = url; anchor.download = `GNARLYPIRATTE-${forecast.retrievedAt.slice(0, 10)}.json`; anchor.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    });
  }

  async function load() {
    controller?.abort(); controller = new AbortController();
    const requestController = controller;
    const requestTimeout = setTimeout(() => requestController.abort(), 20000);
    const generation = ++requestNumber;
    forecast = null; $('gp-results').hidden = true;
    $('gp-status').className = 'gp-loading'; $('gp-status').textContent = 'Fetching three public model forecasts…';
    try {
      const result = await fetchForecast(location, { signal: requestController.signal });
      if (disposed || generation !== requestNumber) return;
      forecast = result; selectedIndex = 0;
      $('gp-status').className = 'gp-success'; $('gp-status').textContent = 'Three models received. Compare their values at the same forecast time.';
      renderData();
    } catch (error) {
      if (disposed || generation !== requestNumber) return;
      const message = error.name === 'AbortError' ? 'The forecast request timed out. Please try again.' : error.message;
      $('gp-status').className = 'gp-error'; $('gp-status').textContent = `${message} No forecast is shown for this request.`;
    } finally {
      clearTimeout(requestTimeout);
    }
  }

  $('gp-form').addEventListener('submit', event => {
    event.preventDefault();
    try {
      location = validateLocation({ latitude: Number($('gp-lat').value), longitude: Number($('gp-lon').value) }); label = 'Selected coordinates'; syncLocation(); load();
    } catch (error) { $('gp-status').className = 'gp-error'; $('gp-status').textContent = error.message; }
  });
  $('gp-preset').addEventListener('change', event => {
    const preset = PRESETS[event.target.value];
    if (preset) { location = validateLocation(preset); label = preset.label; syncLocation(); load(); }
  });
  $('gp-map-center')?.addEventListener('click', () => onUseMapCenter());
  syncLocation(); load();
  return {
    setLocation(next, nextLabel = 'Selected map point') { if (disposed) return; location = validateLocation(next); label = nextLabel; syncLocation(); load(); },
    destroy() { disposed = true; controller?.abort(); host.innerHTML = ''; },
  };
}
