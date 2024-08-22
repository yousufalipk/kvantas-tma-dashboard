import React, { createContext, useContext, useState } from "react";
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, deleteUser } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, collection, getDocs, deleteDoc, updateDoc, query, where } from 'firebase/firestore';
// Import Firebase Functions if used
import { getFunctions, httpsCallable } from 'firebase/functions';

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBUBsEywMKqo7oWfhzcmtkhPcQMWAL0QAY",
    authDomain: "react-firebase-project-5e24c.firebaseapp.com",
    databaseURL: "https://react-firebase-project-5e24c-default-rtdb.firebaseio.com",
    projectId: "react-firebase-project-5e24c",
    storageBucket: "react-firebase-project-5e24c.appspot.com",
    messagingSenderId: "597020078395",
    appId: "1:597020078395:web:851c8a14c4be9c5249c71e"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(firebaseApp);
const firestore = getFirestore(firebaseApp);
const functions = getFunctions(firebaseApp);

const FirebaseContext = createContext(null);

export const useFirebase = () => useContext(FirebaseContext);

export const FirebaseProvider = (props) => {
    const [userId, setUserId] = useState(null);
    const [username, setUsername] = useState(null);
    const [userType, setUserType] = useState(null);
    const [isAuth, setAuth] = useState(false);
    const [users, setUsers] = useState([]);

    const registerUser = async (fname, lname, email, password, tick) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
            const user = userCredential.user;
            const uid = user.uid;

            // Store additional user information in Firestore
            await setDoc(doc(firestore, 'users', uid), {
                fname: fname,
                lname: lname,
                email: email,
                userType: 'user'
            });

            if (tick) {
                return { success: true };
            } else {
                setUserId(uid);
                setAuth(true);
                setUsername(`${fname} ${lname}`);
                setUserType('user');
                return { success: true };
            }
        } catch (error) {
            console.error("Error during registration:", error);
            return { success: false, message: "Error creating user!" };
        }
    };

    const loginUser = async (email, password) => {
        try {
            const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, password);
            const user = userCredential.user;
            const uid = user.uid;

            setUserId(uid);
            setAuth(true);

            const userRef = doc(firestore, 'users', uid);
            const docSnap = await getDoc(userRef);

            if (docSnap.exists()) {
                const userData = docSnap.data();
                setUsername(`${userData.fname} ${userData.lname}`);
                setUserType(userData.userType);
                return { success: true };
            } else {
                return { success: false, message: "No such document!" };
            }
        } catch (error) {
            console.error("Error logging in:", error);
            return { success: false, message: "Error logging in!" };
        }
    };

    const logoutUser = async () => {
        try {
            await signOut(firebaseAuth);
            setAuth(false);
            setUsername(null);
            setUserId(null);
            setUserType(null);
            return { success: true };
        } catch (error) {
            console.error("Error during logout:", error);
            return { success: false, message: "Error logging out!" };
        }
    };

    const fetchUsers = async () => {
        try {
            const usersQuery = query(collection(firestore, 'users'), where('userType', '!=', 'admin'));
            const querySnapshot = await getDocs(usersQuery);
            const nonAdminUsers = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setUsers(nonAdminUsers);
            return { success: true };
        } catch (error) {
            console.error("Error fetching non-admin users:", error);
            return { success: false, message: "Error fetching users!" };
        }
    };

    const removeUser = async (userId) => {
        try {
            // Delete the user document from Firestore
            await deleteDoc(doc(firestore, 'users', userId));

            const auth = getAuth();
            const user = auth.currentUser; // Make sure the user is authenticated

            if (user) {
                try {
                    await deleteUser(user);
                    return { success: true };
                } catch (error) {
                    return { success: false };
                }
            } else {
                return { success: false };
            }
        } catch (error) {
            console.error("Error deleting user and data:", error);
            return { success: false, message: "Error deleting user and data." };
        }
    };

    const updateUser = async (id, firstName, lastName) => {
        try {
            await updateDoc(doc(firestore, 'users', id), {
                fname: firstName,
                lname: lastName
            });
            return { success: true };
        } catch (error) {
            return { success: false };
        }
    };

    return (
        <FirebaseContext.Provider value={{ registerUser, loginUser, logoutUser, fetchUsers, removeUser, updateUser, userId, username, isAuth, users, userType }}>
            {props.children}
        </FirebaseContext.Provider>
    );
};

export default FirebaseContext;
