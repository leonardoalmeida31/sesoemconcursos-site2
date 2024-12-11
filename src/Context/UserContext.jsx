/* eslint-disable react/prop-types */
import { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { getDoc, doc } from 'firebase/firestore';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [desempenhoPorDisciplina, setDesempenhoPorDisciplina] = useState(user?.desempenhoPorDisciplina || {});
  const [paymentInfo, setPaymentInfo] = useState(user?.paymentInfo || null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUser(currentUser);
          setDisplayName(currentUser.displayName || '');
          setDesempenhoPorDisciplina(userData.desempenhoPorDisciplina || {});
          setPaymentInfo(userData.paymentInfo || null);

          localStorage.setItem('user', JSON.stringify({
            uid: currentUser.uid,
            email: currentUser.email,
            displayName: currentUser.displayName,
            desempenhoPorDisciplina: userData.desempenhoPorDisciplina || {},
            paymentInfo: userData.paymentInfo || null,
          }));
        }
      } else {
        setUser(null);
        setDisplayName('');
        setDesempenhoPorDisciplina({});
        setPaymentInfo(null);
        localStorage.removeItem('user');
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={{ user, displayName, desempenhoPorDisciplina, paymentInfo }}>
      {children}
    </UserContext.Provider>
  );
};


export const useUser = () => useContext(UserContext);



