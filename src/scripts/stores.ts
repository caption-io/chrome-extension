import { writable } from "svelte/store";

export const isLoading = writable(true);
export const webData = writable(null);