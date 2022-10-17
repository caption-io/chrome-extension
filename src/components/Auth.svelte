<script lang="ts">
	import { setSetting } from "src/scripts/platform/chrome-storage";
	import { settings } from "src/scripts/platform/stores";
	import Button from "./ui/Button.svelte";

	async function userLogin() {
		chrome.identity.launchWebAuthFlow(
			{
				interactive: true,
				url: "https://api.notion.com/v1/oauth/authorize?client_id=ab6c8812-73c4-40cd-a993-210872654c27&response_type=code",
			},
			function (key) {
				console.log(key.split("=")[1].split("&")[0]);
				fetch("https://api.notion.com/v1/oauth/token", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization:
							"Basic YWI2Yzg4MTItNzNjNC00MGNkLWE5OTMtMjEwODcyNjU0YzI3OnNlY3JldF9pY3g1aEVQZXZGQ3JNNUFiNFE2YUVPUHhWV0NSMFY4ekNzRjRYU3dVVTlJ",
					},
					body: JSON.stringify({
						code: key.split("=")[1].split("&")[0],
						grant_type: "authorization_code",
					}),
				})
					.then((response) => response.json())
					.then((data) => {
						browser.storage.local.get("settings").then((res) => {
							let s = res;
							s.settings.notionToken = data.access_token;
							browser.storage.local.set(s);
						});
					});
			}
		);
	}

	console.log($settings);

</script>

<div class="main">
	<h3 class="title">Caption</h3>
	<h2 class="login-prompt">Please Login</h2>
	<Button
		on:click={userLogin}
		value="Login with Notion"
		size="big"
		color="blue"
		style="primary"
	/>
</div>

<style lang="scss">
	@use "../style/global" as *;

	.main {
		@include flex(column, center, center);
	}
</style>
