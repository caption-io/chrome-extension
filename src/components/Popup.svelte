<script lang="ts">
	// IMPORTS

	// IMPT: Components
	import Main from "src/components/main/Main.svelte";
	import TitleBar from "src/components/main/TitleBar.svelte";
	import Tooltip from "./ui/Tooltip.svelte";

	// IMPT: Stores
	import {
		settingStore,
		accountStore,
		webData,
		maxSize,
		appExpanded,
		tooltipInfo,
		dropdownExtraHeight,
		onLoadInputData,
	} from "src/scripts/platform/stores";

	// IMPT: Local Scripts
	import { inputManifest } from "src/scripts/provider_manifest";
	import {
		_settings,
		_outputProviders,
		_flows,
		_tags,
	} from "src/scripts/platform/platform";
	import { getWebData } from "src/scripts/input_providers/webData/get";
	import Instant from "./main/Instant.svelte";

	//! IMPORTS

	// FUNCTIONS: On Mount
	_settings.loadAll();
	_outputProviders.loadAccounts();
	_flows.load();
	_tags.load();


	_settings.load("defaultAccount").then((account) => {
		if (!account) {
			if ($accountStore.length > 0) {
				_settings.save("defaultAccount", $accountStore[0].id);
			} else {
			}
		}
	});

	maxSize.set({
		height: window.outerHeight - 132,
		width: window.outerWidth - 48,
	});

	//! FUNCTIONS

	// VARIABLES

	// VARS: Local

	let body = document.body;
	let currentTab = chrome.tabs.getCurrent();
	let instantCapture = false;

	// VARS: Local Dyanmic
	let colorMode = "light";
	$: if ($settingStore) {
		if (
			$settingStore.find((s) => s.id === "colorMode") &&
			$settingStore.find((s) => s.id === "colorMode").value
		) {

			colorMode = $settingStore.find((s) => s.id === "colorMode").value;
		}
	}
	let theme = "light";
	let sysPrefColor = window.matchMedia("(prefers-color-scheme: dark)");
	let sysColorMode = sysPrefColor.matches ? "dark" : "light";
	sysPrefColor.addEventListener("change", (e) => {
		sysColorMode = e.matches ? "dark" : "light";
	});

	//! VARIABLES

	// TODO: Make onload function dynamic for inputProviders
	(async () => {
		currentTab.then((tab) => {
			onLoadData(tab.id);
		});
	})();

	// FUNCTIONS: Listeners

	async function onLoadData(tabId) {
		onLoadInputData.set([]);
		for (let provider of inputManifest) {
			let funcy = await import(
				`../scripts/input_providers/${provider.id}/rules.ts`
			);
			if (funcy) {
				let inProvider = provider;
				chrome.scripting
					.executeScript({
						target: { tabId: tabId },
						func: funcy.default.onLoad.func,
					})
					.then((res) => {
						inProvider.data = res[0].result;
						if ($onLoadInputData.length > 0) {
							onLoadInputData.set([...$onLoadInputData, inProvider]);
						} else {
							onLoadInputData.set([inProvider]);
						}
					});
			}
		}
	}

	chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
		if (changeInfo.status === "complete") {
			onLoadData(tabId);
		}
	});

	//! FUNCTIONS

	// chrome.storage.onChanged.addListener((changes, areaName) => {
	// 	if (changes.settings.newValue) {
	// 		if (
	// 			changes.settings.oldValue.find((x) => x.id == "extensionStorage") !==
	// 			changes.settings.newValue.find((x) => x.id == "extensionStorage")
	// 		) {
	// 			webData.set(changes.pageData.newValue);
	// 		}
	// 	}
	// });

	// resize obbserver to watch for changes to body height
	const resizeObserver = new ResizeObserver((entries) => {
		for (let entry of entries) {
			const cr = entry.contentRect;
			sendHeight(cr.height, 0);
		}
	});

	$: if (body) {
		resizeObserver.observe(body);
	}
	$: if ($appExpanded) {
		sendHeight(0, 900);
	} else {
		sendHeight(0, 400);
	}

	// watch for changes to body height
	function sendHeight(height, width) {
		currentTab.then((tab) => {
			if (height !== 0) {
				chrome.tabs.sendMessage(tab.id, {
					message: "height",
					height: height,
				});
			}
			if (width !== 0) {
				chrome.tabs.sendMessage(tab.id, {
					message: "width",
					width: width,
				});
			}
		});
	}

	// GRP: Color Mode Handler

	$: if (colorMode === "system" && sysColorMode) {
		colorHandler(sysColorMode);
	} else {
		colorHandler(colorMode);
	}


	function colorHandler(mode) {
		body.style.setProperty("background-color", mode === "light" ? "#fff" : "#161819");
		body.classList.remove("light", "dark");
		body.classList.add(`${mode}-mode`);
		chrome.tabs.getCurrent().then((tab) => {
			chrome.tabs.sendMessage(tab.id, {
				message: "colorMode",
				mode: mode,
			});
		});
		theme = mode;
	}
</script>

<div
	id="height"
	class={`container ${theme}-mode`}
	class:expanded={$appExpanded}
	style={`width: ${$appExpanded ? "900px" : "400px"}; height: ${
		$appExpanded
			? $maxSize.height + "px"
			: $dropdownExtraHeight
			? $dropdownExtraHeight + "px"
			: "auto"
	}; max-height: ${$maxSize.height}px; max-width: ${$maxSize.width}px;`}
>
	{#if instantCapture}
		<Instant />
	{:else}
		<TitleBar />
		<Main />
		{#if $tooltipInfo}
			<Tooltip
				show={true}
				value={$tooltipInfo.text}
				position={$tooltipInfo.position}
				location={{
					x: $tooltipInfo.location.x,
					y: $tooltipInfo.location.y,
				}}
				delay={$tooltipInfo.delay}
			/>
		{/if}
	{/if}
</div>

<style
	global
	lang="scss"
>
	@use "../style/global" as *;

	.container {
		display: flex;
		flex-direction: column;
		pointer-events: all;
		overflow: hidden;
		transform-origin: 0% 100%;
		background-color: var(--bg);
		offset-anchor: top right;
		box-sizing: border-box;
		transition: $transition;
		&.expanded {
		}
	}
</style>
