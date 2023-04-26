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
import { ethers } from "ethers";
import { getContractAddress } from "ethers/lib/utils";
import { firestore } from "@/services/firebase";
import { useUserContext } from "@/services/userContext";
import { contract } from "@/services/transactweb3";
import TreeToken from "@/artifacts/contracts/TreeNFT.sol/TreeToken.json";
import Link from "next/link";
import { treeContractAddress } from "@/constants/contract-address";

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

  const adoptTree = async (id, metadataURI) => {
    // Create Contract
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();


    const contract = new ethers.Contract(treeContractAddress, TreeToken.abi, signer);
    console.log(contract);
    const connection = contract.connect(signer);
    const result = await contract.mint(connection.address, metadataURI);
    const anotherResult = await result.wait();

    console.log(result, anotherResult);

    const treeRef = await updateDoc(doc(firestore, "Trees", id), {
      adoptedBy: doc(firestore, `Users/${user.email}`),
      transactionHash: result.hash
    });

    getTrees();
    alert("Adopted Tree");
  };

  const deleteTree = async (id) => {
    await deleteDoc(doc(firestore, "Trees", id));
  };

  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-2 gap-4 px-4 md:grid-cols-3">
        {trees.map((tree) => (
          <div
            key={tree.id}
            className="my-10 border shadow-xl card bg-base-100"
          >
            <figure>
              <img src={tree.imageUrl} alt={tree.name} />
            </figure>
            <div className="border card-body">
              <h3 className="text-xl font-bold">{tree.name}</h3>
              <p>{tree.description}</p>
              <p>{tree.type}</p>
              <p>{tree.species}</p>
              <Link
                href={`https://gateway.pinata.cloud/ipfs/${tree?.ipfsHash}`}
              >
                {`https://gateway.pinata.cloud/ipfs/${tree?.ipfsHash}`}
              </Link>
              <div className="card-actions">
                {tree.adoptedBy ? (
                  `Adopted`
                ) : (
                  <div
                    onClick={() =>
                      adoptTree(
                        tree.id,
                        `https://gateway.pinata.cloud/ipfs/${tree?.ipfsHash}`
                      )
                    }
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
