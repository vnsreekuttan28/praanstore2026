import { collection, deleteDoc, doc, getDocs, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../Services/FirebaseService";
import { remove } from "firebase/database";

 export interface StoreModel {
  id: string;        
  name: string;
  address: string;
  contact: string;
  location: string;
  status:string;
 
}

//fetch from firebase

export const fetchStore=async ():Promise<StoreModel[]>=>{

const snapshot= await getDocs(collection(db,'stores'))

return snapshot.docs.map((doc)=>{
    const data=doc.data() as StoreModel
    return data;
    
})

}

//add to firebase
export const addStore=async (store:StoreModel)=>{
    const dbref=doc(db,'stores', store.id);
    await setDoc(dbref,store)
    

}

//delete
export const deleteStore=async (store:StoreModel)=>{
    const dbref=doc(db,'stores',store.id.trim());
    await deleteDoc(dbref)
}

//deactivate

export const deactivateStore=async(store:StoreModel)=>{
    const ref=doc(db, "stores",store.id.trim());
    await updateDoc(ref,{status:"inactive"})
}