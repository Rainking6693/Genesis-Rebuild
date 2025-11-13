interface Email {
  value: string;
  isValid: boolean;
}

function validateEmail(email: string): Email {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const emailObj: Email = { value: email, isValid: re.test(email) };
  return emailObj;
}

function formatEmails(emails: string[]): string[] {
  return emails.map((email) => email.trim().toLowerCase());
}

function isValidEmail(email: Email): boolean {
  return email.isValid;
}

function filterInvalidEmails(emails: Email[]): Email[] {
  return emails.filter(isValidEmail);
}

function emailMarketingComponent(emails: string[]): void {
  const formattedEmails = formatEmails(emails);
  const validatedEmails = formattedEmails.map(validateEmail);
  const filteredEmails = filterInvalidEmails(validatedEmails);

  if (filteredEmails.length === 0) {
    console.error("No valid emails found.");
    return;
  }

  // Implement your email marketing logic here.
  // For example, sending emails or storing them for later use.

  console.log(`Sending emails to: ${filteredEmails.map((email) => email.value).join(", ")}`);
}

const emails = ["test@example.com", "invalidEmail", "test2@example.com"];
emailMarketingComponent(emails);

interface Email {
  value: string;
  isValid: boolean;
}

function validateEmail(email: string): Email {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const emailObj: Email = { value: email, isValid: re.test(email) };
  return emailObj;
}

function formatEmails(emails: string[]): string[] {
  return emails.map((email) => email.trim().toLowerCase());
}

function isValidEmail(email: Email): boolean {
  return email.isValid;
}

function filterInvalidEmails(emails: Email[]): Email[] {
  return emails.filter(isValidEmail);
}

function emailMarketingComponent(emails: string[]): void {
  const formattedEmails = formatEmails(emails);
  const validatedEmails = formattedEmails.map(validateEmail);
  const filteredEmails = filterInvalidEmails(validatedEmails);

  if (filteredEmails.length === 0) {
    console.error("No valid emails found.");
    return;
  }

  // Implement your email marketing logic here.
  // For example, sending emails or storing them for later use.

  console.log(`Sending emails to: ${filteredEmails.map((email) => email.value).join(", ")}`);
}

const emails = ["test@example.com", "invalidEmail", "test2@example.com"];
emailMarketingComponent(emails);

You can call the `emailMarketingComponent` function with a list of emails like this: