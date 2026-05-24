import { router } from "./core/router";

export default {
  async fetch(req: Request, env: any, ctx: any) {
    return router(req, env, ctx);
  }
};