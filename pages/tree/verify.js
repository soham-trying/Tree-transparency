import Header from "@/components/Header";
import Loading from "@/components/Loading";
import { auth, firestore } from "@/services/firebase";
import Link from "next/link";
import Image from "next/image";
import { collection, doc, query, updateDoc } from "firebase/firestore";
import {
  useCollectionOnce,
  useDocumentOnce,
} from "react-firebase-hooks/firestore";
import { IconExternalLink } from "@tabler/icons-react";

export default function VerifyTree() {
  const [trees, loadingTrees, errorTrees, reloadTrees] = useCollectionOnce(
    collection(firestore, "Trees")
  );

  const [user, loadingUser] = useDocumentOnce(
    doc(firestore, "Users", auth.currentUser.email)
  );

  function verifyTree(id) {
    const treeRef = doc(firestore, "Trees", id);
    updateDoc(treeRef, {
      isVerified: true,
      verifiedBy: doc(firestore, `Users/${user.id}`),
    })
      .then(() => {
        alert("Verified Tree");
      })
      .catch((err) => console.error(err));
    reloadTrees();
  }

  //   const { user } = useUserContext();

  return (
    <>
      <Header title="Verify Trees" />

      <div className="container mx-auto">
        <div className="grid grid-cols-1 mt-6 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {loadingTrees && loadingUser && <Loading />}
          {trees &&
            user &&
            trees.docs
              .filter(
                (tree) =>
                  tree.isVerified &&
                  tree.data()?.ngo?.id === user.data().volunteerNgo
              )
              .map((tree) => (
                <div key={tree.id}>
                  <div className="w-full overflow-hidden duration-200 bg-gray-200 rounded-md min-h-80 aspect-h-1 aspect-w-1 lg:aspect-none group-hover:opacity-75 lg:h-80">
                    <Image
                      width={200}
                      height={320}
                      src={tree.data().imageUrl}
                      alt={tree.data().name}
                      className="object-cover object-center w-full h-full lg:h-full lg:w-full"
                    />
                  </div>
                  <div className="grid gap-2">
                    <div className="flex justify-between mt-4">
                      <div>
                        <h3 className="font-bold text-md text-base-content">
                          <div>{tree.data().name}</div>
                        </h3>
                        <p className="mt-1 text-sm text-base-content opacity-70">
                          {tree.data().species} &middot; {tree.data().type}
                        </p>
                      </div>
                      <div>
                        {tree.data().isVerified ? (
                          <button className="btn btn-success">Verified</button>
                        ) : (
                          <button
                            className="btn btn-error"
                            onClick={() => verifyTree(tree.id)}
                          >
                            Unverified
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </>
  );
}
