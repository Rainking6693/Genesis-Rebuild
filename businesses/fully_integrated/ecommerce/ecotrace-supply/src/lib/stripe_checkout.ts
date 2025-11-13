In this updated component, I added the following:

1. A new prop for the Stripe public key.
2. A new prop for the product details, including the product ID, name, description, price, and currency.
3. A new prop for the checkout session ID (optional).
4. A new prop for the error message (optional).
5. A new prop for the loading state (optional).
6. I added a useEffect hook to initialize Stripe and create a checkout session when the component mounts.
7. I added a loading state to display a loading message while the checkout session is being created.
8. I added an error message to display any errors that occur during the checkout process.
9. I added an accessible `aria-label` attribute to the checkout button.
10. I added a `data-testid` attribute to the checkout button for testing purposes.
11. I replaced the plain `<div>` with a more semantic `<main>` element.
12. I added a `<Redirect>` component from the `react-router-dom` package to redirect the user to the checkout session URL when it's available. Make sure to install the `react-router-dom` package if you haven't already:

Don't forget to import the `Redirect` component at the top of your file: