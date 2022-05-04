/**
 * Delay until promise resolves
 */
export async function delay (duration: number) {
  await new Promise((resolve, reject) => { setTimeout(() => resolve(undefined), duration) })
  return
}

export default delay
