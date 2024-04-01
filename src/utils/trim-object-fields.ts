export function trimObjectFields<T>(obj: T): T {
    for (let field in obj) {
        if (typeof obj[field] === 'string') {
            // @ts-ignore
            obj[field] = obj[field].toString().trim();
        }
    }

    return obj;
}