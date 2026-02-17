import { collection, deleteDoc, doc, getDocs, setDoc } from "firebase/firestore";
import { db } from "../Services/FirebaseService";

export interface ProductModel {
    img: string;
    id: string;
    product_name: string;
    unit_price: string;
    status:string;
    
    qty?:string;
    total?:string;
}

// Fetch all products from Firestore
export const fetchProducts = async (): Promise<ProductModel[]> => {
    try {
        const snapshot = await getDocs(collection(db, 'products'));
        
        return snapshot.docs.map((doc) => {
            const data = doc.data() as ProductModel;

            return data  
        });
    } catch (error) {
        console.error("Error fetching products:", error);
        return [];
    }
}

// Add or Update a product in Firestore
export const addProduct = async (newProduct: ProductModel) => {
    try {
        // Using product_id as the document identifier
        const docRef = doc(db, 'products', newProduct.id);
        await setDoc(docRef, newProduct);
    } catch (error) {
        console.error("Error adding product:", error);
        throw error;
    }
}


//remove product
export const deleteProduct= async(product: ProductModel)=>{
    const ref=doc(db,'products', product.id)
    await deleteDoc(ref);
}