<script lang="ts">
	import Icon from "./Icon.svelte";
	import TextInput from "./TextInput.svelte";
	import { scaleFromTop } from "../../scripts/ui-utils";
	import { webData } from "src/scripts/platform/stores";
	import { element } from "svelte/internal";
	import { fly } from "svelte/transition";
	import { flip } from "svelte/animate";

	export let value;

	let elementHeight;

	const resizeObserver = new ResizeObserver((entries) => {
		for (let entry of entries) {
			const cr = entry.contentRect;
			elementHeight = cr.height;
		}
	});

	let contentContainer;

	$: if (contentContainer) {
		resizeObserver.observe(contentContainer);
	}

	type Tabs = "pageIcon" | "coverImage" | "database" | "none";
	let selectedTab: Tabs = "none";
	let tabOptions: { label: string; value: Tabs }[] = [
		{ label: "Icon", value: "pageIcon" },
		{ label: "Cover", value: "coverImage" },
		{ label: "DB Info", value: "database" },
	];

	let webIcon;
	webIcon = $webData.find((icon) => icon.groupHeader === "Icon").items;
	$: webIcon = $webData.find((icon) => icon.groupHeader === "Icon").items;

	let coverImage;
	coverImage = $webData.find(
		(cover) => cover.groupHeader === "Thumbnail"
	).items;
	$: coverImage = $webData.find(
		(cover) => cover.groupHeader === "Thumbnail"
	).items;

	export let type: "webicon" | "custom" | "none" = webIcon ? "webicon" : "none";

	// if an icon in webIcon is a .ico, get blob url and use FileReader to convert to data url
	// then set the icon to the data url
	// this is a workaround for the fact that .ico files are not supported by the browser
	// and cannot be used as a src for an <img> tag
	// this will be done in the background, so user will not notice
	// this is only run if the user has not selected a custom icon
	// if they have, the user has already done the work of converting the .ico to a data url
	// so we don't need to do it again
	if (type === "webicon") {
		webIcon.forEach((icon) => {
			if (icon.text.endsWith(".ico")) {
				fetch(icon.text)
					.then((response) => response.blob())
					.then((blob) => {
						const reader = new FileReader();
						reader.onload = () => {
							icon.text = reader.result as string;
						};
						reader.readAsDataURL(blob);
					});
			}
		});
	}

	let showSettings = false;

	let selectedWebIcon = webIcon ? webIcon[0].text : null;
	let selectedCoverImage = coverImage ? coverImage[0].text : null;
</script>
<div class="container-toggle" on:click={() => showSettings = !showSettings} >
	{showSettings ? "Hide" : "Icon, Cover, & Settings"}
	<div class="container-toggle-chevron" class:open={showSettings}>
	<Icon name="chevronRight" size={16} color="gray-400"/>
</div>
</div>
{#if showSettings}
<div
	class="main"
	style:height="{elementHeight ? elementHeight + 74 : 60}px"
	transition:fly="{{duration: 200, y: -20}}"
>
	<div class="tab-container">
		{#each tabOptions as tab}
			<div
				class="tab"
				class:selected={selectedTab === tab.value}
				on:click={() =>
					selectedTab === tab.value
						? (selectedTab = "none")
						: (selectedTab = tab.value)}
			>
				{#if type === "webicon" && selectedWebIcon && tab.value === "pageIcon"}
					<Icon
						url={selectedWebIcon}
						size={16}
					/>
				{:else}
					<Icon
						name={type === "none" && tab.value === "pageIcon"
							? "none"
							: tab.value}
					/>
				{/if}
				{tab.label}
				<div class="chevron">
					<Icon name="chevronRight" />
				</div>
			</div>
		{/each}
	</div>
	<div
		class="content-container"
		bind:this={contentContainer}
		style={selectedTab !== "none" ? "padding: 12px" : "padding: 0"}
	>
		{#if selectedTab === "pageIcon" || selectedTab === "coverImage"}
			{@const item = selectedTab === "pageIcon" ? webIcon : coverImage}
			{@const selected =
				selectedTab === "pageIcon" ? selectedWebIcon : selectedCoverImage}
			{#key selectedTab}
				<div class="option-container">
					{#if selected}
						<div
							class="option webicon"
							class:selected={type === "webicon"}
							on:click={() => (type = "webicon")}
							style:backgroundImage={selectedTab === "pageIcon"
								? "none"
								: "url(" + selected + ")"}
						>
							{#if selectedTab === "pageIcon"}
								<Icon
									url={selected}
									size={16}
								/>
							{:else}
								<img
									src={selected}
									alt=""
									style="max-height: 24px"
								/>
							{/if}
							<div class="option-text">Web Icon</div>
						</div>
					{/if}
					<div
						class={`option custom ${type === "custom" ? "selected" : ""}`}
						on:click={() => (type = "custom")}
					>
						<Icon
							name="url"
							color="gra-500"
						/>
						<div class="option-text">Custom URL</div>
					</div>
					<div
						class={`option none ${type === "none" ? "selected" : ""}`}
						on:click={() => (type = "none")}
					>
						<Icon
							name="none"
							color="gray-500"
						/>
						<div class="option-text">None</div>
					</div>
				</div>
				{#if type === "custom"}
					<div class="custom-url">
						<TextInput
							placeholder="https://"
							type="url"
							bind:value
						/>
					</div>
				{:else if type === "webicon" && item.length > 1}
					<div class="webicon-container">
						<div class="webicon-list">
							{#each item as icon (icon.text)}
								<div
									class="webicon-item"
									class:selected={icon.text === selected}
									on:click={() => {
										if (selectedTab === "pageIcon") {
											selectedWebIcon = icon.text;
										} else {
											selectedCoverImage = icon.text;
										}
									}}
								>
									<Icon
										url={icon.text}
										size={20}
									/>
									<div class="webicon-info">
										<div class="webicon-source">{icon.source}</div>
									</div>
								</div>
							{/each}
						</div>
					</div>
				{/if}
			{/key}
		{/if}
	</div>
</div>
{/if}
<style lang="scss">
	@use "../../style/global" as *;

	@keyframes scaler {
		from {
			height: 0px;
		}
		to {
			height: 36px;
		}
	}
	.container-toggle {
		@include flex(row, center, center);
		padding: $p6 0;
		background-color: var(--bg-secondary);
		margin-top: $p12;
		border-top-left-radius: $border-radius;
		border-top-right-radius: $border-radius;
		.container-toggle-chevron {
			transform: rotate(90deg);
			&.open {
				transform: rotate(-90deg);
			}
		}
		&:hover {
			background-color: var(--bg-tertiary);
		}
	}
	.main {
		@include flex(column, flex-start, flex-start);
		width: 100%;
		transition: 200ms ease;
		.tab-container {
			@include flex(row, flex-start, center);
			width: 100%;
			background-color: var(--bg-secondary);
			column-gap: $p12;
			padding: $p12;
			box-sizing: border-box;
			.tab {
				@include flex(row, center, center);
				@include ui-text(var(--text-secondary), $p14, 500);
				column-gap: $p6;
				width: 33.3%;
				cursor: pointer;
				transition: 200ms ease;
				height: 36px;
				border-radius: $border-radius;
				background-color: var(--bg-tertiary);
				border: $border-color transparent;
				box-sizing: border-box;

				.chevron {
					margin-left: $p3;
					transition: $transition;
				}
				&:hover {
					background-color: var(--bg);
				}
				&:active {
					border: $border-color var(--blue-400);
				}
				&.selected {
					background-color: var(--bg);
					border: $border-color var(--blue-400);

					.chevron {
						transform: rotate(90deg);
					}
				}
			}
		}

		.content-container {
			background-color: var(--bg-tertiary);
			width: 100%;
			height: fit-content;
			box-sizing: border-box;
			padding-bottom: $p12;
			margin-bottom: $p10;
			// padding: $p12;

			.option-container {
				@include flex(row, flex-start, flex-start);
				width: 100%;
				padding: 0 0 $p12 0;
				border-radius: var(--border-radius);
				background-color: var(--bg-tertiary);
				box-sizing: border-box;
				column-gap: $p12;

				.option {
					@include flex(row, center, center);
					@include inputLabel();
					width: 33.3%;
					padding: $p6 0;
					height: 100%;
					border: $border-color transparent;
					border-radius: $border-radius;
					cursor: pointer;
					box-sizing: border-box;
					transition: 200ms ease;
					background-size: contain;
					background-color: var(--bg-tertiary);
					&:hover {
						background-color: var(--bg-tertiary);
					}
					&:active {
						background-color: var(--bg);
						
						border: $border-color var(--blue-400);
					}
					&.selected {
						background-color: var(--bg);
						border: $border-color var(--blue-400);
					}
					.option-text {
						margin-left: $p6;
					}
				}
			}
			.custom-url {
				width: 100%;
				margin-top: 0.25rem;
			}
			.webicon-container {
				width: 100%;
				margin-top: 0.25rem;
				.webicon-list {
					@include flex(row, flex-start, center);
					padding: $p8 $p8;
					width: 100%;
					overflow-x: auto;
					border-radius: $border-radius;
					background-color: var(--bg);
					box-sizing: border-box;
					column-gap: $p3;
					border: $border-dark;
					.webicon-item {
						@include flex(row, center, center);
						padding: 0 $p8;
						border-radius: $border-radius;
						cursor: pointer;
						box-sizing: border-box;
						transition: 200ms ease;
						overflow: hidden;
						height: $p40;
						&:hover {
							background-color: var(--bg-secondary);
						}
						&.selected {
							background-color: var(--bg-tertiary);
						}
						.webicon-info {
							@include flex(column, flex-start, flex-start);
							margin-left: $p6;
							.webicon-source {
								@include ui-text(var(--text-secondary), $p12, 500);
							}
							.webicon-size {
								@include ui-text(var(--text-tertiary, $p10, 400));
							}
						}
					}
				}
			}
		}
	}
</style>
