import { validate } from 'uuid';

interface User {
  id: string;
  email: string;
  password: string;
}

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

interface AuthError {
  message: string;
}

interface AuthService {
  authenticate: (user: User) => Promise<AuthResponse | AuthError>;
  refreshAccessToken: (refreshToken: string) => Promise<AuthResponse | AuthError>;
}

class UserAuth implements AuthService {
  private authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  async authenticate(user: User): Promise<AuthResponse | AuthError> {
    if (!validate(user.id)) {
      throw new Error('Invalid user ID');
    }

    try {
      const authResult = await this.authService.authenticate(user);
      if (authResult instanceof Error) {
        throw authResult;
      }
      return authResult;
    } catch (error) {
      return {
        message: error.message,
      };
    }
  }

  async refreshAccessToken(refreshToken: string): Promise<AuthResponse | AuthError> {
    if (!refreshToken) {
      throw new Error('Missing refresh token');
    }

    try {
      const authResult = await this.authService.refreshAccessToken(refreshToken);
      if (authResult instanceof Error) {
        throw authResult;
      }
      return authResult;
    } catch (error) {
      return {
        message: error.message,
      };
    }
  }
}

// Usage example:
const authService = {
  authenticate: async (user: User): Promise<AuthResponse | AuthError> => {
    // Authentication logic here
    // ...
  },
  refreshAccessToken: async (refreshToken: string): Promise<AuthResponse | AuthError> => {
    // Refresh access token logic here
    // ...
  },
};

const userAuth = new UserAuth(authService);

// Call the authenticate method with a user object
userAuth
  .authenticate({
    id: '123e4567-e89b-12d3-a456-426655440000',
    email: 'user@example.com',
    password: 'password123',
  })
  .then((result) => {
    if (result instanceof AuthResponse) {
      console.log('Successfully authenticated:', result);
    } else {
      console.error('Authentication error:', result.message);
    }
  })
  .catch((error) => {
    console.error('Error:', error.message);
  });

import { validate } from 'uuid';

interface User {
  id: string;
  email: string;
  password: string;
}

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

interface AuthError {
  message: string;
}

interface AuthService {
  authenticate: (user: User) => Promise<AuthResponse | AuthError>;
  refreshAccessToken: (refreshToken: string) => Promise<AuthResponse | AuthError>;
}

class UserAuth implements AuthService {
  private authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  async authenticate(user: User): Promise<AuthResponse | AuthError> {
    if (!validate(user.id)) {
      throw new Error('Invalid user ID');
    }

    try {
      const authResult = await this.authService.authenticate(user);
      if (authResult instanceof Error) {
        throw authResult;
      }
      return authResult;
    } catch (error) {
      return {
        message: error.message,
      };
    }
  }

  async refreshAccessToken(refreshToken: string): Promise<AuthResponse | AuthError> {
    if (!refreshToken) {
      throw new Error('Missing refresh token');
    }

    try {
      const authResult = await this.authService.refreshAccessToken(refreshToken);
      if (authResult instanceof Error) {
        throw authResult;
      }
      return authResult;
    } catch (error) {
      return {
        message: error.message,
      };
    }
  }
}

// Usage example:
const authService = {
  authenticate: async (user: User): Promise<AuthResponse | AuthError> => {
    // Authentication logic here
    // ...
  },
  refreshAccessToken: async (refreshToken: string): Promise<AuthResponse | AuthError> => {
    // Refresh access token logic here
    // ...
  },
};

const userAuth = new UserAuth(authService);

// Call the authenticate method with a user object
userAuth
  .authenticate({
    id: '123e4567-e89b-12d3-a456-426655440000',
    email: 'user@example.com',
    password: 'password123',
  })
  .then((result) => {
    if (result instanceof AuthResponse) {
      console.log('Successfully authenticated:', result);
    } else {
      console.error('Authentication error:', result.message);
    }
  })
  .catch((error) => {
    console.error('Error:', error.message);
  });