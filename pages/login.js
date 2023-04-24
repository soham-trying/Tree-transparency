import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { IconX, IconAlertCircle } from "@tabler/icons-react";

import { useUserContext } from "@/services/userContext";

import Banner from "@/components/Banner";

export default function Login() {
  const { register, handleSubmit } = useForm();
  const router = useRouter();

  const {
    error,
    user,
    handlePasswordlessRedirect,
    passwordLessLogin,
    emailSent,
  } = useUserContext();

  const redirectUser = () => {
    const redirectLink = window.localStorage.getItem("redirectAfterLogin");
    window.localStorage.removeItem("redirectAfterLogin");
    if (redirectLink) {
      router.push(redirectLink);
    } else {
      router.push("/profile");
    }
  };

  useEffect(() => {
    user ? redirectUser() : null;

    if (window.location.href.includes("apiKey"))
      handlePasswordlessRedirect(window.location.href);
  }, [user]);

  const onSubmit = (data) => {
    console.log(data);
    if (data.email) passwordLessLogin(data.email);
  };

  return (
    <div className="container">
      <Banner className="my-10" />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col max-w-4xl gap-6 min-w-4xl m-auto"
      >
        {/* Show error if there is any */}
        {error !== "" ? (
          <div
            className="relative px-4 py-3 my-2 text-red-700 bg-red-100 border border-red-400 rounded-lg"
            role="alert"
          >
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline">{" " + error}</span>
            <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
              <IconX />
            </span>
          </div>
        ) : (
          <></>
        )}

        {emailSent ? (
          <div
            className="px-4 py-3 my-2 text-teal-900 bg-teal-100 border-t-4 border-teal-500 rounded-b shadow-md"
            role="alert"
          >
            <div className="flex">
              <div className="py-1">
                <IconAlertCircle />
              </div>
              <div>
                <p className="font-bold">Email sent successfully!</p>
                <p className="text-sm">
                  Login link sent to the above email address. Close this tab
                  once you click that link.
                  <br />
                  (Check your <b>Promotions</b> or <b>Spam folder</b>)
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div
            className="px-4 py-3 my-2 text-blue-700 bg-blue-100 border border-blue-500 rounded-lg"
            role="alert"
          >
            <p className="font-bold">No need to create an account!</p>
            <p className="text-sm">
              We have already taken care of that for you. A login link would be
              sent to this email.
            </p>
          </div>
        )}
        <div className="form-control">
          <label htmlFor="email" className="label">
            Email
          </label>
          <input
            type="email"
            className="input input-bordered"
            {...register("email")}
            required
          />
        </div>

        <button className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
}
