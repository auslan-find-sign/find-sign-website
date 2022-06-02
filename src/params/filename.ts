/** @type {import('@sveltejs/kit').ParamMatcher} */
export function match(param): boolean {
  return (/^[a-z0-9*~'()_.!-]+$/gmui).test(param)
}