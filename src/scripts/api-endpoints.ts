import { Client } from '@notionhq/client';

const notion = new Client({
	auth: 'secret_P1YEBheytEkSTQnT126JOpZdo8WbsF2SxfsjnzcXFGr',
});

export async function queryDatabase(databaseId: string, filterInput?, sortInput?) {
	const response = await notion.databases.query({
		database_id: databaseId,
		filter: filterInput,
		sorts: sortInput,
	});
	return response;
}

export async function GetAllDatabases() {
	const response = await notion.search({
		filter: {
			property: 'object',
			value: 'database',
		},
	}).then((response) => {
        const formattedResponse = {
            display: response.results.map((result) => {
                return {
                    text: result.title[0].plain_text,
                    value: result.id,
                    icon: result.icon ? result.icon.file.url : null,
                    properties: result.properties,
                }
            }),
            full: response.results,
        }
        return formattedResponse;
    }
    );
    return response;
}


export async function CreatePage(pageInfo) {
    const response = await notion.pages.create(
        pageInfo);
    return response;
};
