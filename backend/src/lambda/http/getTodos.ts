import 'source-map-support/register'

import {APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult} from 'aws-lambda'

import {parseUserId} from "../../auth/utils";
import {getUsersTodos} from "../../lib/TodoDAO";

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    let userId = parseUserId(event.headers.Authorization);
    let result = await getUsersTodos(userId);

    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
            items: result
        })
    }
}
