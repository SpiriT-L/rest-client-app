export type HttpMethod =
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'DELETE'
  | 'PATCH'
  | 'HEAD'
  | 'OPTIONS';

export interface Header {
  key: string;
  value: string;
}

export interface RestClientState {
  method: HttpMethod;
  url: string;
  headers: Header[];
  body: string;
  response: {
    status: number | null;
    body: string;
    ok: string;
  };
}

export interface CodeGenerator {
  name: string;
  generate: (state: RestClientState) => string;
}
