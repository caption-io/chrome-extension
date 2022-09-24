import { writable } from "svelte/store";

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

export const colorMode = writable("light-mode");
export const isLoading = writable(true);
export const webData = writable(null);
export const selectedFlow = writable(null);
export const tooltip = writable({show: false, text: ""});

export const flows = writable([]);
export const settings = writable({});
