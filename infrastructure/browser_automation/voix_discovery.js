/**
 * VOIX Discovery Script for Browser Injection
 * 
 * This script is injected into web pages to discover VOIX <tool> and <context> tags.
 * Implements MutationObserver for dynamic content monitoring.
 * 
 * Paper: arXiv:2511.11287 - Building the Web for Agents
 */

(function() {
    'use strict';

    /**
     * Discover all VOIX tools on the page
     * @returns {Array<Object>} Array of tool definitions
     */
    function discoverVoixTools() {
        const tools = [];
        const toolElements = document.querySelectorAll('tool');

        toolElements.forEach((element) => {
            try {
                const tool = {
                    name: element.getAttribute('name') || '',
                    description: element.getAttribute('description') || '',
                    endpoint: element.getAttribute('endpoint') || '',
                    method: (element.getAttribute('method') || 'POST').toUpperCase(),
                    auth: element.getAttribute('auth') || 'none',
                    visibility: element.getAttribute('visibility') || 'visible',
                    selector: element.getAttribute('selector') || null,
                };

                // Parse parameters
                const paramsAttr = element.getAttribute('parameters');
                if (paramsAttr) {
                    try {
                        tool.parameters = JSON.parse(paramsAttr);
                    } catch (e) {
                        console.warn('Invalid JSON in tool parameters:', paramsAttr);
                        tool.parameters = {};
                    }
                } else {
                    tool.parameters = {};
                }

                // Validate required fields
                if (tool.name && tool.endpoint) {
                    tools.push(tool);
                } else {
                    console.warn('Tool tag missing required attributes (name or endpoint):', element);
                }
            } catch (error) {
                console.error('Error parsing tool tag:', error, element);
            }
        });

        return tools;
    }

    /**
     * Discover all VOIX contexts on the page
     * @returns {Array<Object>} Array of context definitions
     */
    function discoverVoixContexts() {
        const contexts = [];
        const contextElements = document.querySelectorAll('context');

        contextElements.forEach((element) => {
            try {
                const context = {
                    name: element.getAttribute('name') || '',
                    value: element.getAttribute('value') || '',
                    scope: element.getAttribute('scope') || 'page',
                    ttl: element.getAttribute('ttl') ? parseInt(element.getAttribute('ttl')) : null,
                    selector: element.getAttribute('selector') || null,
                };

                // Parse JSON value if present
                if (context.value && (context.value.startsWith('{') || context.value.startsWith('['))) {
                    try {
                        context.value = JSON.parse(context.value);
                    } catch (e) {
                        // Keep as string if not valid JSON
                    }
                }

                // Validate required fields
                if (context.name) {
                    contexts.push(context);
                } else {
                    console.warn('Context tag missing required attribute (name):', element);
                }
            } catch (error) {
                console.error('Error parsing context tag:', error, element);
            }
        });

        return contexts;
    }

    /**
     * Main discovery function
     * @returns {Object} Object with tools and contexts
     */
    function discoverVoix() {
        return {
            tools: discoverVoixTools(),
            contexts: discoverVoixContexts(),
            timestamp: Date.now(),
            url: window.location.href,
        };
    }

    /**
     * Setup MutationObserver to watch for dynamic VOIX tags
     */
    function setupMutationObserver(callback) {
        const observer = new MutationObserver((mutations) => {
            let hasVoixChanges = false;

            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            if (node.tagName === 'TOOL' || node.tagName === 'CONTEXT' ||
                                node.querySelector && (node.querySelector('tool') || node.querySelector('context'))) {
                                hasVoixChanges = true;
                            }
                        }
                    });
                }
            });

            if (hasVoixChanges && callback) {
                callback(discoverVoix());
            }
        });

        observer.observe(document.body || document.documentElement, {
            childList: true,
            subtree: true,
        });

        return observer;
    }

    /**
     * Message passing to Chrome extension or parent window
     */
    function sendToAgent(data) {
        // Try Chrome runtime first (for extensions)
        if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage) {
            chrome.runtime.sendMessage({
                type: 'VOIX_DISCOVERY',
                data: data,
            });
        }
        // Fallback to postMessage for iframe/parent communication
        else if (window.parent && window.parent !== window) {
            window.parent.postMessage({
                type: 'VOIX_DISCOVERY',
                data: data,
            }, '*');
        }
        // Log to console as fallback
        else {
            console.log('VOIX Discovery:', data);
        }
    }

    // Auto-discover on page load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            const discovery = discoverVoix();
            sendToAgent(discovery);
        });
    } else {
        const discovery = discoverVoix();
        sendToAgent(discovery);
    }

    // Setup MutationObserver for dynamic content
    let observer = null;
    if (document.body || document.documentElement) {
        observer = setupMutationObserver((discovery) => {
            sendToAgent(discovery);
        });
    }

    // Expose API globally
    window.discoverVoix = discoverVoix;
    window.discoverVoixTools = discoverVoixTools;
    window.discoverVoixContexts = discoverVoixContexts;

    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        if (observer) {
            observer.disconnect();
        }
    });

})();

