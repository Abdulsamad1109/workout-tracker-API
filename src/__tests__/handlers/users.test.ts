import { MockRequest, MockResponse } from "../../__mocks__/users";
import { createUser } from "../../handlers/users";

describe('createUser', () => {
    it('should create a new user', () => {
        createUser(MockRequest, MockResponse);
        expect(MockResponse.send).toHaveBeenCalled();
    });
})