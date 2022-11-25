<script lang="ts">
	export let value: boolean = false;
	export let type: "checkbox" | "switch" = "switch";
</script>

<div
	class="toggle-container"
	on:click={() => (value = !value)}
>
	{#if type === "switch"}
		<div
			class="toggle-switch"
			class:active={value}
		>
			<div
				class="toggle-switch-thumb"
				class:active={value}
			/>
		</div>
	{/if}
	{#if type === "checkbox"}
		<div
			class="toggle-checkbox"
			class:active={value}
		>
			<div class="toggle-checkbox-track">
				<div class="toggle-checkbox-thumb" />
			</div>
		</div>
	{/if}
</div>

<style lang="scss">
	@use "src/style/global" as *;

	.toggle-container {
		display: inline-block;
		.toggle-switch {
			position: relative;
			width: 56px;
			border-radius: 16px;
			height: 28px;
			background-color: var(--bg-tertiary);
			border: $border-color transparent;
			transition: $transition;
			box-sizing: border-box;
			cursor: pointer;
			&:hover {
				background-color: var(--bg-secondary);

				box-shadow: 0 0 0 $p3 var(--blue-alpha-200);
				border: $border-color var(--blue-300);
			}

			.toggle-switch-thumb {
				border-radius: 50%;
				position: absolute;
				top: 3px;
				left: 3px;
				width: 20px;
				height: 20px;
				background-color: var(--gray-400);
				opacity: 0.5;
				transition: $transition;
				&.active {
					background-color: var(--blue-400);

					transform: translateX(27px);
					opacity: 1;
				}
			}
		}

		.toggle-checkbox {
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			background-color: var(--bg-teriary);
			transition: background-color 0.2s ease;

			&:hover {
				background-color: var(--bg-secondary);
			}

			.toggle-checkbox-track {
				position: absolute;
				top: 2px;
				left: 2px;
				right: 2px;
				bottom: 2px;
				background-color: var(--bg);
				transition: background-color 0.2s ease;
			}

			.toggle-checkbox-thumb {
				position: absolute;
				top: 2px;
				left: 2px;
				width: 20px;
				height: 20px;
				background-color: var(--bg);
				transition: transform 0.2s ease;
				&.active {
					transform: translateX(16px);
				}
			}
		}
	}
</style>
