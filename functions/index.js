const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.resetClicks = functions.pubsub.schedule("0 * * * *").timeZone("UTC").onRun((context) => {
  const db = admin.firestore();
  const usersRef = db.collection("users");

  // Atualize todos os documentos de usuário para reiniciar os cliques para 0
  return usersRef.get()
    .then(snapshot => {
      const batch = db.batch();
      snapshot.forEach(doc => {
        batch.update(doc.ref, { cliques: 0 });
      });
      return batch.commit();
    })
    .catch(error => {
      console.error("Erro ao redefinir cliques:", error);
      return null;
    });
});


//firebase deploy --only functions
// implementa function
