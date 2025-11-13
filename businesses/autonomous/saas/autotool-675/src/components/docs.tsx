// src/components/Documentation.tsx
import React, { useState, useEffect } from 'react';
import { Read } from '../utils/fileSystem'; // Assuming a utility for reading files
import Markdown from 'react-markdown'; // For rendering Markdown content
import {ErrorBoundary} from 'react-error-boundary'; // For robust error handling

interface DocItem {
    title: string;
    path: string;
}

interface DocumentationProps {
    docList: DocItem[];
}

const Documentation = ({ docList }: DocumentationProps) => {
    const [currentDoc, setCurrentDoc] = useState<string>('');
    const [docContent, setDocContent] = useState<string>('');

    useEffect(() => {
        if (currentDoc) {
            const fetchDocContent = async () => {
                try {
                    const content = await Read({ file_path: currentDoc });
                    setDocContent(content);
                } catch (error: any) {
                    console.error("Error reading documentation file:", error);
                    setDocContent("# Error Loading Documentation\n\nFailed to load the documentation. Please check the file path and try again.");
                }
            };
            fetchDocContent();
        }
    }, [currentDoc]);

    const handleDocClick = (path: string) => {
        setCurrentDoc(path);
    };

    const ErrorFallback = ({ error, reset }: { error: Error, reset: () => void }) => (
        <div role="alert">
            <p>Something went wrong:</p>
            <pre style={{ color: 'red' }}>{error.message}</pre>
            <button onClick={reset}>Try again</button>
        </div>
    );

    return (
        <ErrorBoundary
            FallbackComponent={ErrorFallback}
            onReset={() => {
                // Reset the state of your app
                setDocContent('');
                setCurrentDoc('');
            }}
        >
            <div className="documentation-container">
                <nav className="doc-navigation">
                    <ul>
                        {docList.map((doc) => (
                            <li key={doc.path} onClick={() => handleDocClick(doc.path)}>
                                {doc.title}
                            </li>
                        ))}
                    </ul>
                </nav>
                <main className="doc-content">
                    {currentDoc ? (
                        <Markdown>{docContent}</Markdown>
                    ) : (
                        <p>Select a document to view.</p>
                    )}
                </main>
            </div>
        </ErrorBoundary>
    );
};

export default Documentation;

// Example Usage:
// const docList = [
//     { title: 'Introduction', path: 'docs/introduction.md' },
//     { title: 'Getting Started', path: 'docs/getting-started.md' },
// ];
// <Documentation docList={docList} />

// src/components/Documentation.tsx
import React, { useState, useEffect } from 'react';
import { Read } from '../utils/fileSystem'; // Assuming a utility for reading files
import Markdown from 'react-markdown'; // For rendering Markdown content
import {ErrorBoundary} from 'react-error-boundary'; // For robust error handling

interface DocItem {
    title: string;
    path: string;
}

interface DocumentationProps {
    docList: DocItem[];
}

const Documentation = ({ docList }: DocumentationProps) => {
    const [currentDoc, setCurrentDoc] = useState<string>('');
    const [docContent, setDocContent] = useState<string>('');

    useEffect(() => {
        if (currentDoc) {
            const fetchDocContent = async () => {
                try {
                    const content = await Read({ file_path: currentDoc });
                    setDocContent(content);
                } catch (error: any) {
                    console.error("Error reading documentation file:", error);
                    setDocContent("# Error Loading Documentation\n\nFailed to load the documentation. Please check the file path and try again.");
                }
            };
            fetchDocContent();
        }
    }, [currentDoc]);

    const handleDocClick = (path: string) => {
        setCurrentDoc(path);
    };

    const ErrorFallback = ({ error, reset }: { error: Error, reset: () => void }) => (
        <div role="alert">
            <p>Something went wrong:</p>
            <pre style={{ color: 'red' }}>{error.message}</pre>
            <button onClick={reset}>Try again</button>
        </div>
    );

    return (
        <ErrorBoundary
            FallbackComponent={ErrorFallback}
            onReset={() => {
                // Reset the state of your app
                setDocContent('');
                setCurrentDoc('');
            }}
        >
            <div className="documentation-container">
                <nav className="doc-navigation">
                    <ul>
                        {docList.map((doc) => (
                            <li key={doc.path} onClick={() => handleDocClick(doc.path)}>
                                {doc.title}
                            </li>
                        ))}
                    </ul>
                </nav>
                <main className="doc-content">
                    {currentDoc ? (
                        <Markdown>{docContent}</Markdown>
                    ) : (
                        <p>Select a document to view.</p>
                    )}
                </main>
            </div>
        </ErrorBoundary>
    );
};

export default Documentation;

// Example Usage:
// const docList = [
//     { title: 'Introduction', path: 'docs/introduction.md' },
//     { title: 'Getting Started', path: 'docs/getting-started.md' },
// ];
// <Documentation docList={docList} />