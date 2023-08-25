import { Config, starWars, uniqueNamesGenerator } from "unique-names-generator";
import { createEffect } from "effector";
import { wait } from "@/shared/lib/wait";
import { createOid } from "@/shared/lib/oid";

const nameGenerator: Config = { dictionaries: [starWars] };
const createName = () => uniqueNamesGenerator(nameGenerator);

export interface Session {
  id: string;
  name: string;
}

const LocalStorageKey = "effector-session";

export const sessionLoadFx = createEffect<void, Session | null>(async () => {
  const source = localStorage.getItem(LocalStorageKey);
  await wait();
  if (!source) {
    return null;
  }

  return JSON.parse(source);
});

export const sessionDeleteFx = createEffect(async () => {
  localStorage.removeItem(LocalStorageKey);
  await wait();
});

export const sessionCreateFx = createEffect(async () => {
  const session: Session = {
    id: createOid(),
    name: createName(),
  };

  localStorage.setItem(LocalStorageKey, JSON.stringify(session));
  return session;
});
