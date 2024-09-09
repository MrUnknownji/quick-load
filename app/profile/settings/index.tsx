import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { ThemedView } from "@/components/ThemedView";
import SmallListItem from "@/components/list-items/SmallListItem";
import LanguageDialog from "@/components/popups/LanguageDialog";
import { t } from "i18next";
import AccountDeleteDialog from "@/components/popups/AccountDeleteDialog";
import ThemeChangerDialog from "@/components/popups/ThemeChangerDialog";

const Settings = () => {
  const [isLanguageDialogVisible, setIsLanguageDialogVisible] = useState(false);
  const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false);
  const [isThemeDialogVisible, setIsThemeDialogVisible] = useState(false);
  return (
    <ThemedView>
      <SmallListItem
        title={t("Language")}
        iconName="language"
        onPress={() => setIsLanguageDialogVisible(true)}
      />
      <SmallListItem
        title={t("Theme")}
        iconName="moon"
        onPress={() => setIsThemeDialogVisible(true)}
      />
      <SmallListItem
        title={t("Permissions")}
        iconName="security"
        iconType="MaterialIcons"
      />
      <SmallListItem
        title={t("Privacy and policy")}
        iconName="information-circle"
      />
      <SmallListItem
        title={t("Remove Account")}
        iconName="trash-bin"
        onPress={() => setIsDeleteDialogVisible(true)}
      />
      <LanguageDialog
        isVisible={isLanguageDialogVisible}
        onClose={() => setIsLanguageDialogVisible(false)}
      />
      <AccountDeleteDialog
        isVisible={isDeleteDialogVisible}
        onClose={() => setIsDeleteDialogVisible(false)}
      />
      <ThemeChangerDialog
        isVisible={isThemeDialogVisible}
        onClose={() => setIsThemeDialogVisible(false)}
      />
    </ThemedView>
  );
};

export default Settings;

const styles = StyleSheet.create({});
