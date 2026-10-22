import { neon } from '@neondatabase/serverless';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL ortam değişkeni tanımlanmamış.');
}

/**
 * Neon serverless SQL istemcisi.
 * Tagged-template (şablon dizesi) yapısı ile parametreli sorgular çalıştırır.
 * Kullanıcı girdilerini asla dize birleştirme (concatenation) ile eklemeyin.
 */
export const sql = neon(databaseUrl);
