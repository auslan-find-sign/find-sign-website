import type { LayoutLoad } from "./$types"

export const load: LayoutLoad = async ({ parent }) => {
  const { session } = await parent()
  return { session }
}
