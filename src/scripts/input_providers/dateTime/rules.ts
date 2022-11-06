function doNothing() {
  return [];
}

const rules: InputProviderRules = {
	onLoad: {
		func: doNothing
	},
};

export default rules;