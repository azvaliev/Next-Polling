type Args = [RequestInfo, RequestInit];

const fetcher = (...args: Args) => fetch(...args).then((res) => res.json());

export default fetcher;
