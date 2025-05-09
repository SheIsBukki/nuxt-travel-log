import type { UserWithId } from "~/lib/auth";

declare module "h3" {
  // eslint-disable-next-line ts/consistent-type-definitions
  interface H3EventContext {
    user?: UserWithId;
  }
}

export type LatLongItem = {
  latitude: number;
  longitude: number;
};

export type MapPoint = {
  id: number;
  name: string;
  description: string | null;
} & LatLongItem;
