In this updated version, I've added the following improvements:

1. Use the `useId` hook from React to generate unique IDs for each referral message, ensuring that they are unique even when the component is rendered multiple times.
2. Added a `termsAndConditionsHref` prop to allow passing the URL for the terms and conditions.
3. Added ARIA attributes (`aria-labelledby` and `title`) to improve accessibility for screen readers.
4. Wrapped the message inside an `<abbr>` element with a `title` attribute to provide a more accessible experience for screen readers.

Now, you can use the updated component like this: