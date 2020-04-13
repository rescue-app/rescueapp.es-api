const getCorsHeaders = () => {
    return {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': "Origin, Content-Type"
    };
}
const createResponse = (body, status, headers) => {
    var response = {
        body: body,
        statusCode: status,
        headers: headers,
    };

    return response;
}

const createPlainTextResponse = (body = '', status = 200, headers = {}) => {
    return createResponse(
        body,
        status,
        {
            ...headers,
            ...getCorsHeaders(),
            'Content-Type': 'text/plain'
        }
    );
}

const createJsonResponse = (data = {}, status = 200, headers = {}) => {
    return createResponse(
        JSON.stringify(data),
        status,
        {
            ...headers,
            ...getCorsHeaders(),
            'Content-Type': 'application/json'
        }
    );
}

const createJsonErrorResponse = (message = '', status = 400, headers = {}) => {
    return createResponse(
        JSON.stringify({error: message}),
        status,
        {
            ...headers,
            ...getCorsHeaders(),
            'Content-Type': 'application/json'
        }
    );
}

module.exports.createPlainTextResponse = createPlainTextResponse;
module.exports.createJsonResponse = createJsonResponse;
module.exports.createJsonErrorResponse = createJsonErrorResponse;
