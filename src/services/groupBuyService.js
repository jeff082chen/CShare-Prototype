import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
    getFirestore, collection, addDoc, getDocs, deleteDoc, doc, updateDoc, getDoc,
    query, orderBy, serverTimestamp, arrayUnion, arrayRemove, increment 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { firebaseConfig } from "../../env-config.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const COLLECTION_NAME = "groupBuys";

export const groupBuyService = {
    
    // 1. Create
    async createGroupBuy(data) {
        try {
            const docRef = await addDoc(collection(db, COLLECTION_NAME), {
                ...data,
                createdAt: serverTimestamp(),
                currentParticipants: 1, 
                status: 'OPEN',
                comments: [] // Initialize empty comments array
            });
            return { success: true, id: docRef.id };
        } catch (error) {
            console.error("Error adding document: ", error);
            return { success: false, error };
        }
    },

    // 2. Fetch All
    async getActiveGroupBuys() {
        try {
            const q = query(collection(db, COLLECTION_NAME), orderBy("createdAt", "desc"));
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error("Error fetching group buys:", error);
            return [];
        }
    },

    // 3. Get Single (For refreshing details)
    async getGroupBuyById(buyId) {
        try {
            const docRef = doc(db, COLLECTION_NAME, buyId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                return { id: docSnap.id, ...docSnap.data() };
            }
            return null;
        } catch (error) {
            console.error("Error getting doc:", error);
            return null;
        }
    },

    // 4. Join
    async joinGroupBuy(buyId, userId) {
        try {
            const buyRef = doc(db, COLLECTION_NAME, buyId);
            await updateDoc(buyRef, {
                participantIds: arrayUnion(userId),
                currentParticipants: increment(1)
            });
            return { success: true };
        } catch (error) {
            console.error("Error joining:", error);
            return { success: false, error };
        }
    },

    // 5. Leave
    async leaveGroupBuy(buyId, userId) {
        try {
            const buyRef = doc(db, COLLECTION_NAME, buyId);
            await updateDoc(buyRef, {
                participantIds: arrayRemove(userId), 
                currentParticipants: increment(-1)   
            });
            return { success: true };
        } catch (error) {
            console.error("Error leaving:", error);
            return { success: false, error };
        }
    },

    // 6. Delete
    async deleteGroupBuy(buyId) {
        try {
            await deleteDoc(doc(db, COLLECTION_NAME, buyId));
            return { success: true };
        } catch (error) {
            console.error("Error deleting:", error);
            return { success: false, error };
        }
    },

    // 7. Add Comment (NEW)
    async addComment(buyId, commentData) {
        try {
            const buyRef = doc(db, COLLECTION_NAME, buyId);
            await updateDoc(buyRef, {
                comments: arrayUnion(commentData)
            });
            return { success: true };
        } catch (error) {
            console.error("Error commenting:", error);
            return { success: false, error };
        }
    }
};