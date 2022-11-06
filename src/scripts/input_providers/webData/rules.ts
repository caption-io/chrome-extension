import { getWebData } from "./get"
import { onLoad } from "../input_provider_helpers"
import type { defaults } from "lodash-es"

const rules: InputProviderRules = {
	onLoad: {
		func: getWebData
	}
}

export default rules