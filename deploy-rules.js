console.log(`
To deploy Firebase rules, run the following commands after installing Firebase CLI:

1. Install Firebase CLI globally if you haven't already:
   npm install -g firebase-tools

2. Login to Firebase:
   firebase login

3. Initialize Firebase in this project (if not already done):
   firebase init firestore

4. Deploy the Firestore rules:
   firebase deploy --only firestore:rules

This will apply the rules in firestore.rules to your Firebase project.

For more details, visit: https://firebase.google.com/docs/firestore/security/get-started
`); 