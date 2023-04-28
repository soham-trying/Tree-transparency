import Header from "@/components/Header";
import Loading from "@/components/Loading";
import TreeCard from "@/components/TreeCard";
import { auth, firestore } from "@/services/firebase";
import { useUserContext } from "@/services/userContext";
import { collection, doc, query } from "firebase/firestore";
import {
  useCollectionOnce,
  useDocumentOnce,
} from "react-firebase-hooks/firestore";

export default function VerifyTree() {
  const [trees, loadingTrees, errorTrees] = useCollectionOnce(
    collection(firestore, "Trees")
  );

  const [user, loadingUser] = useDocumentOnce(
    doc(firestore, "Users", auth.currentUser.email)
  );

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
                  !tree.isVerified &&
                  tree.data()?.ngo?.id === user.data().volunteerNgo
              )
              .map((tree) => (
                <TreeCard key={tree.id} id={tree.id} {...tree.data()} />
              ))}
        </div>
      </div>
    </>
  );
}
