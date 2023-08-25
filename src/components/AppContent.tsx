import { useEvent, useStore } from "effector-react";
import {
  $loggedIn,
  $messageDeleting,
  $messages,
  $messageSending,
  $messageText,
  $userName,
  loginClicked,
  logoutClicked,
  messageDeleteClicked,
  messageEnterPressed,
  messageSendClicked,
  messageTextChanged,
  pageMounted,
} from "@/shared/models/session";
import { useEffect, useMemo, KeyboardEvent } from "react";

const AppContent = () => {
  const handlePageMount = useEvent(pageMounted);

  useEffect(() => {
    handlePageMount();
  }, []);

  return (
    <div className={"parent"}>
      <ChatHistory />
      <MessageForm />
    </div>
  );
};

function ChatHistory() {
  const messageDeleting = useStore($messageDeleting);
  const handleMessageDelete = useEvent(messageDeleteClicked);
  const messages = useStore($messages);

  const messagesList = useMemo(() => {
    return messages?.map((message) => (
      <div className={"message-item"} key={message.timestamp}>
        <h3>From: {message.author.name}</h3>
        <p>{message.text}</p>
        <button
          onClick={() => handleMessageDelete(message)}
          disabled={messageDeleting}
        >
          {messageDeleting ? "Deleting" : "Delete"}
        </button>
      </div>
    ));
  }, [handleMessageDelete, messageDeleting, messages]);

  return <div className={"chat-history"}>{messagesList}</div>;
}

function MessageForm() {
  const isLogged = useStore($loggedIn);
  return isLogged ? <SendMessage /> : <LoginForm />;
}

function SendMessage() {
  const userName = useStore($userName);
  const messageText = useStore($messageText);
  const messageSending = useStore($messageSending);

  const handleLogout = useEvent(logoutClicked);
  const handleTextChange = useEvent(messageTextChanged);
  const handleEnterPress = useEvent(messageEnterPressed);
  const handleSendClick = useEvent(messageSendClicked);

  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleEnterPress();
    }
  };

  return (
    <div className={"message-form"}>
      <h3>{userName}</h3>
      <input
        type="text"
        onChange={(event) => handleTextChange(event.target.value)}
        value={messageText}
        onKeyUp={handleKeyPress}
        className={"chat-input"}
        placeholder={"Type a message..."}
      />
      <button onClick={() => handleSendClick()} disabled={messageSending}>
        {messageSending ? "Sending..." : "Send"}
      </button>
      <button onClick={() => handleLogout()}>Log out</button>
    </div>
  );
}

function LoginForm() {
  const handleLogin = useEvent(loginClicked);

  return (
    <div className={"message-form"}>
      <div>Please, log in to be able to send messages</div>
      <button onClick={() => handleLogin()}>Login as a random user</button>
    </div>
  );
}

export default AppContent;
