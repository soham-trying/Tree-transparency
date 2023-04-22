import { useRouter } from "next/router";
import Link from "next/link";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";

import Loading from "@/components/Loading";
import { firestore } from "@/services/firebase.js";
import { useUserContext } from "@/services/userContext";
import { useUserStore } from "@/store/user";

export default function Profile() {
  const router = useRouter();

  const { user } = useUserContext();
  const { userStore, setUser } = useUserStore();

  // const setUser = () => {};
  // const userStore = {};

  const [loading, setLoading] = useState();

  useEffect(() => {
    const redirectToLogin = () => {
      window.localStorage.setItem("redirectAfterLogin", "/profile");
      router.push("/login");
      return <Loading />;
    };

    user ? null : redirectToLogin();

    if (user) {
      setLoading(true);

      const docRef = doc(firestore, "Users", user.email);

      getDoc(docRef).then((docSnap) => {
        const user = docSnap.data();

        if (!docSnap.exists()) router.push("/profile/edit");

        // window.localStorage.setItem("userStore", JSON.stringify(userStore));
        setUser(user);
      });
    }
    setLoading(false);
  }, [user]);

  return loading ? (
    <Loading />
  ) : (
    <div className="container px-4 mx-auto">
      <div className="shadow-2xl card">
        <div className="card-body">
          {/* <pre>{JSON.stringify(userStore, null, 2)}</pre> */}
          <table className="table tabler-zebra">
            <tbody>
              <tr>
                <td>Username</td>
                <td>{userStore?.username}</td>
              </tr>
              <tr>
                <td>Type</td>
                <td>{userStore?.type}</td>
              </tr>
              <tr>
                <td>Pin Code</td>
                <td>{userStore?.pinCode}</td>
              </tr>
              <tr>
                <td>Phone</td>
                <td>{userStore?.phone}</td>
              </tr>
              {userStore?.type === "NGOs" ? (
                <>
                  <tr>
                    <td>NGO Id</td>
                    <td>{userStore?.ngoId}</td>
                  </tr>
                  <tr>
                    <td>NGO Address</td>
                    <td>{userStore?.ngoAddress}</td>
                  </tr>
                </>
              ) : (
                <></>
              )}
            </tbody>
          </table>

          <div className="mt-5 card-actions">
            <Link href={"/profile/edit"} className="btn btn-secondary">
              Edit Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
