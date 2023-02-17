import "react-native-gesture-handler";

import { memo, useRef, useState } from "react";
import {
  Button,
  Image,
  LayoutAnimation,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import KeyboardAccessoryView from "./input/KeyboardAccessoryView";
import { FlashList } from "@shopify/flash-list";

const MESSAGES = require("./messages.json");
const initialMessages = MESSAGES.slice(0, 10);

export default function App() {
  const [messages, setMessages] = useState(initialMessages);

  const [message, setMessage] = useState("");

  const offset = useRef(0);
  const listRef = useRef(null);

  const renderScrollable = (pan) => {
    return (
      <FlashList
        inverted
        ref={listRef}
        keyboardDismissMode="interactive"
        onEndReached={() => {
          if (messages.length % 10 == 0) {
            offset.current += 10;

            const newMessages = MESSAGES.slice(
              offset.current,
              offset.current + 10
            );
            setMessages([...messages, ...newMessages]);
          }
        }}
        keyExtractor={(item, index) => index.toString()}
        onEndReachedThreshold={0.5}
        estimatedItemSize={30}
        data={messages}
        renderItem={(props) => {
          return <Message {...props} />;
        }}
        {...pan}
      />
    );
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <KeyboardAccessoryView renderScrollable={renderScrollable}>
          <View style={styles.inputContainer}>
            <TextInput
              value={message}
              placeholder="Message..."
              onChangeText={setMessage}
              style={{ padding: 16, fontSize: 20, flex: 1 }}
            />

            <Button
              title="Send"
              onPress={() => {
                setMessages([{ content: message }, ...messages]);

                listRef.current?.prepareForLayoutAnimationRender();

                LayoutAnimation.configureNext(
                  LayoutAnimation.Presets.easeInEaseOut
                );

                setMessage("");
              }}
            />
          </View>
        </KeyboardAccessoryView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const Message = memo(({ item, index }) => {
  const isSource = item.source != null;

  if (!isSource) {
    return (
      <View style={styles.message}>
        <Text style={{ color: "white", fontSize: 16 }}>{item.content}</Text>
      </View>
    );
  }

  const isBusiness = item.type == "business";

  return (
    <View>
      <Image
        source={{ uri: item.source }}
        style={{ borderRadius: 16, width: 250, height: isBusiness ? 200 : 350 }}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  message: {
    padding: 16,
    borderRadius: 16,
    marginVertical: 4,
    marginHorizontal: 16,
    backgroundColor: "darkblue",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: "2%",
  },
});
