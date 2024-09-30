import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { responsive, vw, vh } from "@/utils/responsive";

const PrivacyPolicyScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.contentContainer}>
        <ThemedText style={styles.title}>Privacy Policy</ThemedText>
        <ThemedText style={styles.date}>
          Last updated: {new Date().toLocaleDateString()}
        </ThemedText>

        <ThemedText style={styles.paragraph}>
          Welcome to Quick Load! Your privacy is important to us, and we are are
          committed to protecting the personal information you provide while
          using our app. This Privacy Policy explains how we collect, use, and
          safeguard your information.
        </ThemedText>

        <ThemedText style={styles.sectionTitle}>
          1. Information We Collect
        </ThemedText>
        <ThemedText style={styles.paragraph}>
          When you use our app, we may collect the following types of
          information:
        </ThemedText>
        <ThemedText style={styles.bullet}>
          • <ThemedText style={styles.bold}>Personal Information:</ThemedText>{" "}
          This includes your name, email address, phone number, or other details
          you may provide when registering for our services or interacting with
          the app.
        </ThemedText>
        <ThemedText style={styles.bullet}>
          • <ThemedText style={styles.bold}>Usage Data:</ThemedText> We may
          automatically collect information about how you access and use the
          app. This may include your device type, operating system, IP address,
          and usage patterns.
        </ThemedText>
        <ThemedText style={styles.bullet}>
          • <ThemedText style={styles.bold}>Location Information:</ThemedText>{" "}
          If you enable location services, we may collect your location to
          provide location-based features in the app.
        </ThemedText>

        <ThemedText style={styles.sectionTitle}>
          2. How We Use Your Information
        </ThemedText>
        <ThemedText style={styles.paragraph}>
          We may use the information we collect to:
        </ThemedText>
        <ThemedText style={styles.bullet}>
          • Provide and improve our app’s functionality.
        </ThemedText>
        <ThemedText style={styles.bullet}>
          • Personalize your user experience.
        </ThemedText>
        <ThemedText style={styles.bullet}>
          • Send you important updates or promotional materials (with your
          consent).
        </ThemedText>
        <ThemedText style={styles.bullet}>
          • Analyze usage data to enhance our app's performance and reliability.
        </ThemedText>
        <ThemedText style={styles.bullet}>
          • Respond to your support requests and inquiries.
        </ThemedText>

        <ThemedText style={styles.sectionTitle}>
          3. Sharing Your Information
        </ThemedText>
        <ThemedText style={styles.paragraph}>
          We do not sell or rent your personal information to third parties.
          However, we may share your information with:
        </ThemedText>
        <ThemedText style={styles.bullet}>
          • Service providers who help us operate and improve our app.
        </ThemedText>
        <ThemedText style={styles.bullet}>
          • Legal authorities if required by law or to protect our rights.
        </ThemedText>

        <ThemedText style={styles.sectionTitle}>4. Data Security</ThemedText>
        <ThemedText style={styles.paragraph}>
          We take reasonable measures to protect your information from
          unauthorized access, use, or disclosure. However, no method of
          transmission over the internet is 100% secure.
        </ThemedText>

        <ThemedText style={styles.sectionTitle}>5. Your Choices</ThemedText>
        <ThemedText style={styles.paragraph}>
          You can control your personal information by:
        </ThemedText>
        <ThemedText style={styles.bullet}>
          • Accessing and updating your profile information.
        </ThemedText>
        <ThemedText style={styles.bullet}>
          • Opting out of marketing communications.
        </ThemedText>

        <ThemedText style={styles.sectionTitle}>
          6. Children’s Privacy
        </ThemedText>
        <ThemedText style={styles.paragraph}>
          Our app is not intended for children under the age of 13. We do not
          knowingly collect personal information from children.
        </ThemedText>

        <ThemedText style={styles.sectionTitle}>
          7. Changes to This Policy
        </ThemedText>
        <ThemedText style={styles.paragraph}>
          We may update this Privacy Policy from time to time. Any changes will
          be posted in the app, and the date at the top will be updated.
        </ThemedText>

        <ThemedText style={styles.sectionTitle}>8. Contact Us</ThemedText>
        <ThemedText style={styles.paragraph}>
          If you have any questions or concerns about this Privacy Policy, you
          can contact us at:
        </ThemedText>
        <ThemedText style={styles.bullet}>• Email: [Support Email]</ThemedText>
        <ThemedText style={styles.bullet}>
          • Address: [Company Address]
        </ThemedText>
      </ThemedView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  contentContainer: {
    padding: responsive(20),
  },
  title: {
    fontSize: responsive(24),
    fontWeight: "bold",
    marginBottom: responsive(10),
    textAlign: "center",
  },
  date: {
    fontSize: responsive(14),
    color: "gray",
    textAlign: "center",
    marginBottom: responsive(20),
  },
  sectionTitle: {
    fontSize: responsive(18),
    fontWeight: "bold",
    marginTop: responsive(20),
    marginBottom: responsive(10),
  },
  paragraph: {
    fontSize: responsive(16),
    lineHeight: responsive(24),
    marginBottom: responsive(10),
  },
  bullet: {
    fontSize: responsive(16),
    marginLeft: responsive(20),
    marginBottom: responsive(5),
  },
  bold: {
    fontWeight: "bold",
  },
});

export default PrivacyPolicyScreen;
