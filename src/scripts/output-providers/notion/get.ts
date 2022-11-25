import { Client, isFullDatabase, isFullPage } from '@notionhq/client'
import { type DatabaseObjectResponse, type QueryDatabaseResponse, type PageObjectResponse, getPage } from '@notionhq/client/build/src/api-endpoints'
import { activeAccount, accountStore, flowStore } from '../../platform/stores'
import { get } from 'svelte/store'


const readOnlyProps: PropTypes[] = ["rollup", "created_time", "last_edited_time", "created_by", "last_edited_by", "formula"]

function isDatabaseObject(data: any): data is QueryDatabaseResponse {
	return data.title !== undefined
}
function isPageObjectResponse(data: any): data is PageObjectResponse {
	return data.title !== undefined
}
function setToken(token: ProviderAccount['token'] = null) {
	let accts = get(accountStore)
	let acct = accts.find(acct => acct.id === get(activeAccount))
	if (token) {
		return new Client({ auth: token })
	} else {
		return new Client({
			auth: acct.token
		})
	}

}

export async function queryDatabase(databaseId: string, filterInput?, sortInput?) {
	let notion = setToken()
	const response = await notion.databases.query({
		database_id: databaseId,
		filter: filterInput,
		sorts: sortInput,
	})
	return response.results.map((result) => {
		return getPages(result.id).then(page => {
			return {
				name: page.id,
				id: page.id,
			}
		})
	})
}

async function getPages(pageid: string) {
	let notion = setToken()
	let page = await notion.pages.retrieve({
		page_id: pageid
	}).then(page => {
		return page
	})
	return Promise.resolve(page)
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
			provider: "notion",
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
					savedInput: null,
					requestFunction: result.properties[prop].type === "relation" ? { func: "queryDatabase", args: [result.properties[prop].relation.database_id] } : null,
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
		database.props.push({
			name: "Page Content",
			id: "pageContent",
			type: "pageContent",
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