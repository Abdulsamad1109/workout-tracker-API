import { Request, Response } from 'express';
import { createUser } from '../../handlers/users';
import { AppDataSource } from '../../data-source'; 
import { User } from '../../entities/userEntity';
import { hashpassword } from '../../helpers/hashpassword'; 

// Mock dependencies
jest.mock('../../data-source');
jest.mock('../../helpers');

describe('createUser', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let statusMock: jest.Mock;
  let sendMock: jest.Mock;
  let mockUserRepository: any;

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    
    sendMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ send: sendMock });
    
    mockRequest = {
      body: {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User'
      }
    };
    
    mockResponse = {
      status: statusMock,
      send: sendMock
    };

    // Mock the repository
    mockUserRepository = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn()
    };

    (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockUserRepository);
  });

  describe('Successful user creation', () => {
    it('should create user and return 201 with user data without password', async () => {
      // Arrange
      const hashedPassword = 'hashed_password_123';
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        password: hashedPassword,
        name: 'Test User'
      };

      mockUserRepository.findOne.mockResolvedValue(null);
      (hashpassword as jest.Mock).mockReturnValue(hashedPassword);
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
          name: 'Test User'
          // password should NOT be here
        }
      });
    });
  });




  

});