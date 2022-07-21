import type { IStorage } from "src/types";

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.get({ count: 0 } as IStorage, ({ count }: IStorage) => {
        console.log("background", count);
    });
});
