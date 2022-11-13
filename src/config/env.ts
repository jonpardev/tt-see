import dotenv from 'dotenv';

if (process.env.NODE_ENV) dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

const returnEnvOrThrowError = (varName: string): string => {
    const envVar = process.env[varName];
    if (!envVar) throw new Error(`[ENV_ERROR] Set environment variable: ${varName}`);
    return envVar;
}

export const PORT = process.env.PORT || '5000'; // has default
export const ORIGIN_URI = returnEnvOrThrowError('ORIGIN_URI');
export const DB_URI = returnEnvOrThrowError('DB_URI');
export const OFFICIAL_URI = returnEnvOrThrowError('OFFICIAL_URI');