/**
 * Creates a snippet with 5 words before and after the matched search term
 * @param text - The text to search within
 * @param searchTerm - The term to search for
 * @returns A snippet containing the matched term with context
 */
export const createSnippet = (text: string, searchTerm: string): string => {
    const searchRegexGlobal = new RegExp(searchTerm, 'gi');

    // Find the first match
    const match = text.match(searchRegexGlobal);
    if (!match) return text.substring(0, 50) + '...';

    const matchIndex = text.search(searchRegexGlobal);
    const beforeText = text.substring(0, matchIndex);
    const beforeWords = beforeText.split(/\s+/).filter(word => word.length > 0);
    const afterText = text.substring(matchIndex + match[0].length);
    const afterWords = afterText.split(/\s+/).filter(word => word.length > 0);

    // Get 5 words before and after
    const contextBefore = beforeWords.slice(-5).join(' ');
    const contextAfter = afterWords.slice(0, 5).join(' ');

    // Construct the snippet
    const snippet = [
        contextBefore,
        match[0],
        contextAfter
    ].filter(part => part.length > 0).join(' ');

    return snippet.trim();
};
