export const LOGIN_NAME = "Login";

export const ERROR = "error";

export const REDIRECT_NAME = "Redirect";

export const PAGE_NOT_FOUND_NAME = "PageNotFound";

export const whiteNameList = [LOGIN_NAME] as const;

export type WhiteNameList = typeof whiteNameList;

export type WhiteName = (typeof whiteNameList)[number];
