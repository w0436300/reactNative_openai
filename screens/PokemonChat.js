import React, { useState, useCallback, useEffect } from "react";
import { GiftedChat } from "react-native-gifted-chat";

const Chat = ({ navigation, route }) => {
  const [messages, setMessages] = useState([]);
  const cannedResponses = [
    "first senntence",
    "Second Snntence",
    "third Scentence",
    "Forth Scentence",
    "Fifth scentence",
  ];

  let messageCount = 1;

  const buildBotMessage = (msg) => {
    return {
      _id: messageCount,
      text: msg,
      createdAt: new Date(),
      user: {
        _id: 2,
        name: "React Native",
        avatar: "https://placeimg.com/140/140/any",
      },
    };
  };

  //defin new methods to

  useEffect(() => {
    // Mike's Change
    const myMessage = buildBotMessage("Hello, Dave");
    messageCount++;

    // Mike's Change
    setMessages([myMessage]);
  }, []);

  const onSend = useCallback((messages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.end(previousMessages, messages)
    );
    // Mike's Change
    let max = cannedResponses.length - 1;
    let min = 0;
    const randomIndex = Math.floor(Math.random() * (max - min + 1)) + min;
    const myMessage = buildBotMessage(cannedResponses[randomIndex]);
    console.log(randomIndex);
    messageCount++;

    setMessages((previousMessages) =>
      GiftedChat.end(previousMessages, myMessage)
    );
  }, []);

  return (
    <GiftedChat
      messages={messages}
      onSend={(messages) => onSend(messages)}
      user={{
        _id: 1,
      }}
    />
  );
};

export default Chat;
