import 'source-map-support/register'

import {APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult} from 'aws-lambda'
import * as AWS from "aws-sdk";
import {parseUserId} from "../../auth/utils";

const docClient = new AWS.DynamoDB.DocumentClient();
const todoTable = process.env.TODOS_TABLE;

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    const todoId = event.pathParameters.todoId as string;
    const userId = parseUserId(event.headers.Authorization);

    const params = {
        TableName: todoTable,
        Key: {
            "userId": userId,
            "todoId": todoId
        }
    };

    console.log(params);
    const returnValue = await docClient.delete(params).promise()

    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
            returnValue
        })
    }
}
