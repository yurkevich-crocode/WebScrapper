import * as userAgentGenerator from 'user-agents-generator';

export function getRandomUserAgent(): string {
    const randomNum = Math.ceil(Math.random() * 3);
    switch(randomNum) {
        case 1: return userAgentGenerator.chrome();
        case 2: return userAgentGenerator.firefox();
        case 3: return userAgentGenerator.safari();
        default: return userAgentGenerator.chrome();
    }
}