browser.action.onClicked.addListener((tab) => {
    browser.tabs.sendMessage(tab.id, {
        type: "popupModal",
    });
});

export {};
