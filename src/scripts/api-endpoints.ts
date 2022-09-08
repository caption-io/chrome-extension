import { Client, isFullDatabase, isFullPage } from '@notionhq/client'

const notion = new Client({
	auth: 'secret_P1YEBheytEkSTQnT126JOpZdo8WbsF2SxfsjnzcXFGr',
})

export async function queryDatabase(databaseId: string, filterInput?, sortInput?) {
	const response = await notion.databases.query({
		database_id: databaseId,
		filter: filterInput,
		sorts: sortInput,
	})
	return response
}

export async function GetAllDatabases() {
	const response = await notion.search({
		filter: {
			property: 'object',
			value: 'database',
		},
	})

	const formattedResponse = {
		display: response.results.map(result => {
			let icon
			if (isFullDatabase(result)) {
				const iconType = result.icon ? result.icon.type : 'noicon'
				switch (iconType) {
					case 'emoji':
						icon = result.icon.emoji
						break
					case 'file':
						icon = result.icon.file.url
						break
					case 'external':
						icon = result.icon.external.url
						break
					case 'noicon':
						icon = null
						break
				}
				return {
					text: result.title[0].plain_text,
					value: result.id,
					icon: icon,
					properties: result.properties,
				}
			}
		}),
		full: response.results,
	}
	return formattedResponse
}

export async function CreatePage(pageInfo) {
	const response = await notion.pages.create(pageInfo)
	return response
}
