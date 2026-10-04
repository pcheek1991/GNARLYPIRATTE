const __pluginConfig =  {
  "name": "windy-plugin-gnarlypiratte",
  "version": "0.1.0",
  "title": "GNARLYPIRATTE",
  "icon": "🏴‍☠️",
  "description": "A weather panel for the map center or a point you choose.",
  "author": "GNARLYPIRATTE contributors",
  "repository": "https://github.com/pcheek1991/GNARLYPIRATTE",
  "homepage": "https://github.com/pcheek1991/GNARLYPIRATTE#readme",
  "desktopUI": "rhpane",
  "desktopWidth": 480,
  "mobileUI": "fullscreen",
  "routerPath": "/gnarlypiratte/:lat?/:lon?",
  "addToContextmenu": true,
  "listenToSingleclick": true,
  "private": false,
  "built": 1791084964877,
  "builtReadable": "2026-10-04T03:36:04.877Z"
};

// transformCode: import bcast from '@windy/broadcast';
const bcast = W.broadcast;

// transformCode: import { map } from '@windy/map';
const { map } = W.map;

// transformCode: import { singleclick } from '@windy/singleclick';
const { singleclick } = W.singleclick;

// transformCode: import { setUrl } from '@windy/location';
const { setUrl } = W.location;


/** @returns {void} */
function noop() {}

function run(fn) {
	return fn();
}

function blank_object() {
	return Object.create(null);
}

/**
 * @param {Function[]} fns
 * @returns {void}
 */
function run_all(fns) {
	fns.forEach(run);
}

/**
 * @param {any} thing
 * @returns {thing is Function}
 */
function is_function(thing) {
	return typeof thing === 'function';
}

/** @returns {boolean} */
function safe_not_equal(a, b) {
	return a != a ? b == b : a !== b || (a && typeof a === 'object') || typeof a === 'function';
}

/** @returns {boolean} */
function is_empty(obj) {
	return Object.keys(obj).length === 0;
}

/**
 * @param {Node} target
 * @param {Node} node
 * @returns {void}
 */
function append(target, node) {
	target.appendChild(node);
}

/**
 * @param {Node} target
 * @param {string} style_sheet_id
 * @param {string} styles
 * @returns {void}
 */
function append_styles(target, style_sheet_id, styles) {
	const append_styles_to = get_root_for_style(target);
	if (!append_styles_to.getElementById(style_sheet_id)) {
		const style = element('style');
		style.id = style_sheet_id;
		style.textContent = styles;
		append_stylesheet(append_styles_to, style);
	}
}

/**
 * @param {Node} node
 * @returns {ShadowRoot | Document}
 */
function get_root_for_style(node) {
	if (!node) return document;
	const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
	if (root && /** @type {ShadowRoot} */ (root).host) {
		return /** @type {ShadowRoot} */ (root);
	}
	return node.ownerDocument;
}

/**
 * @param {ShadowRoot | Document} node
 * @param {HTMLStyleElement} style
 * @returns {CSSStyleSheet}
 */
function append_stylesheet(node, style) {
	append(/** @type {Document} */ (node).head || node, style);
	return style.sheet;
}

/**
 * @param {Node} target
 * @param {Node} node
 * @param {Node} [anchor]
 * @returns {void}
 */
function insert(target, node, anchor) {
	target.insertBefore(node, anchor || null);
}

/**
 * @param {Node} node
 * @returns {void}
 */
function detach(node) {
	if (node.parentNode) {
		node.parentNode.removeChild(node);
	}
}

/**
 * @template {keyof HTMLElementTagNameMap} K
 * @param {K} name
 * @returns {HTMLElementTagNameMap[K]}
 */
function element(name) {
	return document.createElement(name);
}

/**
 * @param {string} data
 * @returns {Text}
 */
function text(data) {
	return document.createTextNode(data);
}

/**
 * @returns {Text} */
function space() {
	return text(' ');
}

/**
 * @param {EventTarget} node
 * @param {string} event
 * @param {EventListenerOrEventListenerObject} handler
 * @param {boolean | AddEventListenerOptions | EventListenerOptions} [options]
 * @returns {() => void}
 */
function listen(node, event, handler, options) {
	node.addEventListener(event, handler, options);
	return () => node.removeEventListener(event, handler, options);
}

/**
 * @param {Element} node
 * @param {string} attribute
 * @param {string} [value]
 * @returns {void}
 */
function attr(node, attribute, value) {
	if (value == null) node.removeAttribute(attribute);
	else if (node.getAttribute(attribute) !== value) node.setAttribute(attribute, value);
}

/**
 * @param {Element} element
 * @returns {ChildNode[]}
 */
function children(element) {
	return Array.from(element.childNodes);
}

/**
 * @typedef {Node & {
 * 	claim_order?: number;
 * 	hydrate_init?: true;
 * 	actual_end_child?: NodeEx;
 * 	childNodes: NodeListOf<NodeEx>;
 * }} NodeEx
 */

/** @typedef {ChildNode & NodeEx} ChildNodeEx */

/** @typedef {NodeEx & { claim_order: number }} NodeEx2 */

/**
 * @typedef {ChildNodeEx[] & {
 * 	claim_info?: {
 * 		last_index: number;
 * 		total_claimed: number;
 * 	};
 * }} ChildNodeArray
 */

let current_component;

/** @returns {void} */
function set_current_component(component) {
	current_component = component;
}

function get_current_component() {
	if (!current_component) throw new Error('Function called outside component initialization');
	return current_component;
}

/**
 * The `onMount` function schedules a callback to run as soon as the component has been mounted to the DOM.
 * It must be called during the component's initialisation (but doesn't need to live *inside* the component;
 * it can be called from an external module).
 *
 * If a function is returned _synchronously_ from `onMount`, it will be called when the component is unmounted.
 *
 * `onMount` does not run inside a [server-side component](https://svelte.dev/docs#run-time-server-side-component-api).
 *
 * https://svelte.dev/docs/svelte#onmount
 * @template T
 * @param {() => import('./private.js').NotFunction<T> | Promise<import('./private.js').NotFunction<T>> | (() => any)} fn
 * @returns {void}
 */
function onMount(fn) {
	get_current_component().$$.on_mount.push(fn);
}

/**
 * Schedules a callback to run immediately before the component is unmounted.
 *
 * Out of `onMount`, `beforeUpdate`, `afterUpdate` and `onDestroy`, this is the
 * only one that runs inside a server-side component.
 *
 * https://svelte.dev/docs/svelte#ondestroy
 * @param {() => any} fn
 * @returns {void}
 */
function onDestroy(fn) {
	get_current_component().$$.on_destroy.push(fn);
}

const dirty_components = [];
const binding_callbacks = [];

let render_callbacks = [];

const flush_callbacks = [];

const resolved_promise = /* @__PURE__ */ Promise.resolve();

let update_scheduled = false;

/** @returns {void} */
function schedule_update() {
	if (!update_scheduled) {
		update_scheduled = true;
		resolved_promise.then(flush);
	}
}

/** @returns {void} */
function add_render_callback(fn) {
	render_callbacks.push(fn);
}

// flush() calls callbacks in this order:
// 1. All beforeUpdate callbacks, in order: parents before children
// 2. All bind:this callbacks, in reverse order: children before parents.
// 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
//    for afterUpdates called during the initial onMount, which are called in
//    reverse order: children before parents.
// Since callbacks might update component values, which could trigger another
// call to flush(), the following steps guard against this:
// 1. During beforeUpdate, any updated components will be added to the
//    dirty_components array and will cause a reentrant call to flush(). Because
//    the flush index is kept outside the function, the reentrant call will pick
//    up where the earlier call left off and go through all dirty components. The
//    current_component value is saved and restored so that the reentrant call will
//    not interfere with the "parent" flush() call.
// 2. bind:this callbacks cannot trigger new flush() calls.
// 3. During afterUpdate, any updated components will NOT have their afterUpdate
//    callback called a second time; the seen_callbacks set, outside the flush()
//    function, guarantees this behavior.
const seen_callbacks = new Set();

let flushidx = 0; // Do *not* move this inside the flush() function

/** @returns {void} */
function flush() {
	// Do not reenter flush while dirty components are updated, as this can
	// result in an infinite loop. Instead, let the inner flush handle it.
	// Reentrancy is ok afterwards for bindings etc.
	if (flushidx !== 0) {
		return;
	}
	const saved_component = current_component;
	do {
		// first, call beforeUpdate functions
		// and update components
		try {
			while (flushidx < dirty_components.length) {
				const component = dirty_components[flushidx];
				flushidx++;
				set_current_component(component);
				update(component.$$);
			}
		} catch (e) {
			// reset dirty state to not end up in a deadlocked state and then rethrow
			dirty_components.length = 0;
			flushidx = 0;
			throw e;
		}
		set_current_component(null);
		dirty_components.length = 0;
		flushidx = 0;
		while (binding_callbacks.length) binding_callbacks.pop()();
		// then, once components are updated, call
		// afterUpdate functions. This may cause
		// subsequent updates...
		for (let i = 0; i < render_callbacks.length; i += 1) {
			const callback = render_callbacks[i];
			if (!seen_callbacks.has(callback)) {
				// ...so guard against infinite loops
				seen_callbacks.add(callback);
				callback();
			}
		}
		render_callbacks.length = 0;
	} while (dirty_components.length);
	while (flush_callbacks.length) {
		flush_callbacks.pop()();
	}
	update_scheduled = false;
	seen_callbacks.clear();
	set_current_component(saved_component);
}

/** @returns {void} */
function update($$) {
	if ($$.fragment !== null) {
		$$.update();
		run_all($$.before_update);
		const dirty = $$.dirty;
		$$.dirty = [-1];
		$$.fragment && $$.fragment.p($$.ctx, dirty);
		$$.after_update.forEach(add_render_callback);
	}
}

/**
 * Useful for example to execute remaining `afterUpdate` callbacks before executing `destroy`.
 * @param {Function[]} fns
 * @returns {void}
 */
function flush_render_callbacks(fns) {
	const filtered = [];
	const targets = [];
	render_callbacks.forEach((c) => (fns.indexOf(c) === -1 ? filtered.push(c) : targets.push(c)));
	targets.forEach((c) => c());
	render_callbacks = filtered;
}

const outroing = new Set();

/**
 * @param {import('./private.js').Fragment} block
 * @param {0 | 1} [local]
 * @returns {void}
 */
function transition_in(block, local) {
	if (block && block.i) {
		outroing.delete(block);
		block.i(local);
	}
}

/** @typedef {1} INTRO */
/** @typedef {0} OUTRO */
/** @typedef {{ direction: 'in' | 'out' | 'both' }} TransitionOptions */
/** @typedef {(node: Element, params: any, options: TransitionOptions) => import('../transition/public.js').TransitionConfig} TransitionFn */

/**
 * @typedef {Object} Outro
 * @property {number} r
 * @property {Function[]} c
 * @property {Object} p
 */

/**
 * @typedef {Object} PendingProgram
 * @property {number} start
 * @property {INTRO|OUTRO} b
 * @property {Outro} [group]
 */

/**
 * @typedef {Object} Program
 * @property {number} a
 * @property {INTRO|OUTRO} b
 * @property {1|-1} d
 * @property {number} duration
 * @property {number} start
 * @property {number} end
 * @property {Outro} [group]
 */

/** @returns {void} */
function mount_component(component, target, anchor) {
	const { fragment, after_update } = component.$$;
	fragment && fragment.m(target, anchor);
	// onMount happens before the initial afterUpdate
	add_render_callback(() => {
		const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
		// if the component was destroyed immediately
		// it will update the `$$.on_destroy` reference to `null`.
		// the destructured on_destroy may still reference to the old array
		if (component.$$.on_destroy) {
			component.$$.on_destroy.push(...new_on_destroy);
		} else {
			// Edge case - component was destroyed immediately,
			// most likely as a result of a binding initialising
			run_all(new_on_destroy);
		}
		component.$$.on_mount = [];
	});
	after_update.forEach(add_render_callback);
}

/** @returns {void} */
function destroy_component(component, detaching) {
	const $$ = component.$$;
	if ($$.fragment !== null) {
		flush_render_callbacks($$.after_update);
		run_all($$.on_destroy);
		$$.fragment && $$.fragment.d(detaching);
		// TODO null out other refs, including component.$$ (but need to
		// preserve final state?)
		$$.on_destroy = $$.fragment = null;
		$$.ctx = [];
	}
}

/** @returns {void} */
function make_dirty(component, i) {
	if (component.$$.dirty[0] === -1) {
		dirty_components.push(component);
		schedule_update();
		component.$$.dirty.fill(0);
	}
	component.$$.dirty[(i / 31) | 0] |= 1 << i % 31;
}

// TODO: Document the other params
/**
 * @param {SvelteComponent} component
 * @param {import('./public.js').ComponentConstructorOptions} options
 *
 * @param {import('./utils.js')['not_equal']} not_equal Used to compare props and state values.
 * @param {(target: Element | ShadowRoot) => void} [append_styles] Function that appends styles to the DOM when the component is first initialised.
 * This will be the `add_css` function from the compiled component.
 *
 * @returns {void}
 */
function init(
	component,
	options,
	instance,
	create_fragment,
	not_equal,
	props,
	append_styles = null,
	dirty = [-1]
) {
	const parent_component = current_component;
	set_current_component(component);
	/** @type {import('./private.js').T$$} */
	const $$ = (component.$$ = {
		fragment: null,
		ctx: [],
		// state
		props,
		update: noop,
		not_equal,
		bound: blank_object(),
		// lifecycle
		on_mount: [],
		on_destroy: [],
		on_disconnect: [],
		before_update: [],
		after_update: [],
		context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
		// everything else
		callbacks: blank_object(),
		dirty,
		skip_bound: false,
		root: options.target || parent_component.$$.root
	});
	append_styles && append_styles($$.root);
	let ready = false;
	$$.ctx = instance
		? instance(component, options.props || {}, (i, ret, ...rest) => {
				const value = rest.length ? rest[0] : ret;
				if ($$.ctx && not_equal($$.ctx[i], ($$.ctx[i] = value))) {
					if (!$$.skip_bound && $$.bound[i]) $$.bound[i](value);
					if (ready) make_dirty(component, i);
				}
				return ret;
		  })
		: [];
	$$.update();
	ready = true;
	run_all($$.before_update);
	// `false` as a special case of no DOM component
	$$.fragment = create_fragment ? create_fragment($$.ctx) : false;
	if (options.target) {
		if (options.hydrate) {
			// TODO: what is the correct type here?
			// @ts-expect-error
			const nodes = children(options.target);
			$$.fragment && $$.fragment.l(nodes);
			nodes.forEach(detach);
		} else {
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			$$.fragment && $$.fragment.c();
		}
		if (options.intro) transition_in(component.$$.fragment);
		mount_component(component, options.target, options.anchor);
		flush();
	}
	set_current_component(parent_component);
}

/**
 * Base class for Svelte components. Used when dev=false.
 *
 * @template {Record<string, any>} [Props=any]
 * @template {Record<string, any>} [Events=any]
 */
class SvelteComponent {
	/**
	 * ### PRIVATE API
	 *
	 * Do not use, may change at any time
	 *
	 * @type {any}
	 */
	$$ = undefined;
	/**
	 * ### PRIVATE API
	 *
	 * Do not use, may change at any time
	 *
	 * @type {any}
	 */
	$$set = undefined;

	/** @returns {void} */
	$destroy() {
		destroy_component(this, 1);
		this.$destroy = noop;
	}

	/**
	 * @template {Extract<keyof Events, string>} K
	 * @param {K} type
	 * @param {((e: Events[K]) => void) | null | undefined} callback
	 * @returns {() => void}
	 */
	$on(type, callback) {
		if (!is_function(callback)) {
			return noop;
		}
		const callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
		callbacks.push(callback);
		return () => {
			const index = callbacks.indexOf(callback);
			if (index !== -1) callbacks.splice(index, 1);
		};
	}

	/**
	 * @param {Partial<Props>} props
	 * @returns {void}
	 */
	$set(props) {
		if (this.$$set && !is_empty(props)) {
			this.$$.skip_bound = true;
			this.$$set(props);
			this.$$.skip_bound = false;
		}
	}
}

/**
 * @typedef {Object} CustomElementPropDefinition
 * @property {string} [attribute]
 * @property {boolean} [reflect]
 * @property {'String'|'Boolean'|'Number'|'Array'|'Object'} [type]
 */

// generated during release, do not modify

const PUBLIC_VERSION = '4';

if (typeof window !== 'undefined')
	// @ts-ignore
	(window.__svelte || (window.__svelte = { v: new Set() })).v.add(PUBLIC_VERSION);

const config = {
    name: 'windy-plugin-gnarlypiratte',
    title: 'GNARLYPIRATTE'};

// Original GNARLYPIRATTE code, MIT. Forecast data carries its own attribution.
const MODELS = Object.freeze([
  { id: 'ecmwf_ifs025', name: 'ECMWF IFS 0.25°', agency: 'ECMWF', className: 'gp-ecmwf', source: 'https://www.ecmwf.int/en/forecasts/datasets/open-data' },
  { id: 'icon_global', name: 'ICON Global', agency: 'DWD', className: 'gp-icon', source: 'https://opendata.dwd.de/weather/nwp/' },
  { id: 'gfs_global', name: 'GFS Global', agency: 'NOAA / NCEP', className: 'gp-gfs', source: 'https://nomads.ncep.noaa.gov/' },
]);
const VARIABLES = Object.freeze(['temperature_2m', 'wind_speed_10m', 'wind_direction_10m', 'wind_gusts_10m', 'pressure_msl', 'precipitation']);
const EXPECTED_UNITS = { temperature_2m: '°C', wind_speed_10m: 'm/s', wind_direction_10m: '°', wind_gusts_10m: 'm/s', pressure_msl: 'hPa', precipitation: 'mm' };
const cache = new Map();
const CACHE_MS = 10 * 60 * 1000;

function validateLocation(location) {
  const latitude = location?.latitude;
  const longitude = location?.longitude;
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude) || latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
    throw new Error('Enter a latitude from −90 to 90 and longitude from −180 to 180.');
  }
  return { latitude, longitude };
}

function forecastUrl(location) {
  const point = validateLocation(location);
  const query = new URLSearchParams({ latitude: String(point.latitude), longitude: String(point.longitude), hourly: VARIABLES.join(','), models: MODELS.map(m => m.id).join(','), wind_speed_unit: 'ms', timezone: 'UTC', forecast_hours: '49', cell_selection: 'nearest' });
  return `https://api.open-meteo.com/v1/forecast?${query}`;
}

function windVector(speed, fromDegrees) {
  if (!Number.isFinite(speed) || speed < 0 || !Number.isFinite(fromDegrees)) return null;
  const radians = fromDegrees * Math.PI / 180;
  return { u: -speed * Math.sin(radians), v: -speed * Math.cos(radians) };
}

function finiteValue(value) {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function normalizeForecast(raw, location, requestUrl, retrievedAt = new Date().toISOString()) {
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

async function fetchForecast(location, { signal, force = false, fetchImpl = fetch } = {}) {
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

function rainWindow(model, startIndex = 0, hours = 24) {
  // Each precipitation timestamp is the sum for the preceding hour.
  // (t0, t24] contains indices 1..24; index 0 includes an earlier interval.
  const values = model.fields.precipitation.slice(startIndex + 1, startIndex + hours + 1);
  if (values.length !== hours || values.some(v => v === null)) return null;
  return values.reduce((sum, v) => sum + v, 0);
}

function modelSpread(models, variable, index) {
  const values = models.map(m => m.fields[variable][index]);
  if (values.some(v => v === null)) return null;
  return Math.max(...values) - Math.min(...values);
}

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

function mountPanel(host, { initialLocation = PRESETS.guam, locationLabel = 'Guam · Hagåtña', onUseMapCenter } = {}) {
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

var panelCss = ".gnarlypiratte { --gp-paper:#f8f6ef; --gp-card:#ffffff; --gp-ink:#203b46; --gp-muted:#566a73; --gp-line:#dce4e4; --gp-blue:#1765b6; --gp-coral:#bc453a; --gp-teal:#167d70; container-type:inline-size; color:var(--gp-ink); background:var(--gp-paper); font:15px/1.55 system-ui,-apple-system,\"Segoe UI\",sans-serif; min-width:0; }\n.gnarlypiratte * { box-sizing:border-box; }\n.gnarlypiratte h1,.gnarlypiratte h2,.gnarlypiratte h3,.gnarlypiratte p { margin:0; }\n.gnarlypiratte h1 { font-size:clamp(23px,4vw,40px); line-height:1.1; letter-spacing:-1.3px; overflow-wrap:anywhere; }\n.gnarlypiratte h2 { font-size:18px; line-height:1.3; margin-bottom:10px; }\n.gnarlypiratte h3 { font-size:17px; }\n.gnarlypiratte a { color:var(--gp-blue); text-decoration-thickness:1px; text-underline-offset:3px; }\n.gnarlypiratte button,.gnarlypiratte input,.gnarlypiratte select { font:inherit; }\n.gnarlypiratte button,.gnarlypiratte select { cursor:pointer; }\n.gnarlypiratte button:focus-visible,.gnarlypiratte input:focus-visible,.gnarlypiratte select:focus-visible,.gnarlypiratte summary:focus-visible { outline:3px solid var(--gp-blue); outline-offset:3px; }\n.gnarlypiratte .gp-header { padding:26px 24px 22px; border-bottom:1px solid var(--gp-line); position:relative; background:linear-gradient(115deg,#eef5f3,var(--gp-paper)); }\n.gnarlypiratte .gp-eyebrow { display:block; font-size:10px; font-weight:750; text-transform:uppercase; letter-spacing:2px; color:var(--gp-teal); margin-bottom:10px; }\n.gnarlypiratte .gp-brand { display:flex; align-items:center; gap:12px; }\n.gnarlypiratte .gp-flag { font-size:32px; color:var(--gp-coral); line-height:1; }\n.gnarlypiratte .gp-header p { margin:9px 0 14px; color:var(--gp-muted); }\n.gnarlypiratte .gp-badge { display:inline-block; border:1px solid #becfcd; border-radius:20px; padding:4px 10px; font-size:11px; color:var(--gp-teal); font-weight:650; }\n.gnarlypiratte .gp-layout { display:grid; grid-template-columns:minmax(0,1fr); }\n.gnarlypiratte .gp-controls { padding:24px; border-bottom:1px solid var(--gp-line); }\n.gnarlypiratte label { display:block; font-size:12px; font-weight:650; margin:8px 0; }\n.gnarlypiratte select,.gnarlypiratte input[type=number] { width:100%; min-height:42px; border:1px solid #becdce; color:var(--gp-ink); background:var(--gp-card); border-radius:8px; padding:8px 10px; }\n.gnarlypiratte .gp-coordinate-inputs { display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-top:8px; }\n.gnarlypiratte .gp-primary,.gnarlypiratte .gp-secondary { width:100%; padding:11px 14px; border-radius:8px; border:0; font-weight:700; margin:10px 0; }\n.gnarlypiratte .gp-primary { color:white; background:var(--gp-ink); }\n.gnarlypiratte .gp-primary:hover { background:#335762; }\n.gnarlypiratte .gp-secondary { background:#e8efec; border:1px solid var(--gp-line); color:var(--gp-ink); }\n.gnarlypiratte .gp-small { font-size:11px; color:var(--gp-muted); line-height:1.6; }\n.gnarlypiratte .gp-model-list { margin-top:26px; padding-top:22px; border-top:1px solid var(--gp-line); }\n.gnarlypiratte .gp-model-list > div { margin:13px 0; font-weight:650; font-size:12px; }\n.gnarlypiratte .gp-model-list small { display:block; color:var(--gp-muted); font-weight:400; padding-left:21px; }\n.gnarlypiratte .gp-key { display:inline-block; width:10px; height:10px; border-radius:50%; margin-right:7px; background:currentColor; vertical-align:baseline; }\n.gnarlypiratte .gp-ecmwf { color:var(--gp-blue); stroke:var(--gp-blue); }\n.gnarlypiratte .gp-icon { color:var(--gp-coral); stroke:var(--gp-coral); }\n.gnarlypiratte .gp-gfs { color:var(--gp-teal); stroke:var(--gp-teal); }\n.gnarlypiratte .gp-alerts { margin-top:25px; padding-top:22px; border-top:1px solid var(--gp-line); }\n.gnarlypiratte .gp-alerts p { font-size:12px; margin-bottom:10px; }\n.gnarlypiratte .gp-alerts a { display:block; margin:8px 0; font-size:12px; }\n.gnarlypiratte .gp-main { min-width:0; padding:24px; }\n.gnarlypiratte .gp-location { display:flex; flex-wrap:wrap; justify-content:space-between; gap:8px; align-items:baseline; }\n.gnarlypiratte .gp-location h2 { margin:0; font-size:22px; }\n.gnarlypiratte .gp-location > span { font-size:11px; color:var(--gp-muted); }\n.gnarlypiratte #gp-status { margin:10px 0 20px; font-size:12px; }\n.gnarlypiratte .gp-error { color:#9b2e27; padding:14px; background:#fff0eb; border:1px solid #ecc6ba; border-radius:8px; }\n.gnarlypiratte .gp-success { color:var(--gp-teal); }\n.gnarlypiratte .gp-summary { display:grid; grid-template-columns:1fr; gap:10px; margin-bottom:18px; }\n.gnarlypiratte .gp-summary > div { padding:14px 15px; background:var(--gp-card); border:1px solid var(--gp-line); border-radius:10px; }\n.gnarlypiratte .gp-summary span,.gnarlypiratte .gp-summary small { display:block; font-size:10px; color:var(--gp-muted); }\n.gnarlypiratte .gp-summary strong { display:block; font-size:23px; font-weight:750; margin:3px 0; }\n.gnarlypiratte .gp-chart-card { background:var(--gp-card); border:1px solid var(--gp-line); border-radius:12px; padding:18px; }\n.gnarlypiratte .gp-chart-heading { display:flex; flex-wrap:wrap; justify-content:space-between; align-items:center; gap:8px; }\n.gnarlypiratte .gp-chart-heading label { margin:0; color:var(--gp-muted); }\n.gnarlypiratte .gp-chart-heading select { min-height:34px; padding:5px 8px; margin-top:3px; font-size:11px; }\n.gnarlypiratte #gp-chart { margin:16px -8px 0; }\n.gnarlypiratte svg { display:block; width:100%; height:auto; }\n.gnarlypiratte svg text { fill:var(--gp-muted); font:11px system-ui,sans-serif; }\n.gnarlypiratte .gp-line { fill:none; stroke-width:2.5; stroke-linejoin:round; stroke-linecap:round; }\n.gnarlypiratte .gp-line.gp-icon { stroke-dasharray:8 4; }\n.gnarlypiratte .gp-line.gp-gfs { stroke-dasharray:3 3; }\n.gnarlypiratte .gp-dot { fill:white; stroke-width:2.5; }\n.gnarlypiratte .gp-grid { stroke:#e5e9e9; stroke-width:1; }\n.gnarlypiratte .gp-cursor { stroke:#9bacb1; stroke-width:1; stroke-dasharray:3 4; }\n.gnarlypiratte .gp-timeline label { display:flex; flex-wrap:wrap; justify-content:space-between; gap:6px; }\n.gnarlypiratte input[type=range] { width:100%; accent-color:var(--gp-ink); cursor:pointer; }\n.gnarlypiratte .gp-legend { display:flex; flex-wrap:wrap; gap:8px 15px; font-size:10px; margin-top:10px; }\n.gnarlypiratte .gp-table-scroll { overflow:auto; margin:18px 0; background:var(--gp-card); border:1px solid var(--gp-line); border-radius:10px; }\n.gnarlypiratte table { width:100%; min-width:650px; border-collapse:collapse; font-size:11px; text-align:right; }\n.gnarlypiratte caption { text-align:left; padding:13px; background:#edf2ef; font-size:11px; color:var(--gp-muted); }\n.gnarlypiratte th,.gnarlypiratte td { padding:12px 9px; border-bottom:1px solid var(--gp-line); white-space:nowrap; }\n.gnarlypiratte th { font-weight:650; }\n.gnarlypiratte th:first-child { text-align:left; }\n.gnarlypiratte tbody tr:last-child th,.gnarlypiratte tbody tr:last-child td { border-bottom:0; }\n.gnarlypiratte .gp-rain { margin:21px 0; }\n.gnarlypiratte .gp-rain > p { font-size:11px; color:var(--gp-muted); margin:4px 0 12px; }\n.gnarlypiratte .gp-rain > div { display:grid; grid-template-columns:1fr; gap:10px; }\n.gnarlypiratte .gp-rain article { padding:14px; border-left:3px solid var(--gp-blue); border-radius:0 8px 8px 0; background:#eaf1f7; }\n.gnarlypiratte .gp-rain article:nth-child(2) { border-color:var(--gp-coral); background:#f8eeeb; }\n.gnarlypiratte .gp-rain article:nth-child(3) { border-color:var(--gp-teal); background:#e7f1ec; }\n.gnarlypiratte .gp-rain span,.gnarlypiratte .gp-rain small { display:block; font-size:10px; }\n.gnarlypiratte .gp-rain strong { display:block; font-size:24px; margin:3px 0; }\n.gnarlypiratte .gp-details { border-top:1px solid var(--gp-line); padding-top:16px; margin-top:20px; }\n.gnarlypiratte summary { cursor:pointer; font-weight:650; font-size:13px; }\n.gnarlypiratte .gp-details p { font-size:12px; margin:12px 0; }\n.gnarlypiratte .gp-formula { font-family:ui-monospace,monospace; font-size:12px; background:#eaf0ed; padding:15px; margin-top:12px; border-radius:8px; }\n.gnarlypiratte .gp-provenance { font-size:11px; color:var(--gp-muted); margin-top:22px; }\n.gnarlypiratte .gp-provenance p { margin:10px 0; overflow-wrap:anywhere; }\n.gnarlypiratte .gp-text-button { border:0; background:transparent; padding:0; color:var(--gp-blue); text-decoration:underline; text-underline-offset:3px; font-size:inherit; }\n.gnarlypiratte .gp-use-note { border:1px solid #d8d8b7; background:#f3f1dd; border-radius:8px; padding:13px; margin-top:18px; font-size:11px; }\n.gnarlypiratte footer { border-top:1px solid var(--gp-line); padding:18px 24px; font-size:11px; color:var(--gp-muted); }\n.gnarlypiratte footer span { display:block; margin-top:4px; }\n@container (min-width:600px) { .gnarlypiratte .gp-summary { grid-template-columns:repeat(3,minmax(0,1fr)); } .gnarlypiratte .gp-rain > div { grid-template-columns:repeat(3,minmax(0,1fr)); } }\n@container (min-width:850px) { .gnarlypiratte .gp-layout { grid-template-columns:260px minmax(0,1fr); } .gnarlypiratte .gp-controls { border-bottom:0; border-right:1px solid var(--gp-line); } .gnarlypiratte .gp-header { padding:30px 28px; } .gnarlypiratte .gp-badge { position:absolute; right:28px; top:34px; } .gnarlypiratte .gp-header p { margin-bottom:0; } .gnarlypiratte .gp-main { padding:26px; } }\n";

/* src\plugin.svelte generated by Svelte v4.2.20 */

function add_css(target) {
	append_styles(target, "svelte-11fqhid", ".gnarlypiratte-windy.svelte-11fqhid{padding:0;min-height:100%;background:#f8f6ef}.plugin__title.svelte-11fqhid{margin:0;padding:10px 16px;background:#f8f6ef}.gnarlypiratte-menu.svelte-11fqhid{padding:0;border:0;background:transparent;color:#304654;font:inherit;font-size:13px;cursor:pointer}.gnarlypiratte-menu.svelte-11fqhid:focus-visible{outline:2px solid #304654;outline-offset:4px}");
}

function create_fragment(ctx) {
	let div0;
	let t1;
	let section;
	let div1;
	let button;
	let t3;
	let div2;
	let mounted;
	let dispose;

	return {
		c() {
			div0 = element("div");
			div0.textContent = `${config.title}`;
			t1 = space();
			section = element("section");
			div1 = element("div");
			button = element("button");
			button.textContent = "‹ Back to Windy menu";
			t3 = space();
			div2 = element("div");
			attr(div0, "class", "plugin__mobile-header");
			attr(button, "type", "button");
			attr(button, "class", "gnarlypiratte-menu svelte-11fqhid");
			attr(div1, "class", "plugin__title svelte-11fqhid");
			attr(section, "class", "plugin__content gnarlypiratte-windy svelte-11fqhid");
		},
		m(target, anchor) {
			insert(target, div0, anchor);
			insert(target, t1, anchor);
			insert(target, section, anchor);
			append(section, div1);
			append(div1, button);
			append(section, t3);
			append(section, div2);
			/*div2_binding*/ ctx[4](div2);
			/*section_binding*/ ctx[5](section);

			if (!mounted) {
				dispose = listen(button, "click", /*backToMenu*/ ctx[2]);
				mounted = true;
			}
		},
		p: noop,
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) {
				detach(div0);
				detach(t1);
				detach(section);
			}

			/*div2_binding*/ ctx[4](null);
			/*section_binding*/ ctx[5](null);
			mounted = false;
			dispose();
		}
	};
}

function normalizeLocation(value) {
	if (!value || typeof value !== 'object') return null;
	const latitude = Number(value.latitude ?? value.lat);
	const rawLongitude = Number(value.longitude ?? value.lon ?? value.lng);
	if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90 || !Number.isFinite(rawLongitude)) return null;
	const longitude = ((rawLongitude + 180) % 360 + 360) % 360 - 180;
	return { latitude, longitude };
}

function instance($$self, $$props, $$invalidate) {
	let wrapperHost;
	let panelHost;
	let panel;
	let styleElement;
	let selectedLocation;
	let selectedLabel = 'Windy map center';

	function selectLocation(location, label, updateRoute = false) {
		const next = normalizeLocation(location);
		if (!next) return;
		const same = selectedLocation && selectedLocation.latitude === next.latitude && selectedLocation.longitude === next.longitude && selectedLabel === label;
		selectedLocation = next;
		selectedLabel = label;
		if (panel && !same) panel.setLocation(next, label);

		if (updateRoute && !same) {
			setUrl(config.name, { lat: next.latitude, lon: next.longitude });
		}
	}

	function useMapCenter(updateRoute = true) {
		selectLocation(map.getCenter(), 'Windy map center', updateRoute);
	}

	function handleMapClick(location) {
		selectLocation(location, 'Selected map point', true);
	}

	function backToMenu() {
		bcast.emit('rqstOpen', 'menu');
	}

	const onopen = params => {
		const location = normalizeLocation(params);
		if (location) selectLocation(location, 'Selected map point'); else useMapCenter(false);
	};

	onMount(() => {
		styleElement = document.createElement('style');
		styleElement.dataset.gnarlypiratte = 'panel';
		styleElement.textContent = panelCss;
		wrapperHost.appendChild(styleElement);

		if (!selectedLocation) {
			selectedLocation = normalizeLocation(map.getCenter());
			selectedLabel = 'Windy map center';
		}

		panel = mountPanel(panelHost, {
			initialLocation: selectedLocation,
			locationLabel: selectedLabel,
			onUseMapCenter: useMapCenter
		});

		singleclick.on(config.name, handleMapClick);
	});

	onDestroy(() => {
		singleclick.off(config.name, handleMapClick);
		panel?.destroy();
		panel = undefined;
		styleElement?.remove();
	});

	function div2_binding($$value) {
		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
			panelHost = $$value;
			$$invalidate(1, panelHost);
		});
	}

	function section_binding($$value) {
		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
			wrapperHost = $$value;
			$$invalidate(0, wrapperHost);
		});
	}

	return [wrapperHost, panelHost, backToMenu, onopen, div2_binding, section_binding];
}

class Plugin extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance, create_fragment, safe_not_equal, { onopen: 3 }, add_css);
	}

	get onopen() {
		return this.$$.ctx[3];
	}
}


// transformCode: Export statement was modified
export { __pluginConfig, Plugin as default };
//# sourceMappingURL=plugin.js.map
