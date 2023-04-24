import { useEffect, useState } from "react";
import {
  getDocs,
  collection,
  deleteDoc,
  doc,
  updateDoc,
  query,
  where,
  getDoc,
} from "firebase/firestore";
import { firestore } from "@/services/firebase";
import { useUserContext } from "@/services/userContext";
import { useUserStore } from "@/store/user";

export default function AdoptedTrees() {
  const [trees, setTrees] = useState([]);

  const { user } = useUserContext();
  const { userStore } = useUserStore();

  useEffect(() => {
    getTrees();
  }, []);

  const getTrees = () => {
    // console.log(user.email)
    getDocs(
      query(
        collection(firestore, "Trees"),
        where("adoptedBy", "==", doc(firestore, "Users", user.email))
      )
    ).then((treesRef) => {
      const treesData = [];

      treesRef.forEach((snapshot) => {
        treesData.push({ id: snapshot.id, ...snapshot.data() });
      });

      console.log(treesData);
      setTrees(treesData);
    });
  };

  const deleteTree = async (id) => {
    await deleteDoc(doc(firestore, "Trees", id));
  };

  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-2 gap-4 px-4 md:grid-cols-3">
        {trees.map((tree) => (
          <div key={tree.id} className="shadow-xl card bg-base-100 my-10">
            <figure>
              <img src={tree.imageUrl} alt={tree.name} />
            </figure>
            <div className="card-body">
              <h3 className="text-xl font-bold">{tree.name}</h3>
              <p>{tree.description}</p>
              <p>{tree.type}</p>
              <p>{tree.species}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
