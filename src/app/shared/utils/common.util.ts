export const generateUniqueId = (name: string): string => {
    const initials = name.split(' ')
        .map(part => part.charAt(0).toUpperCase())
        .join('');

    const randomString = Math.random().toString(36).substring(2, 10);

    return `${initials}_${randomString}`;
}  