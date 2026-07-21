import "server-only";
import { drizzle, type NeonHttpDatabase } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";

// Lazily created so importing this module never requires DATABASE_URL to be
// set (e.g. during `next build`) — only actually querying the database does.
let instance: NeonHttpDatabase<typeof schema> | undefined;

function getDb() {
  if (!instance) {
    instance = drizzle(neon(process.env.DATABASE_URL!), { schema });
  }
  return instance;
}

export const db = new Proxy({} as NeonHttpDatabase<typeof schema>, {
  get(_target, prop, receiver) {
    return Reflect.get(getDb(), prop, receiver);
  },
});
