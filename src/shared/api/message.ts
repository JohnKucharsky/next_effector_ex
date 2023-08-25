import { createEffect } from "effector";
import { wait } from "@/shared/lib/wait";
import { createOid } from "@/shared/lib/oid";

interface Author {
  id: string;
  name: string;
}

export interface Message {
  id: string;
  author: Author;
  text: string;
  timestamp: number;
}

interface SendMessage {
  text: string;
  author: Author;
}

const LocalStorageKey = "effector_messages";

function loadHistory(): Message[] | null {
  const source = localStorage.getItem(LocalStorageKey);
  if (!source) {
    return null;
  }
  return JSON.parse(source);
}

function saveHistory(messages: Message[] | null) {
  localStorage.setItem(LocalStorageKey, JSON.stringify(messages));
}

export const messagesLoadFx = createEffect<void, Message[] | null>(async () => {
  const history = loadHistory();
  await wait();
  return history;
});

export const messageSendFx = createEffect(
  async ({ text, author }: SendMessage) => {
    const message: Message = {
      id: createOid(),
      author,
      timestamp: Date.now(),
      text,
    };

    const history = await messagesLoadFx();

    saveHistory(history ? [...history, message] : [message]);
    await wait();

    return message;
  },
);

export const messageDeleteFx = createEffect(async (message: Message) => {
  const history = await messagesLoadFx();
  const updated = history?.filter((found) => found.id !== message.id) || null;
  await wait();
  saveHistory(updated);
});
