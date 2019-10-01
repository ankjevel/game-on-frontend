export type RouteParamsLocation = {
  pathname: string
  search: string
  hash: string
  key: string
}

export type RouteParams = {
  history: {
    length: number
    action: string
    location: RouteParamsLocation
  }
  location: RouteParamsLocation
  match: {
    path: string
    url: string
    isExact: boolean
    params: { [key: string]: string }
  }
}

export type ERoute =
  | '/'
  | '/sign-in'
  | '/sign-out'
  | '/create'
  | '/group'
  | '/action'
  | '/wait'

export interface IRoute {
  (params?: RouteParams): JSX.Element
}

export interface IMaybeRedirect {
  (props: RouteParams, validRoute: ERoute | ERoute[]): JSX.Element | false
}
