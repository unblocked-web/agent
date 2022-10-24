import * as Os from 'os';
import { loadEnv, parseEnvBool, parseEnvPath } from '@ulixee/commons/lib/envUtils';

loadEnv(__dirname);

const env = process.env;
const envDebug = env.DEBUG ?? '';

export default {
  sslKeylogFile: env.SSLKEYLOGFILE,
  // TODO: this is insecure by default because golang 1.14 has an issue verifying certain certificate authorities:
  // https://github.com/golang/go/issues/24652
  // https://github.com/golang/go/issues/38365
  allowInsecure: parseEnvBool(env.UBK_MITM_ALLOW_INSECURE),
  enableMitmCache: parseEnvBool(env.UBK_MITM_ENABLED_CACHE),
  defaultStorageDirectory: parseEnvPath(
    (env.UBK_NETWORK_DIR ?? env.UBK_DATA_DIR)?.replace('<TMP>', Os.tmpdir()),
  ),
  isDebug:
    envDebug.includes('ubk:*') ||
    envDebug.includes('ubk*') ||
    envDebug === '*' ||
    envDebug.includes('ubk:mitm'),
};
