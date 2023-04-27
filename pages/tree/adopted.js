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
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";

export default function AdoptedTrees() {
  const [trees, setTrees] = useState([]);
  const router = useRouter();

  const { user } = useUserContext();
  const { userStore } = useUserStore();

  useEffect(() => {
    !user && router.push("/");
    getTrees();
  }, []);

  const getTrees = () => {
    if (!user) return;

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
    <>
    <Head>
        <title>My Trees</title>
    </Head>
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
              <Link
                href={`https://gateway.pinata.cloud/ipfs/${tree?.ipfsHash}`}
              >
                {`https://gateway.pinata.cloud/ipfs/${tree?.ipfsHash}`}
              </Link>
              <input className="input input-bordered input-primary" value={tree.transactionHash}></input>
            </div>
          </div>
        ))}
      </div>
    </div>
    </>
  );
}
