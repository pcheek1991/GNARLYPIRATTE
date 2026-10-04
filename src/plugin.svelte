<div class="plugin__mobile-header">{config.title}</div>

<section bind:this={wrapperHost} class="plugin__content gnarlypiratte-windy">
    <div class="plugin__title">
        <button type="button" class="gnarlypiratte-menu" on:click={backToMenu}>
            ‹ Back to Windy menu
        </button>
    </div>
    <div bind:this={panelHost}></div>
</section>

<script>
    import bcast from '@windy/broadcast';
    import { map } from '@windy/map';
    import { singleclick } from '@windy/singleclick';
    import { setUrl } from '@windy/location';
    import { onMount, onDestroy } from 'svelte';
    import config from './pluginConfig.ts';
    import { mountPanel } from './panel.js';
    import panelCss from './panel.css';

    let wrapperHost;
    let panelHost;
    let panel;
    let styleElement;
    let selectedLocation;
    let selectedLabel = 'Windy map center';

    // Documented Windy events use {lat, lon}; LeafletGL center uses {lat, lng}.
    function normalizeLocation(value) {
        if (!value || typeof value !== 'object') return null;
        const latitude = Number(value.latitude ?? value.lat);
        const rawLongitude = Number(value.longitude ?? value.lon ?? value.lng);
        if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90 || !Number.isFinite(rawLongitude)) return null;
        const longitude = ((rawLongitude + 180) % 360 + 360) % 360 - 180;
        return { latitude, longitude };
    }

    function selectLocation(location, label, updateRoute = false) {
        const next = normalizeLocation(location);
        if (!next) return;
        const same = selectedLocation &&
            selectedLocation.latitude === next.latitude &&
            selectedLocation.longitude === next.longitude &&
            selectedLabel === label;
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

    // May run repeatedly; listeners are installed only in onMount.
    export const onopen = (params) => {
        const location = normalizeLocation(params);
        if (location) selectLocation(location, 'Selected map point');
        else useMapCenter(false);
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
            onUseMapCenter: useMapCenter,
        });
        singleclick.on(config.name, handleMapClick);
    });

    onDestroy(() => {
        singleclick.off(config.name, handleMapClick);
        panel?.destroy();
        panel = undefined;
        styleElement?.remove();
    });
</script>

<style>
    .gnarlypiratte-windy {
        padding: 0;
        min-height: 100%;
        background: #f8f6ef;
    }
    .plugin__title {
        margin: 0;
        padding: 10px 16px;
        background: #f8f6ef;
    }
    .gnarlypiratte-menu {
        padding: 0;
        border: 0;
        background: transparent;
        color: #304654;
        font: inherit;
        font-size: 13px;
        cursor: pointer;
    }
    .gnarlypiratte-menu:focus-visible {
        outline: 2px solid #304654;
        outline-offset: 4px;
    }
</style>
