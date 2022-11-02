// export async function getFlows() {
//     return await browser.storage.local.get("flows")
//         .then(result => {
//             return result.flows;
//         }).catch(error => {
//             console.log(error);
//         });
// }

export const getFlows = async (): Promise<Flow[]> => {
	return await browser.storage.local.get("flows")
		.then((result: Promise<UserBrowserStorage>) => result['flows'])
}

export const loadUser = async () => {
	return await browser.storage.local.get("outputProviders")
		.then((result: Promise<UserBrowserStorage>) => result['outputProviders'])
}



