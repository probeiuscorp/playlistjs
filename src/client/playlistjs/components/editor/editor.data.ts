declare const createSource: any;
declare const endpoints: any;

createSource(endpoints, async ({ db }) => {
    const entries = await db.file.get('asdasd');
    return entries;
});