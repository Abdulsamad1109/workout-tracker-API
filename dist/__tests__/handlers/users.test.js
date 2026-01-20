"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const users_1 = require("../../__mocks__/users");
const users_2 = require("../../handlers/users");
describe('createUser', () => {
    it('should create a new user', () => {
        (0, users_2.createUser)(users_1.MockRequest, users_1.MockResponse);
        expect(users_1.MockResponse.send).toHaveBeenCalled();
    });
});
//# sourceMappingURL=users.test.js.map