<script lang="ts">
	import Main from "src/components/main/Main.svelte";
	import Auth from "src/components/Auth.svelte";
	import TitleBar from "src/components/main/TitleBar.svelte";
	import { webData, settings, maxSize, appExpanded } from "src/scripts/platform/stores";
	import { getSettings } from "src/scripts/platform/chrome-storage";
	import { uniqueIcons } from "src/scripts/input_providers/webdata";
	// import {getSubtitles} from 'youtube-captions-scraper';

	let userLoggedIn: boolean = false;
	let popupSize;

	console.log("Window: ", window);

	maxSize.set({
		height: (window.outerHeight) - 48,
		width: (window.outerWidth) - 48,
	});

	maxSize.subscribe((value) => {
		popupSize = value;
	});

	// FUNC: Load Settings
	(async function loadSetting() {
		await getSettings().then((res) => {
			settings.set({
				...res,
			});
			if ($settings.notionToken !== null) {
				userLoggedIn = true;
				console.log("User logged in with token: ", $settings.notionToken);
			} else {
				userLoggedIn = false;
				console.log("User not logged in, token: ", $settings.notionToken);
				//open options page
			}
		});
	})();

	// execute parsePageData()
	(async () => {
		let queryOptions = { active: true, lastFocusedWindow: true };
		let [tab] = await browser.tabs.query(queryOptions);
		let tabid = tab.id;
		browser.scripting
			.executeScript({
				target: { tabId: tabid },
				func: uniqueIcons,
			})
			.then((res) => {
				console.log("WebData: ", res[0].result);
				webData.set(res[0].result);
			});
	})();

	// watch for changes to active tab
	browser.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
		if (changeInfo.status === "complete") {
			let queryOptions = { active: true, lastFocusedWindow: true };
			let [tab] = await browser.tabs.query(queryOptions);
			let tabid = tab.id;
			browser.scripting
				.executeScript({
					target: { tabId: tabid },
					func: uniqueIcons,
				})
				.then((res) => {
					console.log("WebData: ", res[0].result);
					webData.set(res[0].result);
				});
		}
	});

	browser.storage.onChanged.addListener((changes, areaName) => {
		console.log(changes);
		if (changes.pageData) {
			webData.set(changes.pageData.newValue);
		}
	});
	let body = window.document.body;

	// resize obbserver to watch for changes to body height
	const resizeObserver = new ResizeObserver((entries) => {
		for (let entry of entries) {
			const cr = entry.contentRect;
			browser.runtime.sendMessage({
				type: "resize",
				height: cr.height,
			});
			sendHeight(cr.height, cr.width);
		}
	});

	$: if (body) {
		resizeObserver.observe(body);
	}

	const maxHeight = window.outerHeight - 120;
	const maxWidth = window.outerWidth - 64;

	// watch for changes to body height
	function sendHeight(height, width) {
		// send message to content script
		browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
			browser.tabs.sendMessage(tabs[0].id, {
				message: "height",
				height: height,
				width: width,
			});
		});
	}
	window.addEventListener("mousemove", (e) => {
		browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
			browser.tabs.sendMessage(tabs[0].id, {
				message: "mouse",
				mousePosition: e.screenX,
			});
		});
	});

	function resizePopup(e, input) {
		let state = "none";
		if (input === "start") {
			console.log(e.screenX);
			browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
				browser.tabs.sendMessage(tabs[0].id, {
					message: "resize",
					mousePosition: e.screenX,
				});
			});
		}
		if (input === "mousemove" && state === "dragging") {
			console.log(e);
		}
		if (input === "end") {
			console.log(e);
			state = "none";
		}
	}

	let resizeing = false;
	function dragger(state, e) {
		console.log(state, e);
		if (state === "start") {
			resizeing = true;
			browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
				browser.tabs.sendMessage(tabs[0].id, {
					message: "resize",
					value: true,
				});
			});
		} else if (state === "end") {
			resizeing = false;
			browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
				browser.tabs.sendMessage(tabs[0].id, {
					message: "resize",
					value: false,
				});
			});
		}
	}

	// $: sendHeight(bodyHeight);
	let testy;
	let minWidth = 400;

	const idsFromNotion = ["123", "456", "789"];
	const youtubeApiResults = [{ id: "123" }, { id: "456" }, { id: "788" }];

	const videosFound = idsFromNotion.map((id) => {
		return youtubeApiResults.find((result) => {
			result.id === id;
			return id;
		});
	});

	function youtuber(expanded) {
		browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
			if (tabs[0].url.includes("youtube.com/watch") && expanded) {
				browser.tabs.sendMessage(tabs[0].id, {
					message: "youtube",
					expanded: expanded,
				});
			}
		});
	}

	$: youtuber($appExpanded);

	console.log(Object.entries(videosFound));
</script>

<div
	id="height"
	class={`container ${$settings.colorMode}-mode`}
	style="{$appExpanded
		? "height: " + (window.outerHeight - 96) + "px; width: " + $maxSize.width + "px;" 
		: "height: fit-content; width: 400px;"}"
	style:maxHeight="{$maxSize.height}px"
	style:maxWidth="{$maxSize.width}px"
>
	<TitleBar />
	{#if !userLoggedIn}
		<Auth />
	{:else}
		<Main />
	{/if}
</div>

<style
	global
	lang="scss"
>
	@use "../style/global" as *;

	@keyframes widen {
		0% {
			opacity: 0;
		}

		100% {
			opacity: 1;
		}
	}

	.container {
		display: flex;
		flex-direction: column;
		pointer-events: all;
		overflow: hidden;
		height: 100%;
		transform-origin: top right;
		background-color: rgba(255, 255, 255, 0.75);
		offset-anchor: top right;

		box-sizing: border-box;

		.resize-handle {
			position: absolute;
			bottom: -20px;
			left: -20px;
			width: 32px;
			height: 32px;
			transform: rotate(45deg);
			cursor: ns-resize;
			z-index: 100;
			background: rgba(0, 0, 0, 0.1);

			&:hover {
				background: rgba(0, 0, 0, 0.1);
			}
		}

		#height {

		}
	}
</style>
