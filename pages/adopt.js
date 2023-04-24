import { useEffect, useState } from "react";
import {
  getDocs,
  collection,
  deleteDoc,
  doc,
  updateDoc,
  query,
  where,
} from "firebase/firestore";
import { firestore } from "@/services/firebase";
import { useUserContext } from "@/services/userContext";

export default function () {
  const [trees, setTrees] = useState([]);

  const { user } = useUserContext();

  useEffect(() => {
    getTrees();
  }, []);

  const getTrees = async () => {
    const treesRef = await getDocs(collection(firestore, "Trees"));

    const treesData = [];

    treesRef.forEach((snapshot) => {
        if (snapshot.data().adoptedBy) return;
      treesData.push({ id: snapshot.id, ...snapshot.data() });
    });

    console.log(treesData);
    setTrees(treesData);
  };

  const adoptTree = async (id) => {
    const treeRef = await updateDoc(doc(firestore, "Trees", id), {
      adoptedBy: doc(firestore, `Users/${user.email}`),
    });

    getTrees();
  };

  const deleteTree = async (id) => {
    await deleteDoc(doc(firestore, "Trees", id));
  };

  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-2 gap-4 px-4 md:grid-cols-3">
        {trees.map((tree) => (
          <div key={tree.id} className="shadow-xl card bg-base-100 border my-10">
            <figure>
              <img src={tree.imageUrl} alt={tree.name} />
            </figure>
            <div className="card-body  border">
              <h3 className="text-xl font-bold">{tree.name}</h3>
              <p>{tree.description}</p>
              <p>{tree.type}</p>
              <p>{tree.species}</p>
              <div className="card-actions">
                {tree.adoptedBy ? (
                    `Adopted`
                ) : (
                  <div
                    onClick={() => adoptTree(tree.id)}
                    className="btn btn-primary"
                  >
                    Adopt
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
