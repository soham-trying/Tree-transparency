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
      (snapshot) => {},
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
    <div className="container px-4 mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <div className="form-control">
          <label htmlFor="name" className="label">
            Tree Name
          </label>
          <input
            type="text"
            className="input input-bordered"
            {...register("name")}
            required
          />
        </div>

        <div className="form-control">
          <label className="label" htmlFor="type">
            Tree Description
          </label>
          <input
            type="text"
            name="type"
            className="input input-bordered"
            {...register("description")}
            required
          />
        </div>

        <div className="form-control">
          <label className="label" htmlFor="type">
            Tree Type
          </label>
          <select
            type="text"
            name="type"
            className="select select-bordered"
            {...register("type")}
            required
          >
            {treeType.map((value) => (
              <option value={value}>{value}</option>
            ))}
          </select>
        </div>

        <div className="form-control">
          <label className="label" htmlFor="species">
            Tree species
          </label>
          <select
            type="text"
            name="type"
            className="select select-bordered"
            {...register("species")}
            required
          >
            {treeSpecies.map((value) => (
              <option value={value}>{value}</option>
            ))}
          </select>
        </div>

        <div className="form-control">
          <label htmlFor="location" className="label">
            Location
          </label>
          <input
            type="text"
            className="input input-bordered"
            {...register("location")}
            required
          />
        </div>

        <div className="form-control">
          <label htmlFor="image" className="label">
            Image
          </label>
          <input
            type="file"
            className="w-full max-w-xs file-input file-input-bordered"
            {...register("images")}
          />
        </div>

        <div className="form-control">
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
