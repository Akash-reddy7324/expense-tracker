const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();

exports.onExpenseWrite = functions.firestore
  .document("expenses/{uid}/items/{expenseId}")
  .onWrite(async (change, context) => {
    const uid = context.params.uid;
    const after = change.after.exists ? change.after.data() : null;
    const before = change.before.exists ? change.before.data() : null;
    const dateISO = (after?.date || before?.date);
    if (!dateISO) return;

    const monthKey = dateISO.slice(0,7);
    const itemsRef = db.collection("expenses").doc(uid).collection("items");
    const start = new Date(`${monthKey}-01T00:00:00.000Z`);
    const end = new Date(new Date(start).setMonth(start.getMonth()+1));

    const snap = await itemsRef
      .where("date", ">=", start.toISOString())
      .where("date", "<", end.toISOString())
      .get();

    const byCat = {};
    let total = 0;
    snap.forEach(doc => {
      const { amount = 0, category = "Other" } = doc.data();
      total += amount;
      byCat[category] = (byCat[category] || 0) + amount;
    });

    const topCategories = Object.entries(byCat)
      .map(([name, sum]) => ({ name, total: sum }))
      .sort((a,b)=>b.total-a.total).slice(0,3);

    await db.collection("insights").doc(uid).collection("months").doc(monthKey).set({
      month: monthKey,
      total,
      topCategories,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
  });
