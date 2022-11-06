declare type PreparsedData = { items: { item: string, source: string[] }[], type: string[] }

// twitter handle
const twitter = {
	twPlayer: document.querySelector('meta[name="twitter:player"]')?.getAttribute('content'),
	twCreator: document.querySelector('meta[name="twitter:creator"]')?.getAttribute('content'),
	twSite: document.querySelector('meta[name="twitter:site"]')?.getAttribute('content'),
}

export function parseRecipe() {
	let recipe = document.querySelectorAll('script[type="application/ld+json"]')
	return recipe
}

export function getWebData(): InputProviderData {

	function stringParser(p: PreparsedData): InputItem[] {
		const pFiltered = p.items.filter((title) => {
			return title.item !== null && title.item !== undefined && title.item !== ""
		})
		// combine entries with duplicate text and combine sources into one array

		const pUnique = pFiltered.reduce((acc, cur) => {
			const found = acc.find((item) => item.item === cur.item)
			if (found) {
				found.source = [...found.source, ...cur.source]
			} else {
				acc.push(cur)
			}
			return acc
		}, [])

		//add type to each entry
		const pTyped = pUnique.map((item) => {
			return { ...item, type: p.type }
		})


		return pTyped
	}

	// GRP: Title

	const parseTitle: PreparsedData =
	{
		items: [
			{ item: document.querySelector('meta[property="og:title"]')?.getAttribute('content'), source: ["OpenGraph"] },
			{ item: document.querySelector('meta[property="al:web:title"]')?.getAttribute('content'), source: ["Facebook"] },
			{ item: document.querySelector('meta[property="twitter:title"]')?.getAttribute('content'), source: ["Twitter"] },
			{ item: document.querySelector('title')?.textContent, source: ["Tag: Title"] },
			{ item: document.querySelector('meta[name="title"]')?.textContent, source: ["Meta: Title"] },
			{ item: document.querySelector('meta[name="parsely-title"]')?.getAttribute('content'), source: ["Parsely"] },
			// ytData.title ? ytData.title : { item: null, source: ["Youtube Title"] },
		],
		type: ["title", "text"]
	}

	const parseYoutube: PreparsedData =
	{
		items: [
			{ item: document.querySelector('#info h1[class*="title"]')?.textContent, source: ["YouTube Title"] },
			{ item: document.querySelector('#channel-name #text')?.textContent, source: ["YouTube Channel"] },
			{ item: document.querySelector('#avatar > img')?.getAttribute('src'), source: ["YouTube Icon"] },
			{ item: document.querySelector('#owner-sub-count')?.textContent, source: ["YouTube Sub Count"] },
			{ item: document.querySelector('#contents:nth-child(1) > yt-formatted-string')?.textContent, source: ["YouTube Top Comment"] }
		],
		type: ["video", "text"]
	}

	const youtube = stringParser(parseYoutube)
	// remove titles where text is null, undefined, or does not exist

	const titles = stringParser(parseTitle)


	// GRP: URL
	const parseUrl: PreparsedData =
	{
		items: [
			{ item: document.querySelector('meta[property="og:url"]')?.getAttribute('content'), source: ["OpenGraph"] },
			{ item: document.querySelector('meta[property="al:web:url"]')?.getAttribute('content'), source: ["Facebook"] },
			{ item: document.querySelector('meta[name="parsely-link"]')?.getAttribute('content'), source: ["Parsely"] },
			{ item: window.location.href, source: ["Document"] },
		],
		type: ["url", "string"]
	}

	// remove urls where text is null, undefined, or does not exist
	const urls = stringParser(parseUrl)

	// get domain from url
	const domains = urls.map((url): InputItem => {
		const domain = new URL(url.item).hostname
		return { item: "https://" + domain, source: url.source, type: ["domain", "text"] }
	})




	// GRP: Icons

	const parseIcons: PreparsedData =
	{
		items: [
			{ item: iconUrlChecker(document.querySelector('link[rel="icon"]')?.getAttribute('href')), source: ["Link Icon"] },
			{ item: iconUrlChecker(document.querySelector('link[rel="shortcut icon"]')?.getAttribute('href')), source: ["Link Shortcut Icon"] },
			{ item: iconUrlChecker(document.querySelector('link[rel="apple-touch-icon"]')?.getAttribute('href')), source: ["Apple Touch Icon"] },
			{ item: iconUrlChecker(document.querySelector('link[rel="mask-icon"]')?.getAttribute('href')), source: ["Mask Icon"] }
		],
		type: ["icon", "text"]
	}

	function iconUrlChecker(icon) {
		if (!icon) return
		if (icon.startsWith("http")) return icon
		if (icon.startsWith("//")) return "https:" + icon
		if (icon.startsWith("/")) return new URL(icon, window.location.href).href

	}
	const icons = stringParser(parseIcons)



	// GRP: Recipe
	const parseRecipe: PreparsedData =
	{
		items: [
			{ item: document.querySelector('script[type="application/ld+json"]')?.innerHTML ? JSON.parse(document.querySelector('script[type="application/ld+json"]')?.innerHTML) : null, source: ["JSON-LD"] },
			{ item: document.querySelector('meta[property="og:recipe:ingredients"]')?.getAttribute('content'), source: ["OpenGraph"] },
			{ item: document.querySelector('meta[property="og:recipe:instructions"]')?.getAttribute('content'), source: ["OpenGraph"] },
			{ item: document.querySelector('meta[property="og:recipe:yield"]')?.getAttribute('content'), source: ["OpenGraph"] },
			{ item: document.querySelector('meta[property="og:recipe:duration"]')?.getAttribute('content'), source: ["OpenGraph"] },
			{ item: document.querySelector('meta[property="og:recipe:calories"]')?.getAttribute('content'), source: ["OpenGraph"] },
			{ item: document.querySelector('meta[property="og:recipe:author"]')?.getAttribute('content'), source: ["OpenGraph"] },
			{ item: document.querySelector('meta[property="og:recipe:category"]')?.getAttribute('content'), source: ["OpenGraph"] },
			{ item: document.querySelector('meta[property="og:recipe:cuisine"]')?.getAttribute('content'), source: ["OpenGraph"] },
			{ item: document.querySelector('meta[property="og:recipe:tags"]')?.getAttribute('content'), source: ["OpenGraph"] }
		],
		type: ["recipe", "text"]
	}

	const recipe = stringParser(parseRecipe)



	// GRP: Description
	const parseDescription: PreparsedData = {
		items: [
			{ item: document.querySelector('meta[property="og:description"]')?.getAttribute('content'), source: ["OpenGraph"] },
			{ item: document.querySelector('meta[property="al:web:description"]')?.getAttribute('content'), source: ["Facebook"] },
			{ item: document.querySelector('meta[name="description"]')?.getAttribute('content'), source: ["Meta Tag"] },
			{ item: document.querySelector('meta[name="parsely-description"]')?.getAttribute('content'), source: ["Parsely"] },
			{ item: document.querySelector('meta[property="twitter:description"]')?.getAttribute('content'), source: ["Twitter"] },
		],
		type: ["description", "text"]
	}

	// remove descriptions where text is null, undefined, or does not exist
	const descriptions = stringParser(parseDescription)


	// GRP: Thumbnail
	const parseThumbnail: PreparsedData =
	{
		items: [
			{ item: document.querySelector('meta[property="og:image"]')?.getAttribute('content'), source: ["OpenGraph"] },
			{ item: document.querySelector('meta[property="al:web:image"]')?.getAttribute('content'), source: ["Facebook"] },
			{ item: document.querySelector('meta[name="parsely-image-url"]')?.getAttribute('content'), source: ["Parsely"] },
			{ item: document.querySelector('meta[property="twitter:image"]')?.getAttribute('content'), source: ["Twitter"] },
			{ item: document.querySelector('meta[property="twitter:image:src"]')?.getAttribute('content'), source: ["Twitter"] },
			{ item: document.querySelector('meta[name="thumbnail"]')?.getAttribute('content'), source: ["Meta Tag"] },
		],
		type: ["image", "url", "text"]
	}


	const thumbnails = stringParser(parseThumbnail)


	// GRP: Site Name
	const parseSiteName: PreparsedData =
	{
		items: [
			{ item: document.querySelector('meta[property="og:site_name"]')?.getAttribute('content'), source: ["OpenGraph"] },
			{ item: document.querySelector('meta[property="al:web:site_name"]')?.getAttribute('content'), source: ["Facebook"] },
			{ item: document.querySelector('meta[name="parsely-site"]')?.getAttribute('content'), source: ["Parsely"] },
			{ item: document.querySelector('meta[name="twitter:app:name:iphone"]')?.getAttribute('content'), source: ["Twitter: App Name"] },
			{ item: document.querySelector('meta[property="al:ios:app_name"]')?.getAttribute('content'), source: ["Facebook: App Name"] },
			{ item: document.querySelector('meta[name="twitter:app:name:googleplay"]')?.getAttribute('content'), source: ["Twitter: App Name"] },
			{ item: document.querySelector('meta[name="twitter:app:name:amazon"]')?.getAttribute('content'), source: ["Twitter: App Name"] },
		],
		type: ["site_name", "text"]
	}

	const siteNames = stringParser(parseSiteName)


	// GRP: Author
	const parseAuthor: PreparsedData = {
		items: [
			{ item: document.querySelector('meta[property="article:author"]')?.getAttribute('content'), source: ["Meta Tag"] },
			{ item: document.querySelector('meta[property="al:web:author"]')?.getAttribute('content'), source: ["Facebook"] },
			{ item: document.querySelector('meta[name="parsely-author"]')?.getAttribute('content'), source: ["Parsely"] },
			{ item: document.querySelector('meta[name="author"]')?.getAttribute('content'), source: ["Meta Tag"] },
			// ytData.author ? ytData.author : { item: null, source: ["YouTube Author"] },
		],
		type: ["author", "text"]
	}

	const authors = stringParser(parseAuthor)


	// GRP: Published Date
	const parsePubDate: PreparsedData =
	{
		items: [
			{ item: document.querySelector('meta[property="article:published_time"]')?.getAttribute('content'), source: ["Meta Article Published Time"] },
			{ item: document.querySelector('meta[property="al:web:published_time"]')?.getAttribute('content'), source: ["Facebook"] },
			{ item: document.querySelector('meta[name="parsely-pub-date"]')?.getAttribute('content'), source: ["Parsely"] },
			{ item: document.querySelector('meta[name="date"]')?.getAttribute('content'), source: ["Meta Date"] },
		],
		type: ["date", "text"]
	}

	const pubDates = stringParser(parsePubDate)


	// GRP: Modified Date
	const parseModDate: PreparsedData =
	{
		items: [
			{ item: document.querySelector('meta[property="article:modified_time"]')?.getAttribute('content'), source: ["Meta Article Modified Time"] },
			{ item: document.querySelector('meta[property="al:web:modified_time"]')?.getAttribute('content'), source: ["Facebook"] },
			{ item: document.querySelector('meta[name="parsely-modified"]')?.getAttribute('content'), source: ["Parsely"] },
			{ item: document.querySelector('meta[name="last-modified"]')?.getAttribute('content'), source: ["Meta Last Modified"] },
		],
		type: ["date", 'text']
	}

	const modDates = stringParser(parseModDate)


	// GRP: Type
	const parseType: PreparsedData =
	{
		items: [
			{ item: document.querySelector('meta[property="og:type"]')?.getAttribute('content'), source: ["OpenGraph"] },
			{ item: document.querySelector('meta[property="al:web:type"]')?.getAttribute('content'), source: ["Facebook"] },
			{ item: document.querySelector('meta[name="parsely-type"]')?.getAttribute('content'), source: ["Parsely"] },
		],
		type: ["text", "website"]
	}

	const types = stringParser(parseType)


	// GRP: Twitter Handle
	const parseTwitterHandle: PreparsedData =
	{
		items: [
			{ item: document.querySelector('meta[property="twitter:site"]')?.getAttribute('content'), source: ["Twitter Site"] },
			{ item: document.querySelector('meta[property="twitter:creator"]')?.getAttribute('content'), source: ["Twitter Creator"] },
			{ item: document.querySelector('meta[property="twitter:player"]')?.getAttribute('content'), source: ["Twitter iOS App ID"] },
		],
		type: ["twitter", "url", "text"]

	}

	const twitterHandles = stringParser(parseTwitterHandle)
	const twitterLinks = twitterHandles.map((handle): InputItem => {
		return { item: `https://twitter.com/${handle.item.replace('@', '')}`, source: handle.source, type: ["url", "text"] }
	})



	// GRP: Videos
	const parseVideos: PreparsedData = {
		items: [
			{ item: document.querySelector('iframe[src^="https://www.youtube"]')?.getAttribute('src').replace("embed/", "watch?v="), source: ["Embedded YouTube Source"] }
		], type: ["video", "url", "text"]
	}

	const videos = stringParser(parseVideos)




	let groups: InputProviderData = [{
		label: "Title",
		items: titles,
		type: ["title"],
	}, {
		label: "URL",
		items: urls,
		type: ["url"],
	}, {
		label: "Icon",
		items: icons,
		type: ["icon"],
	}, {
		label: "Description",
		items: descriptions,
		type: ["description"],
	}, {
		label: "Thumbnail",
		items: thumbnails,
		type: ["thumbnail"],
	},
	{
		label: "Site Name",
		items: siteNames,
		type: ["title"],
	},
	{
		label: "Author",
		items: authors,
		type: ["author"],
	},
	{
		label: "Published Date",
		items: pubDates,
		type: ["date", "datetime"],
	},
	{
		label: "Modified Date",
		items: modDates,
		type: ["date", "datetime"],
	},
	{
		label: "Type",
		items: types,
		type: ["tag"],
	},
	{
		label: "Twitter Handle",
		items: twitterHandles,
		type: ["profile"],
	},
	{
		label: "Twitter Link",
		items: twitterLinks,
		type: ["profile_url"],
	},
	{
		label: "Video",
		items: videos,
		type: ["video"],
	},
	{
		label: "Recipe",
		items: recipe,
		type: ["recipe"],
	},
	{
		label: "Domain",
		items: domains,
		type: ["domain"],
	}
	]

	// return groups that have items
	return groups.filter((group) => group.items.length > 0)
}

