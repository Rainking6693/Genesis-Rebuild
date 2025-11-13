module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/setupTests.ts'],
};

This code includes tests for rendering the component with a message and className, handling edge cases where the message is empty or null, testing the unique key, and verifying that the provided className is applied. Additionally, I've added a data-testid attribute to the key for easier testing.

To run the tests, you'll need to install Jest and React Testing Library:

Then, create a `jest.config.js` file in your project root with the following content:

Finally, create a `setupTests.ts` file in your project root with the following content: