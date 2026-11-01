import { useEffect, useState } from 'react';
import { currentPath } from '../lib/router.js';

export function usePath() {
    const [path, setPath] = useState(currentPath);

    useEffect(() => {
        const onPop = () => setPath(currentPath());
        addEventListener('popstate', onPop);
        return () => removeEventListener('popstate', onPop);
    }, []);

    return path;
}
