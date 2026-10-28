import { useEffect, useState } from 'react';

export function useHash() {
    const [hash, setHash] = useState(() => location.hash);

    useEffect(() => {
        const onHash = () => setHash(location.hash);
        addEventListener('hashchange', onHash);
        return () => removeEventListener('hashchange', onHash);
    }, []);

    return hash;
}
