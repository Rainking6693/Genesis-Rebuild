type NumberOrString = number | string | null | undefined;

function isValidNumber(value: NumberOrString): value is number {
  return typeof value === 'number' && !isNaN(value);
}

function isValidNumberOrString(value: NumberOrString): value is number | string {
  return typeof value === 'string' || isValidNumber(value);
}

function safeParseNumber(value: NumberOrString): number | undefined {
  if (value === null || value === undefined) {
    return undefined;
  }

  const parsedNumber = isValidNumberOrString(value) ? Number(value) : value;

  if (isNaN(parsedNumber)) {
    return undefined;
  }

  return parsedNumber;
}

function addTwoNumbers(a: NumberOrString, b: NumberOrString): number {
  const parsedA = safeParseNumber(a);
  const parsedB = safeParseNumber(b);

  if (parsedA === undefined || parsedB === undefined) {
    throw new Error('Both arguments must be valid numbers.');
  }

  return parsedA + parsedB;
}

type NumberOrString = number | string | null | undefined;

function isValidNumber(value: NumberOrString): value is number {
  return typeof value === 'number' && !isNaN(value);
}

function isValidNumberOrString(value: NumberOrString): value is number | string {
  return typeof value === 'string' || isValidNumber(value);
}

function safeParseNumber(value: NumberOrString): number | undefined {
  if (value === null || value === undefined) {
    return undefined;
  }

  const parsedNumber = isValidNumberOrString(value) ? Number(value) : value;

  if (isNaN(parsedNumber)) {
    return undefined;
  }

  return parsedNumber;
}

function addTwoNumbers(a: NumberOrString, b: NumberOrString): number {
  const parsedA = safeParseNumber(a);
  const parsedB = safeParseNumber(b);

  if (parsedA === undefined || parsedB === undefined) {
    throw new Error('Both arguments must be valid numbers.');
  }

  return parsedA + parsedB;
}