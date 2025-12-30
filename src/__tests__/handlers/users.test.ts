import { MockRequest, MockResponse } from "../../__mocks__/users";
import { getAllUsers } from "../../handlers/users";

describe('getusers', () => {
    it('should return array of users', () => {
        getAllUsers(MockRequest, MockResponse);
        expect(MockResponse.send).toHaveBeenCalledWith([]);
    });
})