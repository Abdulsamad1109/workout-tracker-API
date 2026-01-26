import { Request, Response } from 'express';
import * as usersHandler from '../../../handlers/users';
import { hashpassword } from '../../../helpers/hashpassword';

// Mock the dependencies
jest.mock('../../../helpers/hashpassword');

describe('createUser', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let statusMock: jest.Mock;
  let sendMock: jest.Mock;
  let mockUserRepository: any;
  let getUserRepositorySpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    
    sendMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ send: sendMock });
    
    mockRequest = {
      body: {
        firstname: 'Habeeb',
        lastname: 'Kareem',
        email: 'test@example.com',
        password: 'password123'
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

    // Spy on getUserRepository and return our mock
    getUserRepositorySpy = jest
      .spyOn(usersHandler, 'getUserRepository')
      .mockReturnValue(mockUserRepository);
  });

  afterEach(() => {
    getUserRepositorySpy.mockRestore();
  });

  describe('Successful user creation', () => {
    it('should create user and return 201 with user data without password', async () => {
      // Arrange
      const hashedPassword = 'hashed_password_123';
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        password: hashedPassword,
        firstname: 'Habeeb',
        lastname: 'Kareem'
      };

      mockUserRepository.findOne.mockResolvedValue(null); // No existing user
      (hashpassword as jest.Mock).mockReturnValue(hashedPassword); // Mock password hashing
      mockUserRepository.create.mockReturnValue(mockUser);
      mockUserRepository.save.mockResolvedValue(mockUser);

      // Act
      await usersHandler.createUser(mockRequest as Request, mockResponse as Response);

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

  
    describe('Duplicate email prevention', () => {
    it('should return 409 when email already exists', async () => {
      // Arrange
      const existingUser = {
        id: 1,
        email: 'test@example.com',
        password: 'hashed_password',
        firstname: 'Habeeb',
        lastname: 'Kareem'
      };

      mockUserRepository.findOne.mockResolvedValue(existingUser);

      // Act
      await usersHandler.createUser(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(statusMock).toHaveBeenCalledWith(409);
      expect(sendMock).toHaveBeenCalledWith({
        message: 'Email already exists'
      });
      expect(mockUserRepository.create).not.toHaveBeenCalled();
      expect(mockUserRepository.save).not.toHaveBeenCalled();
    });
  });


  describe('Password hashing', () => {
    it('should hash the password before saving', async () => {
      // Arrange
      const plainPassword = 'password123';
      const hashedPassword = 'hashed_password_123';
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        password: hashedPassword,
        firstname: 'Habeeb',
        lastname: 'Kareem'
      };

      mockUserRepository.findOne.mockResolvedValue(null);
      (hashpassword as jest.Mock).mockReturnValue(hashedPassword);
      mockUserRepository.create.mockReturnValue(mockUser);
      mockUserRepository.save.mockResolvedValue(mockUser);

      // Act
      await usersHandler.createUser(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(hashpassword).toHaveBeenCalledWith(plainPassword);
      expect(mockUserRepository.create).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: hashedPassword,
        firstname: 'Habeeb',
        lastname: 'Kareem'
      });
    });
  });
  

  describe('Password excluded from response', () => {
    it('should not include password in the response body', async () => {
      // Arrange
      const hashedPassword = 'hashed_password_123';
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        password: hashedPassword,
        firstname: 'Habeeb',
        lastname: 'Kareem'
      };

      mockUserRepository.findOne.mockResolvedValue(null);
      (hashpassword as jest.Mock).mockReturnValue(hashedPassword);
      mockUserRepository.create.mockReturnValue(mockUser);
      mockUserRepository.save.mockResolvedValue(mockUser);

      // Act
      await usersHandler.createUser(mockRequest as Request, mockResponse as Response);

      // Assert
      const responseCall = sendMock.mock.calls[0][0];
      expect(responseCall.user).not.toHaveProperty('password');
      expect(responseCall.user).toHaveProperty('email');
      expect(responseCall.user).toHaveProperty('firstname');
      expect(responseCall.user).toHaveProperty('lastname');
    });
  });
  

   describe('Error handling', () => {


    let consoleErrorSpy: jest.SpyInstance;

    beforeEach(() => {
      consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
      consoleErrorSpy.mockRestore();
    });


    it('should return 500 when database findOne operation fails', async () => {
      // Arrange
      mockUserRepository.findOne.mockRejectedValue(
        new Error('Database connection failed')
      );

      // Act
      await usersHandler.createUser(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(statusMock).toHaveBeenCalledWith(500);
      expect(sendMock).toHaveBeenCalledWith({
        message: 'Internal server error'
      });
    });

    it('should return 500 when database save operation fails', async () => {
      // Arrange
      mockUserRepository.findOne.mockResolvedValue(null);
      (hashpassword as jest.Mock).mockReturnValue('hashed_password');
      mockUserRepository.create.mockReturnValue({});
      mockUserRepository.save.mockRejectedValue(
        new Error('Save operation failed')
      );

      // Act
      await usersHandler.createUser(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(statusMock).toHaveBeenCalledWith(500);
      expect(sendMock).toHaveBeenCalledWith({
        message: 'Internal server error'
      });
    });
  });
  
});
