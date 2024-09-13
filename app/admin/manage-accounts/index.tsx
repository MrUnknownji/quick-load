import React, { useState, useEffect } from "react";
import { View, ScrollView, StyleSheet, Alert, Switch } from "react-native";
import { router } from "expo-router";
import Colors from "@/constants/Colors";
import Sizes from "@/constants/Sizes";
import { t } from "i18next";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import Button from "@/components/button/Button";
import TextInputField from "@/components/input-fields/TextInputField";
import SelectListWithDialog from "@/components/input-fields/SelectListWithDialog";

interface User {
  id: string;
  name: string;
  email: string;
}

const AdminBlockDeleteAccountPage: React.FC = () => {
  const [action, setAction] = useState<"block" | "delete">("block");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [reason, setReason] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    // Simulated API call to fetch users
    const fetchUsers = async () => {
      // In a real application, this would be an API call
      const mockUsers: User[] = [
        { id: "1", name: "John Doe", email: "john@example.com" },
        { id: "2", name: "Jane Smith", email: "jane@example.com" },
        { id: "3", name: "Bob Johnson", email: "bob@example.com" },
      ];
      setUsers(mockUsers);
    };

    fetchUsers();
  }, []);

  const handleActionToggle = () => {
    setAction(action === "block" ? "delete" : "block");
    setReason("");
    setAdminPassword("");
    setConfirmed(false);
  };

  const handleConfirm = () => {
    if (!selectedUser) {
      Alert.alert(t("Error"), t("Please select a user"));
      return;
    }

    if (!confirmed) {
      Alert.alert(t("Error"), t("Please confirm the action"));
      return;
    }

    if (action === "delete" && !adminPassword) {
      Alert.alert(
        t("Error"),
        t("Admin password is required for account deletion")
      );
      return;
    }

    Alert.alert(
      t("Confirm Action"),
      t(
        `Are you sure you want to ${action} the account of ${selectedUser.name}?`
      ),
      [
        {
          text: t("Cancel"),
          style: "cancel",
        },
        {
          text: t("Confirm"),
          onPress: () => {
            console.log(
              `Admin ${action.toUpperCase()} account for user: ${
                selectedUser.name
              }. Reason: ${reason}`
            );
            // Here you would typically call an API to block or delete the account
            router.back(); // Return to previous page after action
          },
          style: "destructive",
        },
      ]
    );
  };

  const handleCancel = () => router.back();

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <SelectListWithDialog
          label={t("Select User")}
          options={users.map((user) => `${user.name} (${user.email})`)}
          selectedOption={
            selectedUser ? `${selectedUser.name} (${selectedUser.email})` : ""
          }
          onSelect={(value) => {
            const selected = users.find(
              (user) => `${user.name} (${user.email})` === value
            );
            setSelectedUser(selected || null);
          }}
          placeholder={t("Select User")}
          defaultText={t("Select User")}
        />

        <View style={styles.actionToggle}>
          <ThemedText style={styles.actionText}>
            {t("Block Account")}
          </ThemedText>
          <Switch
            value={action === "delete"}
            onValueChange={handleActionToggle}
            trackColor={{
              false: Colors.light.primary,
              true: Colors.light.error,
            }}
            thumbColor={Colors.light.background}
          />
          <ThemedText
            style={[
              styles.actionText,
              action === "delete" && styles.deleteText,
            ]}
          >
            {t("Delete Account")}
          </ThemedText>
        </View>

        <ThemedText style={styles.warningText}>
          {action === "block"
            ? t(
                "Blocking this account will temporarily disable it. The user can request to unblock it later."
              )
            : t(
                "Deleting this account is permanent. All user data will be permanently removed and cannot be recovered."
              )}
        </ThemedText>

        <TextInputField
          label={t("Reason (Required)")}
          value={reason}
          onChangeText={setReason}
          multiline
          style={styles.textArea}
        />

        {action === "delete" && (
          <TextInputField
            label={t("Admin Password")}
            value={adminPassword}
            onChangeText={setAdminPassword}
            secureTextEntry
            style={styles.inputField}
          />
        )}

        <View style={styles.checkboxContainer}>
          <Switch
            value={confirmed}
            onValueChange={setConfirmed}
            trackColor={{
              false: Colors.light.border,
              true: Colors.light.primary,
            }}
            thumbColor={Colors.light.background}
          />
          <ThemedText style={styles.checkboxLabel}>
            {t(`I confirm that I want to ${action} this user's account`)}
          </ThemedText>
        </View>

        <View style={styles.buttonRow}>
          <Button
            title={t(
              `${action.charAt(0).toUpperCase() + action.slice(1)} Account`
            )}
            size="medium"
            onPress={handleConfirm}
            disabled={
              !selectedUser ||
              !confirmed ||
              !reason ||
              (action === "delete" && !adminPassword)
            }
          />
          <Button
            title={t("Cancel")}
            size="medium"
            variant="secondary"
            onPress={handleCancel}
          />
        </View>
      </ScrollView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: Sizes.paddingMedium,
  },
  actionToggle: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: Sizes.marginLarge,
  },
  actionText: {
    fontSize: 18,
    fontWeight: "bold",
    marginHorizontal: Sizes.marginMedium,
  },
  deleteText: {
    color: Colors.light.error,
  },
  warningText: {
    fontSize: 16,
    color: Colors.light.error,
    marginBottom: Sizes.marginLarge,
    textAlign: "center",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
    marginBottom: Sizes.marginLarge,
  },
  inputField: {
    marginBottom: Sizes.marginMedium,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Sizes.marginLarge,
  },
  checkboxLabel: {
    flex: 1,
    marginLeft: Sizes.marginMedium,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: Sizes.marginLarge,
  },
});

export default AdminBlockDeleteAccountPage;
