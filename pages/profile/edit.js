import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import userType from "@/constants/user-type.json";
import { useUserContext } from "@/services/userContext";
import { useRouter } from "next/router";
import { firestore } from "@/services/firebase";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { useUserStore } from "@/store/user";

export default function EditProfile() {
  const router = useRouter();

  const { user, changeDisplayName } = useUserContext();
  const { userStore, setUser } = useUserStore();

  const { register, handleSubmit, setValue, watch, getValues, isSubmitting } =
    useForm();

  useEffect(() => {
    // !user && router.push("/login");

    if (user) {
      const docRef = doc(firestore, "Users", user.email);
      const docSnap = getDoc(docRef)
        .then((docSnap) => {
          if (docSnap.exists()) {
            let userData = docSnap.data();

            setValue("username", userData.username ?? "");
            setValue("phone", userData.phone ?? "");
            setValue("pinCode", userData.pinCode ?? "");
            userData.type && setValue("type", userData.type ?? "");

            if (userData.type === "NGOs") {
              setValue("ngoId", userData.ngoId ?? "");
              setValue("type", userData.ngoAddress ?? "");
            }
          }
        })
        .catch((err) => console.error(err));
    }
  }, [user]);

  const onSubmit = async (data) => {
    await changeDisplayName(data.username);
    const docRef = doc(firestore, "Users", user.email);
    await updateDoc(docRef, {
      ...data,
      lastUpdated: serverTimestamp(),
    });
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) return;

    console.log(docSnap.data());
    setUser(docSnap.data());

    router.push("/profile");
  };

  return (
    <div className="container w-full mx-auto">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-center justify-center w-full max-w-4xl gap-5 px-4"
      >
        <div className="w-full form-control">
          <label htmlFor="username" className="label">
            {watch("type") === "NGOs" ? "NGO Name" : "Username"}
          </label>
          <input className="input input-bordered" {...register("username")} />
        </div>

        <div className="w-full form-control">
          <label htmlFor="pinCode" className="label">
            Pin Code
          </label>
          <input className="input input-bordered" {...register("pinCode")} />
        </div>

        <div className="w-full form-control">
          <label htmlFor="phone" className="label">
            Phone
          </label>
          <input className="input input-bordered" {...register("phone")} />
        </div>

        <div className="w-full form-control">
          <label htmlFor="type" className="label">
            Type
          </label>
          <select className="select select-bordered" {...register("type")}>
            {userType.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {watch("type") === "NGOs" ? <NGOFields register={register} /> : ""}

        <div className="w-full form-control">
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

function NGOFields({ register }) {
  return (
    <>
      <div className="w-full form-control">
        <label htmlFor="ngoId" className="label">
          NGO Id
        </label>
        <input
          {...register("ngoId")}
          type="text"
          className="input input-bordered"
        />
      </div>

      <div className="w-full form-control">
        <label htmlFor="ngoAddress" className="label">
          NGO Address
        </label>
        <input
          {...register("ngoAddress")}
          type="text"
          className="input input-bordered"
        />
      </div>
    </>
  );
}
