import { injectCss } from 'src/scripts/platform/helper_functions'
export const onLoad = (matches = null, css = null, func = () => null,) => {
	if (matches && urlMatch(matches)) {
		if (css) {
			injectCss(css);
		}
		return func()
	} else if (!matches) {
		return func()
	} else {
		return
	}
}
function urlMatch(url): boolean {
	if (url) return true
}

