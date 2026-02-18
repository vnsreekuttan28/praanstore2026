import { collection, deleteDoc, doc, getDoc, getDocs, orderBy, query, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../Services/FirebaseService";

export interface OrderItem {
    price: string;
    product_id: string;
    product_name: string;
    qty: string;
    status: string;
}

// export interface OrderCustomer {
//     address: string;
//     contact: string;
//     id: string;
//     location: string;
//     name: string;
// }

export interface Payment {
    total: string,
    received: string,
    balance: string
}

export interface Timestamp {
    created:string,
    completed:string
}

export interface Customer {
   
    name: string,
    contact: string
}
export enum OrderStatus {
  Assigned = "Assigned",
  OutForDelivery = "Out-for-delivery",
  Delivered = "Delivered",
  Cancelled = "Cancelled",
}
export interface assigendto{
    name:string,
    id:string
}

export interface OrderModel {
    id: string;
    assiged_by: string;
    assiged_to: assigendto;
    payment: Payment;
    timestamp: Timestamp;
    order_items:OrderItem[];
    order_status:OrderStatus;
    note:string;
    customer:Customer;
    store_id:string;    
}



export const fetchOrders = async (): Promise<OrderModel[]> => {
    try {
        const ordersRef = collection(db, 'orders');
        const q = query(ordersRef, orderBy("id", "desc"));
        const snapshot = await getDocs(q);

        return snapshot.docs.map((doc) => {
            const data = doc.data() as OrderModel;

            return data
                
        });
    } catch (error) {
        console.error("Error fetching orders:", error);
        return [];
    }
}

//add to firestore 
export const addOrder = async (neworder: OrderModel) => {
    const docref = doc(db, 'orders', neworder.id);
    await setDoc(docref, neworder);

}

//remove order
export const deleteOrder=async(order:OrderModel)=>{
  const orderref=doc(db,'orders',order.id);
  await deleteDoc(orderref)
}

//cancel order 
export const cancelOrder=async(order:OrderModel)=>{
    const ref=doc(db, "orders",order.id)

    await updateDoc(ref, {order_status:"Cancelled"})

}
