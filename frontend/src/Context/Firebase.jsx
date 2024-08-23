import React, { createContext, useContext, useState, useEffect } from "react";
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, collection, getDocs, updateDoc, query, where, addDoc, deleteDoc} from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID
};


// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(firebaseApp);
const firestore = getFirestore(firebaseApp);

const FirebaseContext = createContext(null);

export const useFirebase = () => useContext(FirebaseContext);

export const FirebaseProvider = (props) => {
    const [userId, setUserId] = useState(null);
    const [username, setUsername] = useState(null);
    const [userType, setUserType] = useState(null);
    const [isAuth, setAuth] = useState(false);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tasks, setTasks] = useState([]);


    // Function to refresh auth state on page load/refresh
    useEffect(() => {
        setLoading(true); // Start loading
        const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
            if (user) {
                const uid = user.uid;
                setUserId(uid);
                setAuth(true);

                const userRef = doc(firestore, 'users', uid);
                const docSnap = await getDoc(userRef);

                if (docSnap.exists()) {
                    const userData = docSnap.data();
                    setUsername(`${userData.fname} ${userData.lname}`);
                    setUserType(userData.userType);
                }
            } else {
                // Clear the data if the user is not authenticated
                setAuth(false);
                setUsername(null);
                setUserId(null);
                setUserType(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);


    const registerUser = async (fname, lname, email, password, tick) => {
        setLoading(true);
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
            }
            else {
                setUserId(uid);
                setAuth(true);
                setUsername(`${fname} ${lname}`);
                setUserType('user');
                return { success: true };
            }
        } catch (error) {
            console.error("Error during registration:", error);
            return { success: false, message: "Error creating user!" };
        } finally {
            setLoading(false);
        }
    };

    const loginUser = async (email, password) => {
        setLoading(true);
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
        } finally {
            setLoading(false);
        }
    };

    const logoutUser = async () => {
        setLoading(true);
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
        } finally {
            setLoading(false);
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

    const updateUser = async (id, firstName, lastName) => {
        setLoading(true);
        try {
            await updateDoc(doc(firestore, 'users', id), {
                fname: firstName,
                lname: lastName
            });
            return { success: true };
        } catch (error) {
            return { success: false };
        } finally {
            setLoading(false);
        }
    };

    const createTask = async (values) => {
        try {
            setLoading(true);
            // Reference to the tasks collection
            const tasksCollection = collection(firestore, 'tasks');

            // Add a new document to the tasks collection
            await addDoc(tasksCollection, {
                type: values.type,
                title: values.title,
                link: values.link,
                reward: values.reward
            });
            return { success: true };
        } catch (error) {
            return { success: false, error: error }
        } finally {
            setLoading(false);
        }
    }

    const fetchTasks = async () => {
        try {
            const tasksRef = collection(firestore, 'tasks');
            const snapshot = await getDocs(tasksRef);
            if (snapshot.empty) {
                return { success: false, message: 'No tasks found!' };
            }

            const tasksData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setTasks(tasksData);
            return { success: true };
        } catch (error) {
            console.error("Error fetching tasks:", error);
            return { success: false, message: "Error fetching tasks!" };
        }
    };

    const updateTask = async ({ uid, type, title, link, reward }) => {
        try{
            setLoading(true);
            await updateDoc(doc(firestore, 'tasks', uid), {
                type,
                title,
                link,
                reward
            });
            return { success: true };
        } catch (error){
            return { success: false };
        } finally {
            setLoading(false);
        }
    }

    const deleteTask = async (uid) => {
        try {
            setLoading(true);
            await deleteDoc(doc(firestore, 'tasks', uid));
            return { success: true };
        } catch (error) {
            return { success: false };
        } finally {
            setLoading(false);
        }
    }


    return (
        <FirebaseContext.Provider value={{ registerUser, loginUser, logoutUser, fetchUsers, updateUser, setLoading, createTask, fetchTasks, updateTask, deleteTask,  userId, username, isAuth, users, userType, loading, tasks }}>
            {props.children}
        </FirebaseContext.Provider>
    );
};

export default FirebaseContext;
