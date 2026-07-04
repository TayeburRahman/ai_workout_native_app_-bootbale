import { Images } from "@/assets/extra/images";
import { useSendMessageMutation } from "@/src/redux/page/aiApi";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const { width: screenWidth } = Dimensions.get("window");

// ---------- TYPES ----------
interface ChatMessage {
  role: "user" | "assistant";
  text: string;
  typing?: boolean;
  liveTyping?: boolean;
  suggestions?: string[];
}

interface ApiResponse {
  status: string;
  data: {
    response: string;
    suggestions: string[];
    chatId?: string;
  };
}

const ChatScreen = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [chatId, setChatId] = useState<string | null>(null);
  const [sendMessage, { isLoading }] = useSendMessageMutation();

  const scrollRef = useRef<ScrollView>(null);
  const inputRef = useRef<TextInput>(null);

  // ---------- AUTO SCROLL ----------
  const scrollToBottom = () => {
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  // ---------- BUILD CHAT HISTORY ----------
  const buildHistory = () =>
    messages
      .filter((m) => !m.typing && !m.liveTyping)
      .map((m) => ({
        role: m.role,
        content: m.text,
      }));

  // ---------- SEND MESSAGE ----------
  const handleSend = async () => {
    if (!input.trim()) return;

    const userText = input.trim();

    const newUserMessage: ChatMessage = {
      role: "user",
      text: userText,
    };

    // Add user message
    setMessages((prev) => [...prev, newUserMessage]);
    setInput("");
    scrollToBottom();

    // Add typing indicator
    setMessages((prev) => [
      ...prev,
      { role: "assistant", text: "", typing: true },
    ]);

    try {
      const res = (await sendMessage({
        message: userText,
        chatId: chatId || undefined,
        chatHistory: buildHistory(),
      }).unwrap()) as ApiResponse;

      // Remove typing indicator
      setMessages((prev) => prev.filter((m) => !m.typing));

      // Get response and suggestions
      const aiText = res?.data?.response;
      const suggestions = res?.data?.suggestions || [];

      if (!aiText) {
        console.log("Invalid API response:", res);
        return;
      }

      animateAIResponse(aiText, suggestions);

      // If backend sends chatId later
      if (!chatId && res?.data?.chatId) {
        setChatId(res.data.chatId);
      }
    } catch (error) {
      console.log("AI error:", error);

      // Remove typing indicator on error
      setMessages((prev) => prev.filter((m) => !m.typing));

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "I apologize, but I'm having trouble connecting. Please try again.",
          suggestions: ["Try again", "Contact support"],
        },
      ]);
    }
  };

  // ---------- HANDLE SUGGESTION CLICK ----------
  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    inputRef.current?.focus();
  };

  // ---------- TYPEWRITER EFFECT ----------
  const animateAIResponse = (text: string, suggestions: string[] = []) => {
    let index = 0;
    let current = "";

    // Add empty assistant message first
    setMessages((prev) => [
      ...prev,
      { role: "assistant", text: "", liveTyping: true, suggestions: [] },
    ]);

    const interval = setInterval(() => {
      if (index >= text.length) {
        clearInterval(interval);

        // Add suggestions after typing is complete
        setMessages((prev) => {
          const updated = [...prev];
          const lastIndex = updated.length - 1;

          if (lastIndex >= 0 && suggestions.length > 0) {
            updated[lastIndex] = {
              ...updated[lastIndex],
              suggestions: suggestions,
              liveTyping: false,
            };
          }

          return updated;
        });

        scrollToBottom();
        return;
      }

      current += text[index];
      index++;

      setMessages((prev) => {
        const updated = [...prev];
        const lastIndex = updated.length - 1;

        if (lastIndex >= 0) {
          updated[lastIndex] = {
            role: "assistant",
            text: current,
            liveTyping: index < text.length,
            suggestions: index >= text.length ? suggestions : [],
          };
        }

        return updated;
      });

      scrollToBottom();
    }, 20); // Slightly slower for better readability
  };

  // ---------- RENDER MESSAGE WITH SUGGESTIONS ----------
  const renderMessage = (msg: ChatMessage, index: number) => {
    const isUser = msg.role === "user";

    return (
      <View key={index} className="mb-4">
        {/* Message Bubble */}
        <View
          className={`flex-row ${isUser ? "justify-end" : "justify-start"}`}
        >
          {!isUser && (
            <View className="w-8 h-8 rounded-full bg-purple-600 mr-2 overflow-hidden">
              <Image
                source={Images.gpt}
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>
          )}

          <View
            className={`max-w-[75%] rounded-2xl px-4 py-3 ${
              isUser
                ? "bg-gradient-to-r bg-[#FFFFFF1A] border border-[#FFFFFF33] rounded-tr-none"
                : "bg-[#FFFFFF1A] border border-[#FFFFFF33] rounded-tl-none"
            }`}
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            {msg.typing ? (
              <View className="flex-row items-center space-x-1 py-2">
                <ActivityIndicator size="small" color="#A895FF" />
                <Text className="text-gray-400 ml-2">AI is thinking...</Text>
              </View>
            ) : (
              <Text
                className={`${isUser ? "text-white" : "text-gray-100"} text-base leading-6`}
              >
                {msg.text}
              </Text>
            )}
          </View>

          {isUser && (
            <View className="w-8 h-8 rounded-full bg-purple-900 ml-2 items-center justify-center">
              <Text className="text-white font-bold text-sm">You</Text>
            </View>
          )}
        </View>

        {/* Suggestions */}
        {msg.suggestions && msg.suggestions.length > 0 && !msg.liveTyping && (
          <View className="mt-3 ml-10">
            <Text className="text-gray-400 text-sm mb-2">
              Suggested follow-ups:
            </Text>
            <View className="flex-row flex-wrap">
              {msg.suggestions.map((suggestion, idx) => (
                <TouchableOpacity
                  key={idx}
                  onPress={() => handleSuggestionClick(suggestion)}
                  className="bg-[#FFFFFF1A] border border-[#FFFFFF33] rounded-full px-4 py-2 mr-2 mb-2 "
                  activeOpacity={0.7}
                >
                  <Text className="text-purple-400 text-sm">{suggestion}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "android" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <View className="flex-1 ">
        {/* Messages */}
        <ScrollView
          ref={scrollRef}
          className="flex-1 px-4 pt-4"
          showsVerticalScrollIndicator={false}
          onContentSizeChange={scrollToBottom}
        >
          {messages.map((msg, index) => renderMessage(msg, index))}
        </ScrollView>

        {/* Input Area */}
        <View className="px-4 py-3 ">
          <View className="flex-row items-center bg-white/10 rounded-2xl px-4 py-2 border border-gray-800">
            <TextInput
              ref={inputRef}
              className="flex-1 text-white text-base py-2"
              placeholder="Ask me anything..."
              placeholderTextColor="#6B7280"
              value={input}
              onChangeText={setInput}
              multiline
              maxLength={500}
              onSubmitEditing={handleSend}
            />

            <TouchableOpacity
              onPress={handleSend}
              disabled={isLoading || !input.trim()}
              className={`ml-2 w-10 h-10 rounded-full items-center justify-center ${
                input.trim() ? "bg-purple-600" : "bg-gray-800"
              }`}
              activeOpacity={0.7}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text className="text-white text-lg">➤</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Typing indicator */}
          {isLoading && (
            <Text className="text-gray-500 text-xs mt-2 ml-2">
              AI is typing...
            </Text>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatScreen;
