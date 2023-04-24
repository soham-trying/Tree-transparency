import { firestore, storage } from "@/services/firebase";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { treeType } from "@/constants/tree-type";
import { treeSpecies } from "@/constants/tree-species";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function TreeForm() {
  const { register, handleSubmit, reset } = useForm();
  const [trees, setTrees] = useState([]);

  const getTrees = async () => {
    const treesRef = await getDocs(collection(firestore, "Trees"));

    const treesData = [];

    treesRef.forEach((snapshot) => {
      treesData.push(snapshot.data());
    });

    console.log(treesData);
    setTrees(treesData);
  };

  const onSubmit = async (data) => {
    const { images, ...rest } = data;
    const image = images[0];

    const treeRef = await addDoc(collection(firestore, "Trees"), rest);

    console.log(treeRef.data);

    const storageRef = ref(storage, `/planted/${treeRef.id}`);

    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on(
      "state_changed",
      (snapshot) => { },
      (err) => console.log(err),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async (url) => {
          console.log(url)
          await updateDoc(doc(firestore, "Trees", treeRef.id), {
            imageUrl: url,
          });
        }).catch(err => console.error(err));
      }
    );

    reset()
    alert("Added Tree");
  };

  return (
    <div className="container mx-auto py-8">
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
        <div className="mb-6">
          <label htmlFor="name" className="block text-gray-700 font-bold mb-2">Tree Name</label>
          <input type="text" className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline" {...register("name")} required />
        </div>

        <div className="mb-6">
          <label htmlFor="description" className="block text-gray-700 font-bold mb-2">Tree Description</label>
          <input type="text" className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline" {...register("description")} required />
        </div>

        <div className="mb-6">
          <label htmlFor="type" className="block text-gray-700 font-bold mb-2">Tree Type</label>
          <select type="text" name="type" className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline" {...register("type")} required>
            {treeType.map((value) => (
              <option value={value}>{value}</option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label htmlFor="species" className="block text-gray-700 font-bold mb-2">Tree species</label>
          <select type="text" name="species" className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline" {...register("species")} required>
            {treeSpecies.map((value) => (
              <option value={value}>{value}</option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label htmlFor="location" className="block text-gray-700 font-bold mb-2">Location</label>
          <input type="text" className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline" {...register("location")} required />
        </div>

        <div className="mb-6">
          <label htmlFor="images" className="block text-gray-700 font-bold mb-2">Image</label>
          <input type="file" className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline" {...register("images")} />
        </div>

        <div className="flex items-center justify-center mt-6">
          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-700 focus:outline-none focus:shadow-outline">Submit</button>
        </div>
      </form>
    </div>);
}
