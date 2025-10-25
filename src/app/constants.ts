export enum Routes {
  HOME = "/",
  PRODUCTS = "/products",
  CLIENTS = "/clients",
  SALES = "/sales",
  SIGN_UP = "/sign-up",
  LOGIN = "/login",
}

export enum TimeInMs {
  ONE_MILLISECOND = 1,
  ONE_SECOND = 1000 * ONE_MILLISECOND,
  ONE_MINUTE = 60 * ONE_SECOND,
  FIVE_MINUTES = 5 * ONE_MINUTE,
  TEN_MINUTES = 10 * ONE_MINUTE,
  THIRTY_MINUTES = 30 * ONE_MINUTE,
  ONE_HOUR = 60 * ONE_MINUTE,
  ONE_DAY = 24 * ONE_HOUR,
  ONE_WEEK = 7 * ONE_DAY,
  ONE_MONTH = 30 * ONE_DAY,
  ONE_YEAR = 365 * ONE_DAY,
}
