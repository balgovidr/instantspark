import { getAuth, onAuthStateChanged, User } from '@firebase/auth';
import app from '../../firebaseConfig';
import { getFirestore, setDoc, doc, collection, query, where, getDocs, addDoc, orderBy } from "@firebase/firestore";
import { getDatabase, ref, child, get } from "@firebase/database";


export async function findMatch() {
  // const [matchUid, setMatchUid] = useState(null);
  var matchUidTemp = null;

  const db = getFirestore(app);
  const dbr = getDatabase();
  const dbrRef = ref(dbr);

  const matchesRef = collection(db, "matches");

  const q = query(matchesRef, where("users", "array-contains", getAuth().currentUser.uid), orderBy('percentage', 'desc'));
  await getDocs(q).then(async (querySnapshot) => {
    
    for(let i = 0; i<querySnapshot.size; i++) {
      var doc=querySnapshot.docs[i]
      if (matchUidTemp === null) {
        var possibleMatchUid = null;
        if (doc.data().users[0] === getAuth().currentUser.uid) {
          possibleMatchUid = doc.data().users[1];
        } else {
          possibleMatchUid = doc.data().users[0];
        }
        matchUidTemp = await get(child(dbrRef, `${possibleMatchUid}/active`)).then((snapshot) => {
          if (snapshot.exists()) {
            if (snapshot.val()) {
              return possibleMatchUid
              // console.log(matchUidTemp);
              // setMatchUid(matchUidTemp);
            }
          }
        }).catch((error) => {
          console.error(error);
        });
      }
    }
    
  });
  return matchUidTemp
}