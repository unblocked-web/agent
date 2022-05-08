const envDebug = process.env.DEBUG ?? '';
export default {
  disableMitm: booleanOrUndefined(process.env.SA_DISABLE_MITM),
  showChrome: booleanOrUndefined(process.env.SA_SHOW_CHROME),
  disableDevtools: booleanOrUndefined(process.env.SA_DISABLE_DEVTOOLS),
  noChromeSandbox: booleanOrUndefined(process.env.SA_NO_CHROME_SANDBOX),
  disableGpu: booleanOrUndefined(process.env.SA_DISABLE_GPU),
  logDevtools:
    envDebug.includes('sa:*') ||
    envDebug.includes('sa*') ||
    envDebug === '*' ||
    envDebug.includes('sa:devtools'),
  isTest: process.env.NODE_ENV === 'test',
};

function booleanOrUndefined(envValue): boolean | undefined {
  if (envValue === undefined) return undefined;
  return Boolean(JSON.parse(envValue ?? 'false'));
}
