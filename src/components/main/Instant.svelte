<script lang="ts">
	import Button from "../ui/Button.svelte";
import Icon from "../ui/Icon.svelte";
	export let flow = {
		name: "Demo Flow",
		db: "Web Clips",
	};

	let loading = true;
	let complete = false;
	function setLoad() {
		//timeout of 1 second to simulate loading
		setTimeout(() => {
			loading = false;
			complete = true;
		}, 4000);
	}
	setLoad();
</script>

<div class="instant-container">
	{#if loading}
		<div class="loading-icon">
			<Icon
				icon="loading"
				size={24}
				color="blue"
			/>
		</div>
		<div class="loading-text">Capturing...</div>
	{/if}
	{#if complete}
		<div class="complete">
			<Icon
				icon="success"
				size={24}
				color="green"
			/>
		</div>
		<div class="complete-text">
			<div style="display: flex; flex-direction: row; align-items: center; margin-bottom: 3px;">
				Captured page to
				<div class="flow-db">
					<Icon
						icon="doc"
						size={14}
						color="gray"
					/>
					{" " + flow.db}
				</div>
			</div>
			<div>using <span class="flow-name">{flow.name}</span></div>
		</div>
		<Button
			text="Open in Notion"
			icon="notion"
			color="blue"
			size="md"
			/>
	{/if}
</div>

<style lang="scss">
	@use "../../style/global" as *;
	@keyframes spinner {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
	.instant-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 190px;

		.loading-text {
			@include ui-text(var(--text-secondary), $p14, 600);
		}
		.complete {
			margin-bottom: 10px;
		}
		.complete-text {
			@include flex(column, center, center);
			font-size: 14px;
			color: var(--gray);
			white-space: nowrap;

			margin-bottom: 12px;
			.flow-db {
				@include flex(row, flex-start, center);
				@include ui-text(var(--text), $p14, 500);
				column-gap: $p3;
				margin-left: 5px;
				white-space: nowrap;

				.icon {
					margin-right: 5px;
				}
			}
			.flow-name {
				@include ui-text(var(--blue), $p14, 500);
				white-space: nowrap;
			}
		}
	}
	:global {
		.loading-icon {
			margin-bottom: 10px;
			svg {
				animation: spinner 1s linear infinite;
			}
		}
	}
</style>
