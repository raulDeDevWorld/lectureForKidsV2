import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyAffV35hXX6Hn8ZXDLQH_44Bn6awkmJCO4",
  authDomain: "websitelg.firebaseapp.com",
  databaseURL: "https://websitelg-default-rtdb.firebaseio.com",
  projectId: "websitelg",
  storageBucket: "websitelg.appspot.com",
  messagingSenderId: "630578358289",
  appId: "1:630578358289:web:012e797e0b7c1ef9a8a9b0"
};



// const firebaseConfig = {
//   apiKey: "AIzaSyBGuykgxxymY34XJrV32TtraUpYG8EXlB0",
//   authDomain: "logistics-2024-dc168.firebaseapp.com",
//   databaseURL: "https://logistics-2024-dc168-default-rtdb.firebaseio.com",
//   projectId: "logistics-2024-dc168",
//   storageBucket: "logistics-2024-dc168.appspot.com",
//   messagingSenderId: "707217924699",
//   appId: "1:707217924699:web:f39c6017d9977d5187557e"
// };


export const app = initializeApp(firebaseConfig)
