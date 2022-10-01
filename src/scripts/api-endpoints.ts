import { Client, isFullDatabase, isFullPage } from '@notionhq/client'
import type { DatabaseObjectResponse } from '@notionhq/client/build/src/api-endpoints'

let notion: Client;

(async function setToken() {
	const s = await browser.storage.local.get('settings').then((result) => notion = new Client({ auth: result.settings.notionToken }))
})()

export async function queryDatabase(databaseId: string, filterInput?, sortInput?) {
	const response = await notion.databases.query({
		database_id: databaseId,
		filter: filterInput,
		sorts: sortInput,
	})
	console.log("FOCUS: ", response.results.map((result) => {
		if (isFullPage(result))
			Object.values(result.properties).find((prop) => prop.type === "title").title.length > 0 ? Object.values(result.properties).find((prop) => prop.type === "title").title[0].plain_text : "untitled"
	}))
	return response
}

const propFormatter = (result: DatabaseObjectResponse, prop: string) => {
	const propOptions = result.properties[prop][result.properties[prop].type]
	let props
	if (result.properties[prop].type === "select") {
		props = propOptions.options.map(option => {
			return {
				text: option.name,
				value: option.id,
				extras: {
					color: option.color
				}
			}
		})
	} else if (result.properties[prop].type === "multi_select") {
		props = propOptions.options.map(option => {
			return {
				text: option.name,
				value: option.id,
				extras: {
					color: option.color
				}
			}
		})
	} else if (result.properties[prop].type === "status") {
		let statusProps = propOptions.options.map(option => {
			return {
				text: option.name,
				value: option.id,
				extras: {
					color: option.color
				}
			}
		})
		
		/*
		for each group in propOptions.groups, create a an array with objects that have the group name as the groupHeader: and all statusProps whos value exists in propOptions.groups.option_ids
		*/
		props = propOptions.groups.map(group => {
			return {
				groupHeader: group.name,
				items: statusProps.filter(prop => group.option_ids.includes(prop.value))
			}
		})
	}
	return props
}


export async function GetAllDatabases() {
	const response = await notion.search({
		filter: {
			property: 'object',
			value: 'database',
		},
	}).then((result): DatabaseObjectResponse[] => {
		// ensures result is a DatabaseObjectResponse[]
		return result.results.filter((result): result is DatabaseObjectResponse => {
			return true
		})
	})
	const formattedResponse: SvelecteOption[] = response.map((result: DatabaseObjectResponse) => {
		return {
			text: result.title.length > 0 ? result.title[0].plain_text : "Untitled",
			value: result.id,
			icon: !result.icon ? null
				: result.icon.type === "emoji"
					? result.icon.emoji
					: result.icon.type === "file"
						? result.icon.file.url
						: result.icon.type === "external"
							? result.icon.external.url
							: null,
			extras: {
				props: Object.keys(result.properties).map(prop => {
					return {
						text: prop,
						value: result.properties[prop].id,
						extras: {
							type: result.properties[prop].type,
							options: propFormatter(result, prop)
						}

					}
				}),
				raw: result
			}
		}
	})
	console.log("Formatted Response: ", formattedResponse)
	return formattedResponse
}

export async function CreatePage(pageInfo) {
	const response = await notion.pages.create(pageInfo)
	return response
}
