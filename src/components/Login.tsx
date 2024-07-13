"use client";
import Image, { type StaticImageData } from "next/image";
import React, { useState } from "react";
import loginBanner from "../assets/login.jpg";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const Login = () => {
  const router = useRouter();
  const { data: session } = useSession();
  if (session) {
    router.push("/");
  }
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const handleChange = (e: any) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = () => {
    signIn("credentials", {
      email: data.email,
      password: data.password,
    });
  };
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="md:w-1/2 lg:w-2/3 flex items-center justify-center overflow-hidden">
        <Image
          src={loginBanner as StaticImageData}
          alt="login"
          layout="responsive"
          className="w-full h-auto"
        />
      </div>
      <div className="md:w-1/2 lg:w-1/3 flex items-center justify-center bg-gray-100 p-8">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold mb-8 text-center">Login</h1>
          <input
            type="text"
            name="email"
            placeholder="Email"
            className="w-full p-2 border border-gray-300 rounded mb-4"
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full p-2 border border-gray-300 rounded mb-4"
            onChange={handleChange}
          />
          <button
            className="w-full p-2 bg-blue-500 text-white rounded mb-4"
            onClick={handleSubmit}
          >
            Login
          </button>
          <div className="flex items-center justify-center my-4">
            <hr className="flex-grow border-gray-300" />
            <span className="mx-2 text-gray-500">or</span>
            <hr className="flex-grow border-gray-300" />
          </div>
          <button
            className="w-full p-2 flex items-center justify-center bg-black text-white rounded"
            onClick={() => signIn("github")}
          >
            <FaGithub className="mr-2" />
            Login with GitHub
          </button>
          <button
            className="w-full mt-4 p-2 flex items-center justify-center bg-white text- rounded"
            onClick={() => signIn("google", { callbackUrl: "/" })}
          >
            <FaGoogle className="mr-2 text-red-300" />
            Login with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
