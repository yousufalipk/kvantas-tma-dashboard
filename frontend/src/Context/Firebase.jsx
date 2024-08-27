import React, { createContext, useContext, useState, useEffect } from "react";
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, collection, getDocs, updateDoc, query, where, addDoc, deleteDoc } from 'firebase/firestore';
import { getStorage, deleteObject } from 'firebase/storage';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID
};


// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(firebaseApp);
const firestore = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);

const FirebaseContext = createContext(null);

export const useFirebase = () => useContext(FirebaseContext);

export const FirebaseProvider = (props) => {
    const [userId, setUserId] = useState(null);

    const [username, setUsername] = useState(null);

    const [userType, setUserType] = useState(null); //Temp change to admin otherwise null

    const [isAuth, setAuth] = useState(null);   // Temp changed to true otherwise null

    const [users, setUsers] = useState([]);

    const [telegramUsers, setTelegramUsers] = useState([]);

    const [annoucement, setAnnoucement] = useState([]);

    const [loading, setLoading] = useState(false);

    const [tasks, setTasks] = useState([]);


    // Function to refresh auth state on page load/refresh
    useEffect(() => {
        setLoading(true);
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

    const fetchTelegramUsers = async () => {
        try {
            const telegramUsersQuery = query(collection(firestore, 'telegramUsers'));
            const telegramUsersSnapshot = await getDocs(telegramUsersQuery);
            const telegramUsers = telegramUsersSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setTelegramUsers(telegramUsers);
            return { success: true, telegramUsers: telegramUsers };
        } catch (error) {
            console.error("Error fetching telegram users:", error);
            return { success: false, message: "Error fetching telegram users!" };
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
            const tasksCollection = collection(firestore, 'socialTask');
            // Add a new document to the tasks collection
            await addDoc(tasksCollection, {
                image: values.type,
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
            const tasksRef = collection(firestore, 'socialTask');
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
        try {
            setLoading(true);
            await updateDoc(doc(firestore, 'socialTask', uid), {
                image: type,
                title,
                link,
                reward
            });
            return { success: true };
        } catch (error) {
            console.log("Error updating task", error);
            return { success: false };
        } finally {
            setLoading(false);
        }
    };

    const deleteTask = async (uid) => {
        try {
            setLoading(true);
            await deleteDoc(doc(firestore, 'socialTask', uid));
            return { success: true };
        } catch (error) {
            return { success: false };
        } finally {
            setLoading(false);
        }
    }

    const createAnnoucement = async (values) => {
        try {
            setLoading(true);
    
            let downloadURL = '';
    
            if (values.image) {
                const storageRef = ref(storage, `announcements/${Date.now()}_${values.image.name}`);

                const snapshot = await uploadBytes(storageRef, values.image);

                downloadURL = await getDownloadURL(snapshot.ref);
            }
    
            // Add the announcement to Firestore
            const annoucementCollection = collection(firestore, 'announcements');
    
            await addDoc(annoucementCollection, {
                title: values.title,
                description: values.description,
                status: false, 
                image: downloadURL || null,
                imageName: values.image.name || null
            });
    
            return { success: true };
        } catch (error) {
            console.error("Error creating announcement:", error);
            return { success: false, error: error.message };
        } finally {
            setLoading(false);
        }
    };

    const fetchAnnoucement = async () => {
        try {
            const tasksRef = collection(firestore, 'announcements');
            const snapshot = await getDocs(tasksRef);
            if (snapshot.empty) {
                return { success: false, message: 'No annoucements found!' };
            }

            const tasksData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setAnnoucement(tasksData);
            return { success: true };
        } catch (error) {
            console.error("Error fetching annoucement:", error);
            return { success: false, message: "Error fetching annoucements!" };
        }
    };

    const updateAnnoucement = async ({ uid, title, description, image }) => {
        try {
            setLoading(true);
    
            // Fetch the existing announcement document
            const announcementDocRef = doc(firestore, 'announcements', uid);
            const announcementSnapshot = await getDoc(announcementDocRef);
    
            if (!announcementSnapshot.exists()) {
                throw new Error('Announcement not found');
            }
    
            const announcementData = announcementSnapshot.data();
            let downloadURL = announcementData.image || '';
            let imageName = announcementData.imageName || ''; 
    
            // Delete the existing image if a new image is provided
            if (image && announcementData.image) {
                const imageRef = ref(storage, announcementData.image); 
                await deleteObject(imageRef); // Delete the existing image
            }
    
            // Upload the new image if provided
            if (image) {
                const storageRef = ref(storage, `announcements/${Date.now()}_${image.name}`);
                const snapshot = await uploadBytes(storageRef, image);
                downloadURL = await getDownloadURL(snapshot.ref);
                imageName = image.name; 
            }
    
            // Update the announcement document in Firestore
            await updateDoc(announcementDocRef, {
                title: title,
                description: description,
                status: false,
                image: downloadURL || null,
                imageName: imageName || null,
            });
    
            return { success: true };
        } catch (error) {
            console.error("Error updating announcement:", error);
            return { success: false, error: error.message };
        } finally {
            setLoading(false);
        }
    };

    const toggleAnnoucementStatus = async (uid, status) => {
        try {
            console.log("Status", status, "Uid", uid);
            setLoading(true);
    
            // Fetch the existing announcement document
            const announcementDocRef = doc(firestore, 'announcements', uid);
    
            // Update the announcement document in Firestore
            if(status){
                await updateDoc(announcementDocRef, {
                    status: false
                });
            }
            else{
                await updateDoc(announcementDocRef, {
                    status: true
                });
            }
    
            return { success: true };
        } catch (error) {
            console.error("Error updating announcement:", error);
            return { success: false, error: error.message };
        } finally {
            setLoading(false);
        }
    };

    const deleteAnnoucement = async (uid) => {
        try {
            setLoading(true);
        
            const announcementDoc = await getDoc(doc(firestore, 'announcements', uid));
            
            if (announcementDoc.exists()) {
                const announcementData = announcementDoc.data();
                const imagePath = announcementData.image; 
        
                await deleteDoc(doc(firestore, 'announcements', uid));

                if (imagePath) {
                    const imageRef = ref(storage, imagePath);
                    await deleteObject(imageRef);
                }
            }
        
            return { success: true };
        } catch (error) {
            console.error("Error deleting announcement:", error);
            return { success: false, error: error.message };
        } finally {
            setLoading(false);
        }
    };

    const calculateDashboardMetrics = async () => {
        try {
            // Fetch users data
            const usersCollectionRef = collection(firestore, 'users');
            const usersSnapshot = await getDocs(usersCollectionRef);

            const telegramUsersCollectionRef = collection(firestore, 'telegramUsers');
            const telegramUsersSnapshot = await getDocs(telegramUsersCollectionRef);
            
            const totalUsers = usersSnapshot.size; // Total number of users
            const totalTelegramUsers = telegramUsersSnapshot.size; // Total number of Telegram users
            
            const userTypes = {};
            usersSnapshot.forEach((doc) => {
                const userType = doc.data().userType;
                if (userTypes[userType]) {
                    userTypes[userType] += 1;
                } else {
                    userTypes[userType] = 1;
                }
            });
    
            // Fetch announcements data
            const announcementsCollectionRef = collection(firestore, 'announcements');
            const activeAnnouncementsQuery = query(announcementsCollectionRef, where("status", "==", true));
            const activeAnnouncementsSnapshot = await getDocs(activeAnnouncementsQuery);
            const activeAnnouncements = activeAnnouncementsSnapshot.size; 
    
            // Fetch tasks data
            const tasksCollectionRef = collection(firestore, 'socialTask');
            const tasksSnapshot = await getDocs(tasksCollectionRef);
            const totalTasks = tasksSnapshot.size; 
    
            const tasksByType = {};
            tasksSnapshot.forEach((doc) => {
                const taskType = doc.data().image;
                if (tasksByType[taskType]) {
                    tasksByType[taskType] += 1;
                } else {
                    tasksByType[taskType] = 1;
                }
            });
    
            // Return the calculated metrics
            return {
                totalUsers,
                totalTelegramUsers,
                userTypes, 
                activeAnnouncements,
                totalTasks,
                tasksByType 
            };
        } catch (error) {
            console.error("Error calculating dashboard metrics:", error);
            return { success: false, message: "Error calculating metrics" };
        }
    };


    return (
        <FirebaseContext.Provider value={{ registerUser, loginUser, logoutUser, fetchUsers, fetchTelegramUsers, updateUser, setLoading, createTask, fetchTasks, updateTask, deleteTask, setTelegramUsers, createAnnoucement, fetchAnnoucement, updateAnnoucement, deleteAnnoucement, calculateDashboardMetrics, toggleAnnoucementStatus, userId, username, isAuth, users, userType, loading, tasks, telegramUsers, annoucement }}>
            {props.children}
        </FirebaseContext.Provider>
    );
};

export default FirebaseContext;
