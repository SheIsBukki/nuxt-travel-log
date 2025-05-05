import { drizzle } from "drizzle-orm/libsql";

// Better-auth cli is not compatible with path aliases
// import * as schema from "~/lib/db/schema";
// import env from "~/lib/env";
// These are the relative paths
import * as schema from "../db/schema";
import env from "../env";
// import * as schema from "./schema"; // I always prefer to use paths that contain information about the directory so that I can easily remember where to look

// You can specify any property from the libsql connection options
const db = drizzle({
  connection: {
    url: env.TURSO_DATABASE_URL,
    authToken:
      env.NODE_ENV === "development" ? undefined : env.TURSO_AUTH_TOKEN,
  },
  casing: "snake_case",
  schema,
});

export default db;
