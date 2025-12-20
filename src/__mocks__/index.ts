import { Request, Response } from "express-serve-static-core";

export const MockRequest = {} as Request

export const MockResponse = {
    send: jest.fn(),
} as unknown as Response