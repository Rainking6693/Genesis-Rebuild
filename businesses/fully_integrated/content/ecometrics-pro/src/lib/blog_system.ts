In this updated code, I've added the following improvements:

1. Added `children` prop to allow for more flexibility in the component's content.
2. Added `className` prop to allow for custom styling.
3. Added `ariaLabel` prop to improve accessibility.
4. Created a `getClasses` utility function to simplify the handling of class names.
5. Updated the component to accept optional props.
6. Added a check for `children` before rendering the `message`.

Now, the component can be used as follows: