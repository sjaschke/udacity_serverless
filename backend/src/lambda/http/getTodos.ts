import 'source-map-support/register'

import {APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult} from 'aws-lambda'
import * as AWS from "aws-sdk";
import {parseUserId} from "../../auth/utils";

const docClient = new AWS.DynamoDB.DocumentClient();
const todoTable = process.env.TODOS_TABLE;
const indexName = process.env.INDEX_NAME;

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    const userId = parseUserId(event.headers.Authorization);

    const result = await docClient.query({
        TableName: todoTable,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
            ':userId': userId
        },
        IndexName: indexName,
        ScanIndexForward: false
    }).promise()

    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
            items: result.Items
        })
    }
}
