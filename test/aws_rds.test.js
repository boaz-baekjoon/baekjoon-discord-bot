const { getConnection } = require('../database/connect')


describe("connecting DB", () => {
    let conn;

    beforeAll(async () => {
        conn = await getConnection()
    })

    afterAll(async () => {
        if (conn) {
            await conn.destroy();
        }
    })

    test("SUCCESS: Connected to registered_user", async () => {
        await conn.execute('SELECT 1+1 from registered_user');
    }, 4500)

    test("SUCCESS: Connected to user_cron", async () => {
        await conn.execute('SELECT 1+1 from user_cron');
    }, 4500)

})