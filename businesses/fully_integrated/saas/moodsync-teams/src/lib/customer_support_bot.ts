In this version, I've added the following improvements:

1. Added a `useRef` to store the DOM element for easier access and error handling.
2. Moved the error handling to a `useEffect` hook, which will only run when the `message` or `onError` props change.
3. Added a default value for the `onError` prop, which will log the error to the console if not provided.
4. Added support for the `aria-label` prop to improve accessibility.

I've also updated the unit tests to reflect these changes: