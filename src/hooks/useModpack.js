import { useEffect, useState } from 'react';

async function getJson(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(res.status);
    return res.json();
}

export function useModpack(slug) {
    const [modpack, setModpack] = useState(null);

    useEffect(() => {
        const base = `https://api.modrinth.com/v2/project/${slug}`;
        Promise.all([getJson(base), getJson(`${base}/version`)])
            .then(([project, [latest]]) => setModpack({
                url: `https://modrinth.com/modpack/${project.slug}`,
                version: latest.version_number,
                updated: latest.date_published
            }))
            .catch(() => {});
    }, [slug]);

    return modpack;
}
