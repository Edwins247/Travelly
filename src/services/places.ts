import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/services/firebase';

export async function addPlace(data: any) {
  await addDoc(collection(db, 'places'), {
    ...data,
    imageUrls: data.imageUrl ? [data.imageUrl] : [],
    stats: { likes: 0, reviewCount: 0 },
    createdAt: serverTimestamp(),
  });
}
