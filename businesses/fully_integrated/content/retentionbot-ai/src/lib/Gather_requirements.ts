type ContentRequirement = {
  contentType: string;
  contentLanguage: string;
  accessibilityLevel?: string; // optional
  minWordCount?: number; // optional
  maxWordCount?: number; // optional
};

function gatherContentRequirements(reqs: ContentRequirement[]): ContentRequirement[] {
  return reqs.map((req) => {
    const validContentTypes = ['article', 'video', 'audio'];
    if (!validContentTypes.includes(req.contentType)) {
      throw new Error(`Invalid content type: ${req.contentType}`);
    }

    const validLanguages = ['en', 'es', 'fr', 'de', 'it'];
    if (!validLanguages.includes(req.contentLanguage)) {
      throw new Error(`Invalid content language: ${req.contentLanguage}`);
    }

    if (req.accessibilityLevel && !['A', 'AA', 'AAA'].includes(req.accessibilityLevel)) {
      throw new Error(`Invalid accessibility level: ${req.accessibilityLevel}`);
    }

    if (req.minWordCount && req.maxWordCount && req.minWordCount > req.maxWordCount) {
      throw new Error('Min word count should not be greater than max word count.');
    }

    return req;
  });
}

const requirements: ContentRequirement[] = [
  { contentType: 'article', contentLanguage: 'en', minWordCount: 300 },
  { contentType: 'video', contentLanguage: 'es' },
];

try {
  const validatedRequirements = gatherContentRequirements(requirements);
  // Continue with validated requirements...
} catch (error) {
  console.error(error.message);
}

type ContentRequirement = {
  contentType: string;
  contentLanguage: string;
  accessibilityLevel?: string; // optional
  minWordCount?: number; // optional
  maxWordCount?: number; // optional
};

function gatherContentRequirements(reqs: ContentRequirement[]): ContentRequirement[] {
  return reqs.map((req) => {
    const validContentTypes = ['article', 'video', 'audio'];
    if (!validContentTypes.includes(req.contentType)) {
      throw new Error(`Invalid content type: ${req.contentType}`);
    }

    const validLanguages = ['en', 'es', 'fr', 'de', 'it'];
    if (!validLanguages.includes(req.contentLanguage)) {
      throw new Error(`Invalid content language: ${req.contentLanguage}`);
    }

    if (req.accessibilityLevel && !['A', 'AA', 'AAA'].includes(req.accessibilityLevel)) {
      throw new Error(`Invalid accessibility level: ${req.accessibilityLevel}`);
    }

    if (req.minWordCount && req.maxWordCount && req.minWordCount > req.maxWordCount) {
      throw new Error('Min word count should not be greater than max word count.');
    }

    return req;
  });
}

const requirements: ContentRequirement[] = [
  { contentType: 'article', contentLanguage: 'en', minWordCount: 300 },
  { contentType: 'video', contentLanguage: 'es' },
];

try {
  const validatedRequirements = gatherContentRequirements(requirements);
  // Continue with validated requirements...
} catch (error) {
  console.error(error.message);
}

You can use this function like this: