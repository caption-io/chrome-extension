<script lang="ts">
	browser.identity.launchWebAuthFlow({
		url: 'https://api.notion.com/v1/oauth/authorize?owner=user&response_type=code&client_id=9f1d4b8e-1b1a-4b9c-9c1f-1c1b1b1b1b1b&redirect_uri=https://www.notion.so',
		interactive: true
	}).then((response) => {
		console.log(response);
	});
</script>
