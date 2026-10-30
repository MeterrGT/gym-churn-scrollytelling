import { neon } from '@neondatabase/serverless';

const databaseUrl =
  process.env.DATABASE_URL ||
  'postgres://build_user:build_password@127.0.0.1:5432/build_db';

/**
 * Neon serverless SQL istemcisi.
 * Tagged-template (şablon dizesi) yapısı ile parametreli sorgular çalıştırır.
 * Kullanıcı girdilerini asla dize birleştirme (concatenation) ile eklemeyin.
 */
export const sql = neon(databaseUrl);
