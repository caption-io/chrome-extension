export async function getFlows() {
    return await browser.storage.local.get("flows")
        .then(result => {
            return result.flows;
        }).catch(error => {
            console.log(error);
        });
}

export async function newFlows(flow) {
    const flows = await getFlows();
    chrome.storage.local.set({
        flows: [...flows, flow]
    })
}

export async function updateFlow(flow) {
    const flows = await getFlows();
    chrome.storage.local.set({
        flows: flows.map(f => f.id === flow.id ? flow : f)
    })
}

export async function findFlowById(id) {
    const flows = await getFlows();
    return flows.find(f => f.id === id);
}