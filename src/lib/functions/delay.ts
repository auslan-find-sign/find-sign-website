/**
 * Delay until promise resolves
 */
export default async function delay (duration: number) {
  await new Promise((resolve, reject) => { setTimeout(() => resolve(undefined), duration) })
  return
}
