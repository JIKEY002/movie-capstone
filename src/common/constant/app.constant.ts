import 'dotenv/config';

export const APP_PORT = process.env.PORT || 3000;
export const DATABASE_HOST = process.env.DATABASE_HOST || '127.0.0.1';
export const DATABASE_PORT = process.env.DATABASE_PORT || '3307';
export const DATABASE_USER = process.env.DATABASE_USER || 'root';
export const DATABASE_PASSWORD =
    process.env.DATABASE_PASSWORD || 'KhanhPro841329@';
export const DATABASE_NAME = process.env.DATABASE_NAME || 'movie_capstone';

export const ACCESS_TOKEN_SECRET =
    process.env.ACCESS_TOKEN_SECRET || 'default_access_token_secret';
export const REFRESH_TOKEN_SECRET =
    process.env.REFRESH_TOKEN_SECRET || 'default_refresh_token_secret';

console.log({
    APP_PORT,
    DATABASE_HOST,
    DATABASE_PORT,
    DATABASE_USER,
    DATABASE_PASSWORD,
    DATABASE_NAME,
    ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET,
});
