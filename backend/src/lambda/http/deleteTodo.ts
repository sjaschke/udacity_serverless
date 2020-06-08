import 'source-map-support/register'

import {APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult} from 'aws-lambda'
import {parseUserId} from "../../auth/utils";
import {deleteTodo} from "../../lib/TodoDAO";

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    const todoId = event.pathParameters.todoId as string;
    const userId = parseUserId(event.headers.Authorization);

    await deleteTodo(todoId, userId)

    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        body: "{}"
    }
}
