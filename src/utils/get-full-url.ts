export function getFullUrl(baseUrl: string, ...args: string[]): string {
    const result = args.reduce((acc, arg) => {
        return `${acc}/${arg.replace(/^\//, '')}`;
    }, baseUrl);
    
    return result;
}