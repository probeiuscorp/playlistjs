export function stable<T extends object, V>(make: (item: T) => V) {
    const cache = new WeakMap<T, V>();
    return (item: T) => {
        const held = cache.get(item);
        if(held === undefined) {
            const made = make(item);
            cache.set(item, made);
            return made;
        } else {
            return held;
        }
    };
}