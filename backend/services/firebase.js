import admin from 'firebase-admin';
import serviceAccount from '../firebase-adminsdk.json' assert { type: 'json' };
import dotenv from 'dotenv'

dotenv.config()

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL, // Realtime Database URL
});

const db = admin.database(); // Initialize Realtime Database
const ref = db.ref('tasks'); // Access Realtime Database reference for 'tasks'

// Example: Fetching tasks from Realtime Database
ref.once('value', (snapshot) => {
  const tasks = snapshot.val();
  console.log(tasks);
});


export { db };
