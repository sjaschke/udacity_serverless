import 'source-map-support/register'
import * as uuid from 'uuid'
import * as AWS  from 'aws-sdk'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import {parseUserId} from "../../auth/utils";

const docClient = new AWS.DynamoDB.DocumentClient()
const todoTable = process.env.TODOS_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  const userId = parseUserId(event.headers.Authorization);
  const itemId = uuid.v4()
  const newTodo: CreateTodoRequest = JSON.parse(event.body)

  const item = {
    todoId: itemId,
    userId: userId,
    createdAt: new Date().toISOString(),
    ...newTodo
  }

  console.log(item);

  const result = await docClient.put({
    TableName: todoTable,
    Item: item
  }).promise()

  console.log(result);
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      item
    })
  }
}
