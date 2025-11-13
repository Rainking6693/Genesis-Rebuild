2. Use DOMPurify's `sanitize` method to sanitize the HTML:

3. Add error handling for the case when the `sanitizeHtml` function fails:

4. Add a fallback text for the case when the `message` prop is empty:

5. Add a type for the `Props` interface to ensure type safety:

6. Use `React.ForwardRef` to make the component controllable via refs:

7. Add a `displayName` property to make it easier to identify the component in the React DevTools: