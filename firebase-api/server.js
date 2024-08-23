const express = require('express');
const admin = require('./firebase-admin');
const cors = require('cors');
const dotenv = require('dotenv');
const XLSX = require('xlsx');

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



app.get('/downloadUsersData', async (req, res) => {
  try {

    // Fetch all users from Firebase Authentication
    const listUsersResult = await admin.auth().listUsers();

    // Initialize an array for storing the user data
    let usersData = [['UID', 'First Name' , 'Last Name', 'Email', 'User Type']];

    for (const userRecord of listUsersResult.users) {
      // Fetch user data from Firestore
      const userDoc = await admin.firestore().collection('users').doc(userRecord.uid).get();
      const userData = userDoc.data();

      // Add user data to the array
      usersData.push([
        userRecord.uid,
        userData?.fname || '',  
        userData?.lname || '',  
        userRecord.email,       
        userData?.userType || '' 
      ]);
    }

    // Create a new workbook and sheet with the user data
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(usersData);
    XLSX.utils.book_append_sheet(wb, ws, 'Users Data');

    // Generate an Excel file buffer
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });

    // Set headers for file download
    res.setHeader('Content-Disposition', 'attachment; filename="users_data.xlsx"');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

    // Send the file
    res.send(excelBuffer);

  } catch (error) {
    console.error('Error fetching users data:', error);
    res.status(500).json({
      status: 'failed',
      message: `Error fetching users data! Error: ${error.message}`
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
