/**
 * Select [quantity] items from [array]. By default returns a string in single
 * mode, unless {array: true} is passed in the options object. Doesn't allow
 * duplicates unless {subtractive: false} is passed in the options object.
 */
export default function randomFrom(
  source: Array<any>,
  quantity = 1,
  options = {
    subtractive: true,
  },
) {
  // Error if input is not compatiable
  if (!Array.isArray(source)) throw new Error(`${source} is not an array`);

  // Error if in subtractive mode and requested quantity is larger than input
  if (options.subtractive && quantity > source.length)
    throw new Error(
      `Requested quantity ${quantity} is greater than the ${source.length} available items`,
    );

  // Return a single item in single mode (no array)
  if (quantity === 1) return source[Math.floor(Math.random() * source.length)];

  // Pick random items as if from a hat
  const availableEntries = [...source];
  const selectedEntries = [];
  for (let i = 0; quantity > i; i++) {
    const randomIndex = Math.floor(Math.random() * availableEntries.length);
    selectedEntries.push(availableEntries[randomIndex]);
    if (options.subtractive) availableEntries.splice(randomIndex, 1);
  }
  return selectedEntries;
}
