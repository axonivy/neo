export const wsBaseUrl = () => window.location.origin.replace('https://', 'wss://').replace('http://', 'ws://');
export const baseUrl = () => window.location.origin.replace('https://', '').replace('http://', '');
