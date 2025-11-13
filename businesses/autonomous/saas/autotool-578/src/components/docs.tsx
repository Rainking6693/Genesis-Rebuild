// src/components/DocsComponent.tsx
import React, { useState, useEffect } from 'react';
import { Read } from '../utils/fileReader'; // Assuming a utility for reading files
import { SearchBar } from './SearchBar'; // Assuming a search bar component
import { DocumentationNavigation } from './DocumentationNavigation'; // Assuming a navigation component

interface DocContent {
    title: string;
    content: string;
}

const DocsComponent = () => {
    const [docContent, setDocContent] = useState<DocContent[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDocs = async () => {
            try {
                // Replace with actual path to documentation files or API endpoint
                const docFiles = ['docs/getting-started.md', 'docs/api-reference.md', 'docs/faq.md'];
                const loadedDocs: DocContent[] = [];

                for (const file of docFiles) {
                    const content = await Read({ file_path: file });
                    if (content) {
                        // Basic parsing of markdown-like structure (can be improved with a proper markdown parser)
                        const titleMatch = content.match(/^#\s*(.*)$/m); // Matches the first level heading
                        const title = titleMatch ? titleMatch[1] : 'Untitled';
                        loadedDocs.push({ title, content });
                    } else {
                        console.warn(`Could not read file: ${file}`);
                    }
                }

                setDocContent(loadedDocs);
            } catch (e: any) {
                console.error("Error fetching documentation:", e);
                setError(`Failed to load documentation: ${e.message}`);
            }
        };

        fetchDocs();
    }, []);

    const handleSearch = (term: string) => {
        setSearchTerm(term);
    };

    const filteredDocs = docContent.filter(doc =>
        doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (error) {
        return <div className="error">Error: {error}</div>;
    }

    return (
        <div className="documentation">
            <SearchBar onSearch={handleSearch} />
            <DocumentationNavigation docs={docContent.map(doc => doc.title)} />
            <div className="doc-content">
                {filteredDocs.length > 0 ? (
                    filteredDocs.map((doc, index) => (
                        <div key={index} className="doc-section">
                            <h2>{doc.title}</h2>
                            <p>{doc.content}</p>
                        </div>
                    ))
                ) : (
                    <p>No documentation found matching your search.</p>
                )}
            </div>
        </div>
    );
};

export default DocsComponent;

// src/components/DocsComponent.tsx
import React, { useState, useEffect } from 'react';
import { Read } from '../utils/fileReader'; // Assuming a utility for reading files
import { SearchBar } from './SearchBar'; // Assuming a search bar component
import { DocumentationNavigation } from './DocumentationNavigation'; // Assuming a navigation component

interface DocContent {
    title: string;
    content: string;
}

const DocsComponent = () => {
    const [docContent, setDocContent] = useState<DocContent[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDocs = async () => {
            try {
                // Replace with actual path to documentation files or API endpoint
                const docFiles = ['docs/getting-started.md', 'docs/api-reference.md', 'docs/faq.md'];
                const loadedDocs: DocContent[] = [];

                for (const file of docFiles) {
                    const content = await Read({ file_path: file });
                    if (content) {
                        // Basic parsing of markdown-like structure (can be improved with a proper markdown parser)
                        const titleMatch = content.match(/^#\s*(.*)$/m); // Matches the first level heading
                        const title = titleMatch ? titleMatch[1] : 'Untitled';
                        loadedDocs.push({ title, content });
                    } else {
                        console.warn(`Could not read file: ${file}`);
                    }
                }

                setDocContent(loadedDocs);
            } catch (e: any) {
                console.error("Error fetching documentation:", e);
                setError(`Failed to load documentation: ${e.message}`);
            }
        };

        fetchDocs();
    }, []);

    const handleSearch = (term: string) => {
        setSearchTerm(term);
    };

    const filteredDocs = docContent.filter(doc =>
        doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (error) {
        return <div className="error">Error: {error}</div>;
    }

    return (
        <div className="documentation">
            <SearchBar onSearch={handleSearch} />
            <DocumentationNavigation docs={docContent.map(doc => doc.title)} />
            <div className="doc-content">
                {filteredDocs.length > 0 ? (
                    filteredDocs.map((doc, index) => (
                        <div key={index} className="doc-section">
                            <h2>{doc.title}</h2>
                            <p>{doc.content}</p>
                        </div>
                    ))
                ) : (
                    <p>No documentation found matching your search.</p>
                )}
            </div>
        </div>
    );
};

export default DocsComponent;

Now, I will write the code to a file and generate the build report.

**Action:**