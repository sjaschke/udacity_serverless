import * as AWS  from 'aws-sdk'
const AWSXRay = require('aws-xray-sdk');
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

const XAWS = AWSXRay.captureAWS(AWS);
const docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient();

import {Todo} from "../../../client/src/types/Todo";
import * as uuid from "uuid";
import {CreateTodoRequest} from "../requests/CreateTodoRequest";
import {UpdateTodoRequest} from "../requests/UpdateTodoRequest";

const todoTable = process.env.TODOS_TABLE;
const indexName = process.env.INDEX_NAME;

import { createLogger } from '../utils/logger'
const logger = createLogger('dynamoDB')

export async function getUsersTodos(userId: string): Promise<Todo[]> {
    const result = await docClient.query({
        TableName: todoTable,
        KeyConditionExpression: '#userId = :userId',
        ExpressionAttributeNames: {
            "#userId": "userId"
        },
        ExpressionAttributeValues: {
            ':userId': userId
        },
        IndexName: indexName,
        ScanIndexForward: false
    }).promise()
    logger.info('getUsersTodos itmes:' + result.Items.length);
    return result.Items as Todo[];
}

export async function deleteTodo(todoId: string, userId: string) {
    const params = {
        TableName: todoTable,
        Key: {
            "userId": userId,
            "todoId": todoId
        }
    };
    return await docClient.delete(params).promise();
}

export async function createTodo(todoRequest: CreateTodoRequest, userId: string): Promise<Todo> {

    const itemId = uuid.v4()
    const item = {
        todoId: itemId,
        userId: userId,
        createdAt: new Date().toISOString(),
        done: false,
        ...todoRequest
    }

    await docClient.put({
        TableName: todoTable,
        Item: item
    }).promise()

    return item as Todo;
}

export async function updateTodo(todoId: string, updatedTodo: UpdateTodoRequest, userId: string): Promise<Todo> {
    const params = {
        TableName: todoTable,
        Key: {
            "userId": userId,
            "todoId": todoId
        },
        UpdateExpression: "set #name = :name, #dueDate = :dueDate, #done = :done",
        ExpressionAttributeNames: {
            "#name": "name",
            "#dueDate": "dueDate",
            "#done": "done"
        },
        ExpressionAttributeValues: {
            ":name": updatedTodo.name,
            ":dueDate": updatedTodo.dueDate,
            ":done": updatedTodo.done
        },
        ReturnValues: "ALL_NEW"
    };
    const result = await docClient.update(params).promise();
    return result.Attributes as Todo;
}

export async function setAttachmentURL(todoId: string, userId: string, url: string) {
    const params = {
        TableName: todoTable,
        Key: {
            "userId": userId,
            "todoId": todoId
        },
        UpdateExpression: "set #url = :url",
        ExpressionAttributeNames: {
            "#url": "attachmentUrl"
        },
        ExpressionAttributeValues: {
            ":url": url
        },
        ReturnValues: "ALL_NEW"
    };
    console.info(params)
    const result = await docClient.update(params).promise();
    console.info(result)
    return;
}
