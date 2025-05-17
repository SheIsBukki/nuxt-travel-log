import type { H3Event, H3EventContext } from "h3";

import type { UserWithId } from "~/lib/auth";

type AuthenticatedEvent = H3Event & {
  context: H3EventContext & {
    user: UserWithId;
  };
};

export default function defineAuthenticatedEventHandler<T>(handler: (event: AuthenticatedEvent) => T) {
  return defineEventHandler(async (event) => {
    // If the user is not logged in, they can't do stuff
    if (!event.context.user) {
      throw createError({
        statusCode: 401,
        statusMessage: "Unauthorised",
      });
    }

    return handler(event as AuthenticatedEvent);
  });
}
