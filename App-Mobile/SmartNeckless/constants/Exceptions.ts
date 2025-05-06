interface ApiException {
    statusCode: number;
    reasonPhrase: string;
    body: {
        error: string;
    };
}

export { ApiException };