import { collection, deleteDoc, doc, getDoc, getDocs, setDoc, where } from "firebase/firestore";
import { db } from "../Services/FirebaseService";
import { promises } from "dns";
import { ref } from "firebase/database";

export interface UserModel {
    id: string;
    name: string;
    contact: string;
    pw: string;
    role: string;
    status: string

}

//get from firebase
export const fetchUsers = async (): Promise<UserModel[]> => {
    const querySnapshot = await getDocs(collection(db, 'users'));
    return querySnapshot.docs.map((doc) => {
        const data = doc.data() as UserModel;
        return {
            id: data.id,
            name: data.name,
            contact: data.contact,
            pw: data.pw,
            role: data.role,
            status: data.status,
            


        };
    });
}

//add to firebase
export const addUser=async (user:UserModel)=>{
    const db_ref=doc(db,'users',user.id);
    await setDoc(db_ref,user)
    
}

export const deleteUser=async(user:UserModel)=>{
    const dbref=doc(db,'users',user.id)
    await deleteDoc(dbref);
}

