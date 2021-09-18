// import { useEffect, useState } from 'react';

// import { onAuthStateChanged } from 'firebase/auth';

// import { useHistory } from 'react-router-dom';

// const useAuthState = (auth) => {
//     const [authUser, setAuthUser] = useState(null);
//     let history = useHistory();

//     useEffect(() => {
//         const unlisten = onAuthStateChanged(auth, (authUser, error) => {
//             authUser ? setAuthUser(authUser) : setAuthUser(null);
//             console.log('USER:', authUser);
//         });

//         if (authUser) {
//             props.history.push('/');
//         }

//         return () => {
//             unlisten();
//         };
//     }, []);

//     return authUser;
// };

// export default useAuthState;
