import { Client, isFullDatabase, isFullPage } from '@notionhq/client'
import type { DatabaseObjectResponse } from '@notionhq/client/build/src/api-endpoints'
import { activeAccount, accountStore } from '../../platform/stores'
import { get } from 'svelte/store'


const readOnlyProps: PropTypes[] = ["rollup", "created_time", "last_edited_time", "created_by", "last_edited_by", "formula"]

function setToken() {
	let accts = get(accountStore)
	let acct = accts.find(acct => acct.id === get(activeAccount))

	return new Client({
		auth: acct.token
	})

}

export async function queryDatabase(databaseId: string, filterInput?, sortInput?) {
	let notion = setToken()
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
	let props: NotionSelectOption[] | NotionStatusOption[]
	if (result.properties[prop].type === "select") {
		props = propOptions.options.map((option): NotionSelectOption => {
			return {
				name: option.name,
				id: option.id,
				color: option.color
			}
		})
	} else if (result.properties[prop].type === "multi_select") {
		props = propOptions.options.map((option: NotionSelectOption) => {
			return {
				name: option.name,
				id: option.id,
				color: option.color
			}
		})
	} else if (result.properties[prop].type === "status") {
		let statusProps = propOptions.options.map((option): NotionSelectOption => {
			return {
				name: option.name,
				id: option.id,
				color: option.color
			}
		})
		props = propOptions.groups.map(group => {
			return {
				groupHeader: group.name,
				options: statusProps.filter(prop => group.option_ids.includes(prop.id))
			}
		})
	}
	return props
}



export async function GetAllDatabases(token: ProviderAccount['token']): Promise<OutputDestination[]> {
	let notion = setToken()
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
	const formattedResponse: OutputDestination[] = response.map((result: DatabaseObjectResponse): OutputDestination => {
		return {
			name: result.title.length > 0 ? result.title[0].plain_text : "Untitled",
			id: result.id,
			provider: "Notion",
			icon: !result.icon ? null
				: result.icon.type === "emoji"
					? result.icon.emoji
					: result.icon.type === "file"
						? result.icon.file.url
						: result.icon.type === "external"
							? result.icon.external.url
							: null,
			props: Object.keys(result.properties).map(prop => {
				return {
					name: prop,
					id: result.properties[prop].id,
					type: result.properties[prop].type,
					options: propFormatter(result, prop),
					readOnly: readOnlyProps.includes(result.properties[prop].type),
					visible: true,
					showAllCompatible: false,
					savedValue: null,
					savedInput: null
				}
			}),
			raw: result

		}
	})
	// push a pageIcon and coverImage prop entry to each database
	formattedResponse.forEach((database) => {
		database.props.push({
			name: "Page Icon",
			id: "pageIcon",
			type: "pageIcon",
			readOnly: false,
			visible: true,
			showAllCompatible: false,
			savedValue: null,
			savedInput: null
		})
		database.props.push({
			name: "Cover Image",
			id: "coverImage",
			type: "coverImage",
			readOnly: false,
			visible: true,
			showAllCompatible: false,
			savedValue: null,
			savedInput: null
		})
	})


	console.log("Formatted Response: ", formattedResponse)
	return formattedResponse
}

// export async function CreatePage(pageInfo) {
// 	const response = await notion.pages.create(pageInfo)
// 	return response
// }

// FUNCTIONS 

// FUNC: Get all Destinations
//! FUNCTIONS 