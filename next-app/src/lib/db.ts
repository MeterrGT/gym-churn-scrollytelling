import { neon } from '@neondatabase/serverless';

const databaseUrl =
  process.env.DATABASE_URL ||
  'postgres://dummy_build:dummy_build@ep-dummy-build.neon.tech/dummy';

/**
 * Neon serverless SQL istemcisi.
 * Tagged-template (şablon dizesi) yapısı ile parametreli sorgular çalıştırır.
 * Kullanıcı girdilerini asla dize birleştirme (concatenation) ile eklemeyin.
 */
export const sql = neon(databaseUrl);
