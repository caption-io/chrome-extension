import { writable, type Writable } from "svelte/store";

function createFlows() {
    const { subscribe, set, update } = writable([]);

    return {
        subscribe,
        setFlows: flows => {
            set(flows);
        },
        newFlow: (flow) => update(flows => [...flows, flow]),
        removeFlow: (flow) => update(flows => flows.filter(f => f !== flow)),
        updateFlow: (flow) => update(flows => flows.map(f => f.id === flow.id ? flow : f))
    }
}

export const isLoading = writable(true);
export const webData = writable(null);
export const selectedFlow = writable(null);
export const flows: Writable<FlowData[]> = writable([]);
export const settings: Writable<UserSettings> = writable({
	defaultPopupFlow: null,
	defaultHighlightFlow: null,
	colorMode: 'light',
	notionToken: null
});

export const tags = writable([]);
export const appExpanded = writable(false);
export const maxSize = writable({ width: 0, height: 0 });
