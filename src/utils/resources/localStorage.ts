export const saveObject = (key: string, value: {[key: string]: any}) => {
    localStorage.setItem(key, JSON.stringify(value))
}

export const loadObject = (key: string) => {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : {};
}