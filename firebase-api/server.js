const express = require('express');
const admin = require('./firebase-admin'); // Ensure this file initializes the Firebase Admin SDK
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN;

const app = express();
app.use(express.json());

// CORS configuration
app.use(cors({
  origin: FRONTEND_ORIGIN
}));

app.delete('/removeUser/:uid', async (req, res) => {
  const { uid } = req.params;

  try {
    // Delete the user document from Firestore
    const userDocRef = admin.firestore().collection('users').doc(uid);
    await userDocRef.delete();

    // Delete user from Firebase Authentication
    await admin.auth().deleteUser(uid);

    res.status(200).json({
      status: 'success',
      message: 'User deleted successfully!'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      status: 'failed',
      message: `User deletion failed! Error: ${error.message}`
    });
  }
});


app.post('/registerUser', async (req, res) => {
  const { fname, lname, email, password, confirmPassword } = req.body;

  try {
    if(password !== confirmPassword){
      return res.status(200).json({
        status: 'failed',
        message: "Password did't match"
      })
    }
    // Create a new user in Firebase Authentication without signing them in
    const userRecord = await admin.auth().createUser({
      email: email,
      password: password,
    });

    const uid = userRecord.uid;

    // Store additional user information in Firestore
    const userDocRef = admin.firestore().collection('users').doc(uid);
    await userDocRef.set({
      fname: fname,
      lname: lname,
      email: email,
      userType: 'user'
    });

    res.status(201).json({
      status: 'success',
      message: 'User registered successfully!',
      userId: uid
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({
      status: 'failed',
      message: `User registration failed! Error: ${error.message}`
    });
  }
});

app.get('/', (req, res) => {
  res.send("Firebase API runs correctly!");
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);

});
