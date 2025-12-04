// Cloud Function: archive old bookings and release date locks
import { onSchedule } from "firebase-functions/v2/scheduler";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import { initializeApp } from "firebase-admin/app";

initializeApp();

export const archiveExpiredBookings = onSchedule("every 24 hours", async () => {
    const db = getFirestore();
    const now = Timestamp.now();
    const snap = await db.collection("bookings")
        .where("status", "in", ["accepted", "declined"])
        .where("endDate", "<", now)
        .get();

    if (snap.empty) return;

    const batch = db.batch();
    snap.forEach((docSnap) => {
        const data = docSnap.data();
        batch.update(docSnap.ref, {
            status: "archived",
            statusHistory: [...(data.statusHistory || []), { status: "archived", at: now, by: "system" }],
            archivedAt: now,
            updatedAt: now
        });
        (data.lockIds || []).forEach((lockId) => {
            batch.delete(db.collection("bookingLocks").doc(lockId));
        });
    });

    await batch.commit();
});
