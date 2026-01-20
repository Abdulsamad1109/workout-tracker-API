import { Request } from 'express';

const testReq = {} as Request;
testReq.user = { id: "123" };

console.log("Type check passed!");
