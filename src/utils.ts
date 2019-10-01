/**
 * Source data may contain ' and " which may broke your sql, escape them using this function.
 */
export const escape = (source: string): string => {
  return source.replace(/"/g, `'`).replace(/'/g, `''`);
};
