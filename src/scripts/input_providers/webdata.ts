// author []

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


export function uniqueIcons(): WebData {

	function stringParser(p: { items: { text: string, source: string[] }[], type: string[] }): WebDataItem[] {
		const pFiltered = p.items.filter((title) => {
			return title.text !== null && title.text !== undefined && title.text !== ""
		})
		// combine entries with duplicate text and combine sources into one array

		const pUnique = pFiltered.reduce((acc, cur) => {
			const found = acc.find((item) => item.text === cur.text)
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

	const parseTitle: { items: { text: string, source: string[] }[], type: string[] } =
	{
		items: [
			{ text: document.querySelector('meta[property="og:title"]')?.getAttribute('content'), source: ["OpenGraph"] },
			{ text: document.querySelector('meta[property="al:web:title"]')?.getAttribute('content'), source: ["Facebook"] },
			{ text: document.querySelector('meta[property="twitter:title"]')?.getAttribute('content'), source: ["Twitter"] },
			{ text: document.querySelector('title')?.textContent, source: ["Tag: Title"] },
			{ text: document.querySelector('meta[name="title"]')?.textContent, source: ["Meta: Title"] },
			{ text: document.querySelector('meta[name="parsely-title"]')?.getAttribute('content'), source: ["Parsely"] },
			// ytData.title ? ytData.title : { text: null, source: ["Youtube Title"] },
		],
		type: ["title", "text"]
	}

	const parseYoutube: { items: { text: string, source: string[] }[], type: string[] } =
	{
		items: [
			{ text: document.querySelector('#info h1[class*="title"]')?.textContent, source: ["YouTube Title"] },
			{ text: document.querySelector('#channel-name #text')?.textContent, source: ["YouTube Channel"] },
			{ text: document.querySelector('#avatar > img')?.getAttribute('src'), source: ["YouTube Icon"] },
			{ text: document.querySelector('#owner-sub-count')?.textContent, source: ["YouTube Sub Count"] },
			{ text: document.querySelector('#contents:nth-child(1) > yt-formatted-string')?.textContent, source: ["YouTube Top Comment"] }
		],
		type: ["video", "text"]
	}

	const youtube = stringParser(parseYoutube)
	// remove titles where text is null, undefined, or does not exist

	const titles = stringParser(parseTitle)
	

	// GRP: URL
	const parseUrl: { items: { text: string, source: string[] }[], type: string[] } =
	{
		items: [
			{ text: document.querySelector('meta[property="og:url"]')?.getAttribute('content'), source: ["OpenGraph"] },
			{ text: document.querySelector('meta[property="al:web:url"]')?.getAttribute('content'), source: ["Facebook"] },
			{ text: document.querySelector('meta[name="parsely-link"]')?.getAttribute('content'), source: ["Parsely"] },
			{ text: window.location.href, source: ["Browser Data"] },
		],
		type: ["url", "string"]
	}

	// remove urls where text is null, undefined, or does not exist
	const urls = stringParser(parseUrl)

	// get domain from url
	const domains = urls.map((url) => {
		const domain = new URL(url.text).hostname
		return { text: "https://" + domain, source: url.source, type: ["domain", "string"] }
	})
	

	

	// GRP: Icons

	const parseIcons: { items: { text: string, source: string[] }[], type: string[] } =
	{
		items: [
			{ text: iconUrlChecker(document.querySelector('link[rel="icon"]')?.getAttribute('href')), source: ["Link Icon"] },
			{ text: iconUrlChecker(document.querySelector('link[rel="shortcut icon"]')?.getAttribute('href')), source: ["Link Shortcut Icon"] },
			{ text: iconUrlChecker(document.querySelector('link[rel="apple-touch-icon"]')?.getAttribute('href')), source: ["Apple Touch Icon"] },
			{ text: iconUrlChecker(document.querySelector('link[rel="mask-icon"]')?.getAttribute('href')), source: ["Mask Icon"] }
		],
		type: ["recipe", "text"]
	}

	function iconUrlChecker(icon) {
		if (!icon) return
		if (icon.startsWith("http")) return icon
		if (icon.startsWith("//")) return "https:" + icon
		if (icon.startsWith("/")) return new URL(icon, window.location.href).href

	}
	const icons = stringParser(parseIcons)

	

	// GRP: Recipe
	const parseRecipe: { items: { text: string, source: string[] }[], type: string[] } =
	{
		items: [
			{ text: document.querySelector('script[type="application/ld+json"]')?.innerHTML ? JSON.parse(document.querySelector('script[type="application/ld+json"]')?.innerHTML) : null, source: ["JSON-LD"] },
			{ text: document.querySelector('meta[property="og:recipe:ingredients"]')?.getAttribute('content'), source: ["OpenGraph"] },
			{ text: document.querySelector('meta[property="og:recipe:instructions"]')?.getAttribute('content'), source: ["OpenGraph"] },
			{ text: document.querySelector('meta[property="og:recipe:yield"]')?.getAttribute('content'), source: ["OpenGraph"] },
			{ text: document.querySelector('meta[property="og:recipe:duration"]')?.getAttribute('content'), source: ["OpenGraph"] },
			{ text: document.querySelector('meta[property="og:recipe:calories"]')?.getAttribute('content'), source: ["OpenGraph"] },
			{ text: document.querySelector('meta[property="og:recipe:author"]')?.getAttribute('content'), source: ["OpenGraph"] },
			{ text: document.querySelector('meta[property="og:recipe:category"]')?.getAttribute('content'), source: ["OpenGraph"] },
			{ text: document.querySelector('meta[property="og:recipe:cuisine"]')?.getAttribute('content'), source: ["OpenGraph"] },
			{ text: document.querySelector('meta[property="og:recipe:tags"]')?.getAttribute('content'), source: ["OpenGraph"] }
		],
		type: ["recipe", "text"]
	}

	const recipe = stringParser(parseRecipe)
	


	// GRP: Description
	const parseDescription: { items: { text: string, source: string[] }[], type: string[] } = {
		items: [
			{ text: document.querySelector('meta[property="og:description"]')?.getAttribute('content'), source: ["OpenGraph"] },
			{ text: document.querySelector('meta[property="al:web:description"]')?.getAttribute('content'), source: ["Facebook"] },
			{ text: document.querySelector('meta[name="description"]')?.getAttribute('content'), source: ["Meta Tag"] },
			{ text: document.querySelector('meta[name="parsely-description"]')?.getAttribute('content'), source: ["Parsely"] },
			{ text: document.querySelector('meta[property="twitter:description"]')?.getAttribute('content'), source: ["Twitter"] },
		],
		type: ["description", "text"]
	}

	// remove descriptions where text is null, undefined, or does not exist
	const descriptions = stringParser(parseDescription)
	

	// GRP: Thumbnail
	const parseThumbnail: { items: { text: string, source: string[] }[], type: string[] } =
	{
		items: [
			{ text: document.querySelector('meta[property="og:image"]')?.getAttribute('content'), source: ["OpenGraph"] },
			{ text: document.querySelector('meta[property="al:web:image"]')?.getAttribute('content'), source: ["Facebook"] },
			{ text: document.querySelector('meta[name="parsely-image-url"]')?.getAttribute('content'), source: ["Parsely"] },
			{ text: document.querySelector('meta[property="twitter:image"]')?.getAttribute('content'), source: ["Twitter"] },
			{ text: document.querySelector('meta[property="twitter:image:src"]')?.getAttribute('content'), source: ["Twitter"] },
			{ text: document.querySelector('meta[name="thumbnail"]')?.getAttribute('content'), source: ["Meta Tag"] },
		],
		type: ["image", "url", "text"]
	}


	const thumbnails = stringParser(parseThumbnail)
	

	// GRP: Site Name
	const parseSiteName: { items: { text: string, source: string[] }[], type: string[] } =
	{
		items: [
			{ text: document.querySelector('meta[property="og:site_name"]')?.getAttribute('content'), source: ["OpenGraph"] },
			{ text: document.querySelector('meta[property="al:web:site_name"]')?.getAttribute('content'), source: ["Facebook"] },
			{ text: document.querySelector('meta[name="parsely-site"]')?.getAttribute('content'), source: ["Parsely"] },
			{ text: document.querySelector('meta[name="twitter:app:name:iphone"]')?.getAttribute('content'), source: ["Twitter: App Name"] },
			{ text: document.querySelector('meta[property="al:ios:app_name"]')?.getAttribute('content'), source: ["Facebook: App Name"] },
			{ text: document.querySelector('meta[name="twitter:app:name:googleplay"]')?.getAttribute('content'), source: ["Twitter: App Name"] },
			{ text: document.querySelector('meta[name="twitter:app:name:amazon"]')?.getAttribute('content'), source: ["Twitter: App Name"] },
		],
		type: ["site_name", "text"]
	}

	const siteNames = stringParser(parseSiteName)
	

	// GRP: Author
	const parseAuthor: { items: { text: string, source: string[] }[], type: string[] } = {
		items: [
			{ text: document.querySelector('meta[property="article:author"]')?.getAttribute('content'), source: ["Meta Tag"] },
			{ text: document.querySelector('meta[property="al:web:author"]')?.getAttribute('content'), source: ["Facebook"] },
			{ text: document.querySelector('meta[name="parsely-author"]')?.getAttribute('content'), source: ["Parsely"] },
			{ text: document.querySelector('meta[name="author"]')?.getAttribute('content'), source: ["Meta Tag"] },
			// ytData.author ? ytData.author : { text: null, source: ["YouTube Author"] },
		],
		type: ["author", "text"]
	}

	const authors = stringParser(parseAuthor)
	

	// GRP: Published Date
	const parsePubDate: { items: { text: string, source: string[] }[], type: string[] } =
	{
		items: [
			{ text: document.querySelector('meta[property="article:published_time"]')?.getAttribute('content'), source: ["Meta Article Published Time"] },
			{ text: document.querySelector('meta[property="al:web:published_time"]')?.getAttribute('content'), source: ["Facebook"] },
			{ text: document.querySelector('meta[name="parsely-pub-date"]')?.getAttribute('content'), source: ["Parsely"] },
			{ text: document.querySelector('meta[name="date"]')?.getAttribute('content'), source: ["Meta Date"] },
		],
		type: ["date", "text"]
	}

	const pubDates = stringParser(parsePubDate)
	

	// GRP: Modified Date
	const parseModDate: { items: { text: string, source: string[] }[], type: string[] } =
	{
		items: [
			{ text: document.querySelector('meta[property="article:modified_time"]')?.getAttribute('content'), source: ["Meta Article Modified Time"] },
			{ text: document.querySelector('meta[property="al:web:modified_time"]')?.getAttribute('content'), source: ["Facebook"] },
			{ text: document.querySelector('meta[name="parsely-modified"]')?.getAttribute('content'), source: ["Parsely"] },
			{ text: document.querySelector('meta[name="last-modified"]')?.getAttribute('content'), source: ["Meta Last Modified"] },
		],
		type: ["date", 'text']
	}

	const modDates = stringParser(parseModDate)
	

	// GRP: Type
	const parseType: { items: { text: string, source: string[] }[], type: string[] } =
	{
		items: [
			{ text: document.querySelector('meta[property="og:type"]')?.getAttribute('content'), source: ["OpenGraph"] },
			{ text: document.querySelector('meta[property="al:web:type"]')?.getAttribute('content'), source: ["Facebook"] },
			{ text: document.querySelector('meta[name="parsely-type"]')?.getAttribute('content'), source: ["Parsely"] },
		],
		type: ["text", "website"]
	}

	const types = stringParser(parseType)
	

	// GRP: Twitter Handle
	const parseTwitterHandle: { items: { text: string, source: string[] }[], type: string[] } =
	{
		items: [
			{ text: document.querySelector('meta[property="twitter:site"]')?.getAttribute('content'), source: ["Twitter Site"] },
			{ text: document.querySelector('meta[property="twitter:creator"]')?.getAttribute('content'), source: ["Twitter Creator"] },
			{ text: document.querySelector('meta[property="twitter:player"]')?.getAttribute('content'), source: ["Twitter iOS App ID"] },
		],
		type: ["twitter", "url", "text"]

	}

	const twitterHandles = stringParser(parseTwitterHandle)
	const twitterLinks = twitterHandles.map((handle) => {
		return { text: `https://twitter.com/${handle.text.replace('@', '')}`, source: handle.source, type: ["twitter", "url", "text"] }
	})

	

	// GRP: Videos
	const parseVideos: { items: { text: string, source: string[] }[], type: string[] } = {
		items: [
			{ text: document.querySelector('iframe[src^="https://www.youtube"]')?.getAttribute('src').replace("embed/", "watch?v="), source: ["Embedded YouTube Source"] }
		], type: ["video", "url", "text"]
	}

	const videos = stringParser(parseVideos)
	



	let groups = [{
		groupHeader: "Title",
		items: titles,
		type: "text",
		priority: 1,
	}, {
		groupHeader: "URL",
		items: urls,
		type: "url",
		priority: 4,
	}, {
		groupHeader: "Icon",
		items: icons,
		type: "image",
		priority: 6,
	}, {
		groupHeader: "Description",
		items: descriptions,
		type: "text",
		priority: 3,
	}, {
		groupHeader: "Thumbnail",
		items: thumbnails,
		type: "image",
		priority: 5,
	},
	{
		groupHeader: "Site Name",
		items: siteNames,
		type: "text",
		priority: 2,
	},
	{
		groupHeader: "Author",
		items: authors,
		type: "text",
		priority: 7,
	},
	{
		groupHeader: "Published Date",
		items: pubDates,
		type: "text",
		priority: 8,
	},
	{
		groupHeader: "Modified Date",
		items: modDates,
		type: "text",
		priority: 9,
	},
	{
		groupHeader: "Type",
		items: types,
		type: "text",
		priority: 10
	},
	{
		groupHeader: "Twitter Handle",
		items: twitterHandles,
		type: "text",
		priority: 11,
	},
	{
		groupHeader: "Twitter Link",
		items: twitterLinks,
		type: "url",
		priority: 12,
	},
	{
		groupHeader: "Video",
		items: videos,
		type: "video",
		priority: 13,
	},
	{
		groupHeader: "Youtube",
		items: youtube,
		type: "video",
		priority: 0,
	},
	{
		groupHeader: "Recipe",
		items: recipe,
		type: "recipe",
		priority: 0,
	},
	{
		groupHeader: "Domain",
		items: domains,
		type: "url",
		priority: 0,
	}
	]

	// return groups that have items
	return groups.filter((group) => group.items.length > 0)
}

