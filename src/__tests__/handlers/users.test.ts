import { Request, Response } from 'express';

// Mock BEFORE any imports that use them
const mockGetRepository = jest.fn();
const mockHashpassword = jest.fn();

jest.mock('../../data-source', () => ({
  AppDataSource: {
    getRepository: mockGetRepository
  }
}));

jest.mock('../../helpers/hashpassword', () => ({
  hashpassword: mockHashpassword
}));

// NOW we can import after mocks are established
import { createUser } from '../../handlers/users';
import { hashpassword } from '../../helpers/hashpassword';

describe('createUser', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let statusMock: jest.Mock;
  let sendMock: jest.Mock;
  let mockUserRepository: any;

  beforeEach(() => {
    jest.clearAllMocks();
    
    sendMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ send: sendMock });
    
    mockRequest = {
      body: {
        firstname: 'Habeeb',
        lastname: 'Kareem',
        email: 'test@example.com',
        password: 'password123',
      }
    };
    
    mockResponse = {
      status: statusMock,
      send: sendMock
    };

    // Setup repository mock
    mockUserRepository = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn()
    };

    // This needs to be set up BEFORE the module loads
    mockGetRepository.mockReturnValue(mockUserRepository);
  });

  describe('Successful user creation', () => {
    it('should create user and return 201 with user data without password', async () => {
      // Arrange
      const hashedPassword = 'hashed_password_123';
      const mockUser = {
        id: 1,
        firstname: 'Habeeb',
        lastname: 'Kareem',
        email: 'test@example.com',
        password: hashedPassword,
      };

      mockUserRepository.findOne.mockResolvedValue(null); // No existing user
      mockHashpassword.mockReturnValue(hashedPassword); // Mock hashed password
      mockUserRepository.create.mockReturnValue(mockUser);
      mockUserRepository.save.mockResolvedValue(mockUser);

      // Act
      await createUser(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(statusMock).toHaveBeenCalledWith(201);
      expect(sendMock).toHaveBeenCalledWith({
        message: 'User created successfully',
        user: {
          id: 1,
          email: 'test@example.com',
          firstname: 'Habeeb',
          lastname: 'Kareem'
        }
      });
    });
  });




  
});