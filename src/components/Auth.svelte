<script lang="ts">
	// IMPORTS

	// IMPT: Components
	import Button from "./ui/Button.svelte";
	import Icon from "./ui/Icon.svelte";

	// IMPT: Stores
	import { newAccount, noAccounts } from "src/scripts/platform/stores";

	// IMPT: Local Scripts
	import { outputManifest } from "src/providers-manifest";

	// IMPT: Packages
	import { crossfade } from "svelte/transition";
	import { quintOut } from "svelte/easing";

	//! IMPORTS

	const [send, receive] = crossfade({
		duration: 800,
		easing: quintOut,
	});
	let loggingIn = false;
	let completed = false;
	let activeProvider: OutputProvider;
	async function userAuth(provider) {
		loggingIn = true;
		activeProvider = provider;
		const importAuth = import(
			`../scripts/output-providers/${provider.id}/auth.ts`
		);
		const { auth } = await importAuth;
		auth();
	}

	$: if ($newAccount) {
		chrome.storage.local.get("outputProviders").then((res) => {
			let storedProviders: OutputProvider[] = res.outputProviders;
			if (!storedProviders.find((p) => p.id === activeProvider.id)) {
				storedProviders.push(activeProvider);
			} else {
			}
			if (
				!storedProviders
					.find((p) => p.id === activeProvider.id)
					.accounts.find((a) => a.id === $newAccount.id)
			) {
				storedProviders
					.find((p) => p.id === activeProvider.id)
					.accounts.push($newAccount);
				save(storedProviders);
			} else {
				// replace account
				storedProviders.find((p) => p.id === activeProvider.id).accounts =
					storedProviders
						.find((p) => p.id === activeProvider.id)
						.accounts.map((a) => {
							if (a.id === $newAccount.id) {
								return $newAccount;
							} else {
								return a;
							}
						});
				save(storedProviders);
			}
		});

		function save(prov) {
			chrome.storage.local.set({ outputProviders: prov });
			loggingIn = false;
			completed = true;
			noAccounts.set(false);
		}
	}

	function closeTab() {
		chrome.tabs.getCurrent().then((tab) => {
			chrome.tabs.remove(tab.id);
		});
	}
	let transitionReady = false;
</script>

<div class="main light-mode">
	<div class="login-card">
		<div class="title-header">
			<div class="title">
				<!-- <div class="logo-icon">
					<Icon
						name="quoteOpen"
						size={24}
						color="blue-400"
						position="m"
					/>
				</div> -->
				Caption
			</div>
			<div class="subtitle">Capture Anything.</div>
		</div>
		<div class="login-container">
			{#if !completed}
				<div
					class="login"
					in:receive={{ key: "login" }}
					out:send={{ key: "login" }}
				>
					<div class="login-prompt">Add Account</div>
					{#each outputManifest as provider}
						{#if !loggingIn}
							<Button
								on:click={() => userAuth(provider)}
								text="Login with {provider.name}"
								size="lg"
								color={provider.color}
								style="primary"
								icon={provider.icon}
							/>
						{:else if loggingIn}
							<Button
								text="Waiting for Notion"
								size="lg"
								color="blue"
								style="primary"
								icon={provider.icon}
								disabled={true}
							/>
						{/if}
					{/each}
				</div>
			{:else if !loggingIn && completed}
				<div
					class="login"
					in:receive={{ key: "login" }}
					out:send={{ key: "login" }}
				>
					<div class="success">
						<Icon
							icon="success"
							alt="Success Icon"
							size={20}
							color="default"
						/>
						<div class="success-text">Success!</div>
						<div class="close-text">
							You can now <span
								class="close"
								on:click={closeTab}>close</span
							>
							this window, or
							<span
								class="close"
								on:click={closeTab}>add another Workspace</span
							>.
						</div>
					</div>
				</div>
			{/if}
		</div>
		<div class="login-info">
			<a
				href=""
				target="_blank">Privacy Policy</a
			>
			|
			<a
				href=""
				target="_blank">Terms of Service</a
			>
		</div>
	</div>
</div>

<style lang="scss">
	@use "../style/global" as *;

	@keyframes opacity {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
	@keyframes shadow {
		0% {
			box-shadow: 0 0 0 0 var(--blue-alpha-200);
		}

		100% {
			box-shadow: 0 $p8 $p24 -4px var(--blue-alpha-200);
		}
	}

	.main {
		@include flex(column, center, center);
		height: 100vh;
		width: 100vw;
		background-color: var(--bg-tertiary);
		overflow: hidden;
		box-shadow: 0 0 $p24 0 var(--black-alpha-100) inset;

		.login-card {
			height: fit-content;
			width: fit-content;
			border-radius: $border-radius;
			box-shadow: 0 0 0 0 var(--blue-100);
			border: 1px solid rgba(67, 153, 225, 1);
			box-sizing: border-box;
			background-color: var(--bg);
			overflow: hidden;
			opacity: 0;
			animation: opacity 0.4s ease-in-out forwards,
				shadow 1.2s ease-in-out forwards;
			.title-header {
				@include flex(column, center, center);
				margin-bottom: $p20;
				width: 600px;
				height: 200px;
				background-color: var(--bg-colored);
				opacity: 0;
				animation: opacity 0.8s ease-in-out 0.2s forwards;
				.title {
					@include ui-text(var(--blue-400), $p16, 800);
					@include flex(row, center, center);
					text-transform: uppercase;
				}
				.logo-icon {
					margin-right: $p2;
				}
				.subtitle {
					@include ui-text(var(--blue-400), $p12, 400);
					text-transform: none;
					margin-top: $p8;
				}
			}
		}
		.login-container {
			height: 100px;
			overflow: hidden;
			margin-bottom: $p24;
			position: relative;
			opacity: 0;
			animation: opacity 1.2s ease-in-out 0.4s forwards;
			.login {
				@include flex(column, center, center);
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				.login-prompt {
					@include ui-text(var(--gray-500), $p14, 500);
					margin-bottom: $p24;
				}
				.success {
					@include flex(column, center, center);
					.success-text {
						@include ui-text(var(--green-500), $p16, 500);
						margin: $p3 0 $p20 0;
					}
					.close-text {
						@include ui-text(var(--gray-500), $p14, 500);
						padding: 0 $p32;
						word-wrap: break-word;
						max-width: 300px;
						box-sizing: border-box;
						text-align: center;
						.close {
							color: var(--blue-400);
							cursor: pointer;
							&:hover {
								text-decoration: underline;
								font-weight: 500;
								color: var(--blue-500);
							}
						}
					}
				}
			}
		}
		.login-info {
			@include flex(row, center, center);
			margin-top: $p24;
			@include ui-text(var(--gray-200), $p12, 400);
			margin-bottom: $p24;
			animation: opacity 1.6s ease-in-out 0.4s forwards;
			opacity: 0;

			a {
				@include ui-text(var(--blue-400), $p12, 400);
				margin: 0 $p6;
				text-decoration: none;
				&:hover {
					text-decoration: underline;
					color: var(--blue-300);
				}
			}
		}
	}
</style>
