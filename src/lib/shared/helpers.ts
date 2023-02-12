const URL_SLUG_REGEX = /^[a-zA-Z0-9]+(?:[-,_][a-zA-Z0-9]+)*$/gm;

export function isValidUrlSlug(urlSlug: string): boolean {
	return URL_SLUG_REGEX.test(urlSlug);
}
