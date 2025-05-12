export default defineTask({
    meta: {
        name: "auto_delete",
        description: "Auto delete old presentations",
    },
    async run({ payload, context }) {
        const now = Math.round(Date.now() / 1000);
        const deleteTimeLimit = now - Number(useRuntimeConfig().deletePeriodSeconds);
        let delete_count = 0;
        await useDrizzle()
            .transaction(async (tx) => {
                const delete_targets = await tx
                    .select()
                    .from(tables.presentations)
                    .where(sql`${tables.presentations.created_at} < ${deleteTimeLimit}`);
                delete_count = delete_targets.length;
                for (const target of delete_targets) {
                    const id = target.presentation_id;
                    await tx.delete(tables.slides).where(eq(tables.slides.presentation_id, id));
                    await tx.delete(tables.presentations).where(eq(tables.presentations.presentation_id, id));
                }
            })
            .catch(() => {
                throw createError({
                    statusCode: 500,
                    statusMessage: "Internal Server Error",
                });
            });
        console.log(`[AutoDelete] Deleted ${delete_count} presentations at ${new Date().toISOString()}.`);
    },
});
