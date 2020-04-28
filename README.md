Install 
npm install cordova-plugin-stripe
npm install @ionic-native/stripe
ionic cap sync

- Replace IP in constants.ts
const API_URL = 'http://192.168.0.13:8000/';

RUN in IOs emulator:

- ionic build
- npx cap copy ios && npx cap sync ios && npx cap open ios

- ionic capacitor run ios --livereload



