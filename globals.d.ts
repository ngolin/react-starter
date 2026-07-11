type Unwrap<T> = T extends Promise<infer U> ? Unwrap<U> : T;
type PageParams<P extends string> = Unwrap<PageProps<P>['params']>;

type ParamValue = string | Array<string> | undefined;

type Falsy = false | '' | 0 | 0n | null | undefined;

interface Window {
  _hm: any[];
}
