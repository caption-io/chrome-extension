import Organizer from "src/components/Organizer.svelte";

function restoreOptions() {
    chrome.storage.sync.get({ count: 0 } as IStorage, ({ count }: IStorage) => {
        const app = new Organizer({
            target: document.body,
            props: { count },
        });
    });
}

document.addEventListener("DOMContentLoaded", restoreOptions);
