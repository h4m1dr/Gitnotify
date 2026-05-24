import { router } from "./core/router";
import { runDigestCron } from "./engine/cron";

export default {
  async fetch(req: Request, env: any, ctx: any) {
    return router(req, env, ctx);
  },

  async scheduled(event: ScheduledEvent, env: any, ctx: any) {
    ctx.waitUntil(runDigestCron(env));
  },
};