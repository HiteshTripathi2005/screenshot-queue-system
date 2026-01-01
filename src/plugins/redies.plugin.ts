import fp from "fastify-plugin"
import {redis} from "../redis.js"

export default fp(
    async (fastify)=>{
        fastify.decorateRequest("redis", {
            getter() {
                return redis;
            },
        });

        fastify.addHook("onClose", async () => {
            await redis.quit();
        })
    }
)