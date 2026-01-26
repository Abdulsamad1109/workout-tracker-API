import { Request, Response } from 'express';
import * as usersHandler from '../../../handlers/users';
import { hashpassword } from '../../../helpers/hashpassword';

// Mock helpers
jest.mock('../../../helpers/hashpassword');

describe('updateUser', () => {
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
      user: {
        id: 'user-123'
      },
      body: {
        firstname: 'Updated',
        lastname: 'Name'
      }
    };
    
    mockResponse = {
      status: statusMock,
      send: sendMock
    };

    // Setup repository mock
    mockUserRepository = {
      findOne: jest.fn(),
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

  describe('Authorization', () => {
    it('should return 401 when user is not authenticated', async () => {
      // Arrange
      delete mockRequest.user;

      // Act
      await usersHandler.updateUser(
        mockRequest as Request<{}, {}, any, {}>,
        mockResponse as Response
      );

      // Assert
      expect(statusMock).toHaveBeenCalledWith(401);
      expect(sendMock).toHaveBeenCalledWith({
        message: 'Unauthorized'
      });
      expect(mockUserRepository.findOne).not.toHaveBeenCalled();
    });
  });

  describe('User not found', () => {
    it('should return 404 when user does not exist', async () => {
      // Arrange
      mockUserRepository.findOne.mockResolvedValue(null);

      // Act
      await usersHandler.updateUser(
        mockRequest as Request<{}, {}, any, {}>,
        mockResponse as Response
      );

      // Assert
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'user-123' }
      });
      expect(statusMock).toHaveBeenCalledWith(404);
      expect(sendMock).toHaveBeenCalledWith({
        message: 'User not found'
      });
    });
  });

  describe('Successful updates', () => {
    it('should update user with basic fields and return 200', async () => {
      // Arrange
      const existingUser = {
        id: 'user-123',
        email: 'test@example.com',
        firstname: 'John',
        lastname: 'Doe',
        password: 'hashed_password'
      };

      const updatedUser = {
        ...existingUser,
        firstname: 'Updated',
        lastname: 'Name'
      };

      mockUserRepository.findOne.mockResolvedValue(existingUser);
      mockUserRepository.save.mockResolvedValue(updatedUser);

      // Act
      await usersHandler.updateUser(
        mockRequest as Request<{}, {}, any, {}>,
        mockResponse as Response
      );

      // Assert
      expect(mockUserRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          firstname: 'Updated',
          lastname: 'Name'
        })
      );
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(sendMock).toHaveBeenCalledWith({
        message: 'User updated successfully',
        user: {
          id: 'user-123',
          email: 'test@example.com',
          firstname: 'Updated',
          lastname: 'Name'
        }
      });
    });

    it('should update email when new email does not exist', async () => {
      // Arrange
      const existingUser = {
        id: 'user-123',
        email: 'old@example.com',
        firstname: 'John',
        lastname: 'Doe',
        password: 'hashed_password'
      };

      const updatedUser = {
        ...existingUser,
        email: 'new@example.com'
      };

      mockRequest.body = {
        email: 'new@example.com'
      };

      // First call returns the user, second call checks if new email exists (returns null)
      mockUserRepository.findOne
        .mockResolvedValueOnce(existingUser)
        .mockResolvedValueOnce(null);
      mockUserRepository.save.mockResolvedValue(updatedUser);

      // Act
      await usersHandler.updateUser(
        mockRequest as Request<{}, {}, any, {}>,
        mockResponse as Response
      );

      // Assert
      expect(mockUserRepository.findOne).toHaveBeenCalledTimes(2);
      expect(mockUserRepository.findOne).toHaveBeenNthCalledWith(2, {
        where: { email: 'new@example.com' }
      });
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(sendMock).toHaveBeenCalledWith({
        message: 'User updated successfully',
        user: expect.objectContaining({
          email: 'new@example.com'
        })
      });
    });
  });

  describe('Duplicate email prevention', () => {
    it('should return 409 when updating to an existing email', async () => {
      // Arrange
      const existingUser = {
        id: 'user-123',
        email: 'old@example.com',
        firstname: 'John',
        lastname: 'Doe',
        password: 'hashed_password'
      };

      const otherUser = {
        id: 'user-456',
        email: 'taken@example.com',
        firstname: 'Jane',
        lastname: 'Smith',
        password: 'hashed_password'
      };

      mockRequest.body = {
        email: 'taken@example.com'
      };

      // First call returns the user, second call finds email already exists
      mockUserRepository.findOne
        .mockResolvedValueOnce(existingUser)
        .mockResolvedValueOnce(otherUser);

      // Act
      await usersHandler.updateUser(
        mockRequest as Request<{}, {}, any, {}>,
        mockResponse as Response
      );

      // Assert
      expect(statusMock).toHaveBeenCalledWith(409);
      expect(sendMock).toHaveBeenCalledWith({
        message: 'Email already exists'
      });
      expect(mockUserRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('Password hashing', () => {
    it('should hash password when password is being updated', async () => {
      // Arrange
      const existingUser = {
        id: 'user-123',
        email: 'test@example.com',
        firstname: 'John',
        lastname: 'Doe',
        password: 'old_hashed_password'
      };

      const hashedPassword = 'new_hashed_password';

      mockRequest.body = {
        password: 'newPassword123'
      };

      mockUserRepository.findOne.mockResolvedValue(existingUser);
      (hashpassword as jest.Mock).mockReturnValue(hashedPassword);
      mockUserRepository.save.mockResolvedValue({
        ...existingUser,
        password: hashedPassword
      });

      // Act
      await usersHandler.updateUser(
        mockRequest as Request<{}, {}, any, {}>,
        mockResponse as Response
      );

      // Assert
      expect(hashpassword).toHaveBeenCalledWith('newPassword123');
      expect(mockUserRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          password: hashedPassword
        })
      );
    });
  });

  describe('Password excluded from response', () => {
    it('should not include password in response body', async () => {
      // Arrange
      const existingUser = {
        id: 'user-123',
        email: 'test@example.com',
        firstname: 'John',
        lastname: 'Doe',
        password: 'hashed_password'
      };

      mockUserRepository.findOne.mockResolvedValue(existingUser);
      mockUserRepository.save.mockResolvedValue(existingUser);

      // Act
      await usersHandler.updateUser(
        mockRequest as Request<{}, {}, any, {}>,
        mockResponse as Response
      );

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
    
    it('should return 500 when database operation fails', async () => {
      // Arrange
      mockUserRepository.findOne.mockRejectedValue(
        new Error('Database connection failed')
      );

      // Act
      await usersHandler.updateUser(
        mockRequest as Request<{}, {}, any, {}>,
        mockResponse as Response
      );

      // Assert
      expect(statusMock).toHaveBeenCalledWith(500);
      expect(sendMock).toHaveBeenCalledWith({
        message: 'Internal server error'
      });
    });
  });
});