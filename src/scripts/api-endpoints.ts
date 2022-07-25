import { Client } from '@notionhq/client';

const notion = new Client({
	auth: 'secret_P1YEBheytEkSTQnT126JOpZdo8WbsF2SxfsjnzcXFGr',
});

// SECTION: Database Query

export async function queryDatabase(databaseId: string, filterInput?, sortInput?) {
	const response = await notion.databases.query({
		database_id: databaseId,
		filter: filterInput,
		sorts: sortInput,
	});
	return response;
}

// !SECTION

// SECTION - Search - Get all databases

export async function GetAllDatabases() {
	const response = await notion.search({
		filter: {
			property: 'object',
			value: 'database',
		},
	}).then((response) => {
        return response;
    }
    );
	return response;
}

// !SECTION
// database update

// database create

// database retrieve

// page retrieve

// page create

// page updaate

// block retrieve

// block update

// block children retrieve

// block children append

// comment retrieve

// comment create

// user retrieve

// user list all

// user token bot retrieve
