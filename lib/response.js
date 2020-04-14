const getCorsHeaders = () => {
    return {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': "Origin, Content-Type"
    };
}
const createResponse = (body, status, headers) => {
    return {
        body: body,
        statusCode: status,
        headers: headers,
    };
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
        JSON.stringify({error: message.toString()}),
        status,
        {
            ...headers,
            ...getCorsHeaders(),
            'Content-Type': 'application/json'
        }
    );
}

const createRedirectResponse = (url = '', permanent = true) => {
    return createResponse(
        undefined, 
        permanent? 301: 302,
        {
            Location: url,
        }
    );
}

module.exports.createPlainTextResponse = createPlainTextResponse;
module.exports.createJsonResponse = createJsonResponse;
module.exports.createJsonErrorResponse = createJsonErrorResponse;
module.exports.createRedirectResponse = createRedirectResponse;
