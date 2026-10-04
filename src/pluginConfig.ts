import type { ExternalPluginConfig } from '@windy/interfaces';

const config: ExternalPluginConfig = {
    name: 'windy-plugin-gnarlypiratte',
    version: '0.1.0',
    title: 'GNARLYPIRATTE',
    icon: '🏴‍☠️',
    description: 'A weather panel for the map center or a point you choose.',
    author: 'GNARLYPIRATTE contributors',
    repository: 'https://github.com/pcheek1991/GNARLYPIRATTE',
    homepage: 'https://github.com/pcheek1991/GNARLYPIRATTE#readme',
    desktopUI: 'rhpane',
    desktopWidth: 480,
    mobileUI: 'fullscreen',
    routerPath: '/gnarlypiratte/:lat?/:lon?',
    addToContextmenu: true,
    listenToSingleclick: true,
    private: false,
};

export default config;
