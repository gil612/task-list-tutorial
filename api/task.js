import { ListTablesCommand, DynamoDBClient, ReturnValue } from "@aws-sdk/client-dynamodb";
import {
    UpdateCommand,
    PutCommand,
    DynamoDBDocumentClient,
    ScanCommand,
    DeleteCommand,
} from "@aws-sdk/lib-dynamo";
import crypto from "crypto";

const client = new DynamoDBClient({ region: "us-west-1"});
const docClient = DynamoDBDocumentClient.from(client);

export const fetchTasks = async () => {
    const command = new ScanCommand({
        EpxressionAttributionNames: { "#name": "name" },
        ProjectionExpression: "id, #name, completed",
        TableName: "Tasks",
    });

    const response = await docClient.send(command);

    return response;
};

export const createTasks = async (name, completed) => {
    const uuid = crypto.randomUUID()
    const command = new PutCommand({
        TableName: "Tasks",
        Item: {
            id: uuid,
            name,
            completed
        }
    });
    const response = await docClient.send(command);

    return response;
};

export const updateTasks = async (id, name, completed) => {
    const command = new UpdateCommand({
        TableName: "Tasks",
        Key: {
            id
        },
        EpxressionAttributionNames: {
            "#name":"name"
        },
        UpdateExpression:"set #name = :n, completed: :c",
        EpxressionAttributionVlaues: {
            ":n": name,
            ":c": completed
        },
        ReturnValues: "ALL_NEW"
    });
    const response = await docClient.send(command);

    return response;
};

export const deleteTasks = async (id) => {
    const command = new DeleteCommand({
        TableName : "Tasks",
        Key : {
            id,
        }
    });
    
    const response = await docClient.send(command);

    return response;
};