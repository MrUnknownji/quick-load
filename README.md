# Welcome to Our Expo Project 👋

This guide will help you set up and run our project, even if you're new to software development. Let's get started!

## Step 1: Install Required Tools

### 1.1 Install Node.js and npm

Node.js is a JavaScript runtime, and npm is a package manager that comes with it.

1. Visit the [Node.js website](https://nodejs.org/)
2. Download the LTS (Long Term Support) version for your operating system
3. Run the installer and follow the prompts
4. To verify installation, open a command prompt or terminal and type:
   ```
   node --version
   npm --version
   ```
   You should see version numbers if the installation was successful.

### 1.2 Install Git

Git is a version control system that helps manage code.

1. Visit the [Git website](https://git-scm.com/)
2. Download the version for your operating system
3. Run the installer and follow the prompts
4. To verify installation, open a command prompt or terminal and type:
   ```
   git --version
   ```
   You should see a version number if the installation was successful.

## Step 2: Set Up the Project

### 2.1 Clone the Repository

1. Open a command prompt or terminal
2. Navigate to where you want to store the project. For example:
   - On Windows: `cd C:\Projects`
   - On macOS/Linux: `cd ~/Projects`
3. Clone the repository by typing:
   ```
   git clone https://github.com/your-username/your-repo-name.git
   ```
4. Navigate into the project folder:
   ```
   cd your-repo-name
   ```

### 2.2 Install Project Dependencies

1. In the project folder, install dependencies by typing:
   ```
   npm install
   ```
   This may take a few minutes.

## Step 3: Run the Project

### 3.1 Start the Development Server

1. In the project folder, start the Expo development server:
   ```
   npx expo start
   ```
2. This will display a QR code in your terminal and open a new tab in your web browser with Expo Dev Tools.

### 3.2 Run on Your Mobile Device

1. Install the Expo Go app on your smartphone:
   - [Expo Go for Android](https://play.google.com/store/apps/details?id=host.exp.exponent)
   - [Expo Go for iOS](https://apps.apple.com/app/expo-go/id982107779)

2. Ensure your computer and smartphone are on the same Wi-Fi network.

3. Open the Expo Go app on your smartphone.

4. Use your smartphone's camera to scan the QR code displayed in your terminal or Expo Dev Tools.

5. The app should now load and run on your device!

## Troubleshooting

- If the QR code doesn't scan, make sure your phone's camera is focused on it.
- If you see "Unable to connect" errors:
  1. Check that your computer and phone are on the same Wi-Fi network.
  2. Try closing and reopening the Expo Go app.
  3. Ensure your computer's firewall isn't blocking the connection.

- If you encounter any error messages, try googling the exact error text. Many common issues have solutions online.

## Next Steps

Congratulations! You've set up and run the project. To start making changes:

1. Open the project folder in a text editor (like Notepad++ or Visual Studio Code).
2. Look for files ending in `.js` or `.jsx`. These contain the app's code.
3. Make small changes and save the file. The app should automatically update on your phone.

## Learn More

- [Expo Documentation](https://docs.expo.dev/): Learn more about building apps with Expo.
- [React Native Documentation](https://reactnative.dev/docs/getting-started): Understand the framework our app is built on.

## Questions or Issues?

If you run into any problems or have questions, please open an issue in this GitHub repository. We're here to help!

Happy exploring! 🚀
