import {
  createEffect,
  createEvent,
  createStore,
  merge,
  sample,
} from "effector";
import {
  Session,
  sessionCreateFx,
  sessionDeleteFx,
  sessionLoadFx,
} from "@/shared/api/session";
import {
  Message,
  messageDeleteFx,
  messageSendFx,
  messagesLoadFx,
} from "@/shared/api/message";

export const $session = createStore<Session | null>(null);

export const $loggedIn = $session.map((session) => session !== null);
export const $userName = $session.map((session) => session?.name ?? "");
export const $messages = createStore<Message[] | null>([]);
export const $messageText = createStore("");

export const $messageDeleting = messageDeleteFx.pending;
export const $messageSending = messageSendFx.pending;

export const pageMounted = createEvent();
export const messageDeleteClicked = createEvent<Message>();
export const messageSendClicked = createEvent();
export const messageEnterPressed = createEvent();
export const messageTextChanged = createEvent<string>();
export const loginClicked = createEvent();
export const logoutClicked = createEvent();

sample({
  clock: pageMounted,
  target: [messagesLoadFx, sessionLoadFx],
});

$messages.on(messagesLoadFx.doneData, (_, messages) => messages);

$session.on(sessionLoadFx.doneData, (_, session) => session);

sample({
  clock: loginClicked,
  target: sessionCreateFx,
});

sample({
  clock: sessionCreateFx.doneData,
  target: $session,
});

sample({
  clock: sessionCreateFx.fail,
  fn: () => null,
  target: $session,
});

sample({
  clock: logoutClicked,
  target: sessionDeleteFx,
});

sample({
  clock: sessionDeleteFx.finally,
  fn: () => null,
  target: $session,
});

$messageText.on(messageTextChanged, (_, text) => text);

const messageSend = merge([messageEnterPressed, messageSendClicked]);

sample({
  clock: messageSend,
  source: { author: $session, text: $messageText },
  filter: (form): form is { author: Session; text: string } => {
    return form.author !== null;
  },
  target: messageSendFx,
});

$messages.on(messageSendFx.doneData, (messages, newMessage) => {
  return messages ? [...messages, newMessage] : [];
});

$messageText.on(messageSendFx, () => "");

sample({
  clock: messageSendFx.fail,
  fn: ({ params }) => params.text,
  target: $messageText,
});

sample({
  clock: messageDeleteClicked,
  target: messageDeleteFx,
});

$messages.on(
  messageDeleteFx.done,
  (messages, { params: toDelete }) =>
    messages?.filter((message) => message.id !== toDelete.id),
);
