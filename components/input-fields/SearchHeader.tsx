import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  TextInput,
  View,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import Colors from "@/constants/Colors";
import Sizes from "@/constants/Sizes";
import IconButton from "../button/IconButton";
import Notifications from "@/components/notifications/Notification";
import { t } from "i18next";
import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from "expo-speech-recognition";
import LottieView from "lottie-react-native";
import { responsive, vw, vh } from "@/utils/responsive";

const SearchHeader = () => {
  const [searchText, setSearchText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [showListeningModal, setShowListeningModal] = useState(false);
  const lottieRef = useRef<LottieView>(null);
  const textInputRef = useRef<TextInput>(null);

  const backgroundColor = useThemeColor(
    { light: Colors.light.background, dark: Colors.dark.background },
    "background",
  );
  const searchBackgroundColor = useThemeColor(
    {
      light: Colors.light.backgroundSecondary,
      dark: Colors.dark.backgroundSecondary,
    },
    "backgroundSecondary",
  );
  const borderColor = useThemeColor(
    { light: Colors.light.border, dark: Colors.dark.border },
    "border",
  );
  const textColor = useThemeColor(
    { light: Colors.light.text, dark: Colors.dark.text },
    "text",
  );
  const iconColor = useThemeColor(
    { light: Colors.light.icon, dark: Colors.dark.icon },
    "icon",
  );

  const startListening = async () => {
    try {
      const result =
        await ExpoSpeechRecognitionModule.requestPermissionsAsync();
      if (!result.granted) {
        console.warn("Permissions not granted", result);
        return;
      }

      setIsListening(true);
      setShowListeningModal(true);
      lottieRef.current?.play();
      ExpoSpeechRecognitionModule.start({
        lang: "en-US",
        interimResults: true,
        maxAlternatives: 1,
        continuous: false,
      });
    } catch (error) {
      console.error("Error starting speech recognition:", error);
      setIsListening(false);
      setShowListeningModal(false);
    }
  };

  const stopListening = () => {
    ExpoSpeechRecognitionModule.stop();
    setIsListening(false);
    setShowListeningModal(false);
    lottieRef.current?.reset();
    setTimeout(() => {
      textInputRef.current?.blur();
      textInputRef.current?.focus();
    }, 0);
  };

  useSpeechRecognitionEvent("result", (event) => {
    setSearchText(event.results[0]?.transcript || "");
    stopListening();
  });

  useSpeechRecognitionEvent("error", (event) => {
    console.log("Speech recognition error:", event.error, event.message);
    stopListening();
  });

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleSearch = () => {
    console.log("Search text:", searchText);
    Keyboard.dismiss();
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View
        style={[
          styles.searchContainer,
          {
            backgroundColor: searchBackgroundColor,
            borderColor,
          },
        ]}
      >
        <IconButton
          iconName="search"
          iconLibrary="FontAwesome"
          iconStyle={{ color: iconColor }}
          size="small"
          style={styles.searchIcon}
          variant="transparent"
        />
        <TextInput
          ref={textInputRef}
          placeholder={t("Search")}
          placeholderTextColor={iconColor}
          style={[styles.searchInput, { color: textColor }]}
          value={searchText}
          onChangeText={setSearchText}
          keyboardType="web-search"
          returnKeyType="search"
          onSubmitEditing={handleSearch}
        />
        <IconButton
          iconName="microphone"
          iconLibrary="FontAwesome"
          iconStyle={{ color: iconColor }}
          size="small"
          style={styles.microphoneIcon}
          variant="transparent"
          onPress={toggleListening}
        />
      </View>
      <Notifications />
      <Modal
        visible={showListeningModal}
        transparent={true}
        animationType="fade"
        statusBarTranslucent={true}
      >
        <TouchableWithoutFeedback onPress={stopListening}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <LottieView
                  ref={lottieRef}
                  source={require("@/assets/animations/listening-animation.json")}
                  style={styles.lottieAnimation}
                  autoPlay={false}
                  loop={true}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

export default SearchHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: vw(4),
    paddingBottom: vh(2),
    gap: vw(2),
    zIndex: 10,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: responsive(Sizes.borderRadiusFull),
    paddingHorizontal: vw(2),
    paddingVertical: vh(0.5),
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: responsive(Sizes.textMedium),
  },
  searchIcon: {
    padding: vw(2),
  },
  microphoneIcon: {
    padding: vw(2),
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: responsive(10),
    padding: vw(5),
    alignItems: "center",
    justifyContent: "center",
  },
  lottieAnimation: {
    width: vw(50),
    height: vw(50),
  },
});
