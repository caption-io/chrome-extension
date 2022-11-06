import { getActiveUrl } from 'src/scripts/platform/ui-utils';

export function urlMatcher(url: string): boolean {
	return url === getActiveUrl();
	
}

export function injectCss(css: CSSRule): void {
}