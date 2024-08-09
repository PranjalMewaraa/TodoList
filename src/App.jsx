import React, { useState, useEffect } from "react";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  onAuthStateChanged,
  PhoneAuthProvider,
  signInWithCredential,
} from "../firebase";
import Dashboard from "./component/Dash";

function App() {
  const [verificationId, setVerificationId] = useState("");
  const [user, setUser] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");

  useEffect(() => {
    const auth = getAuth(); // Initialize auth

    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        "recaptcha-container",
        {
          size: "normal",
          callback: (response) => {
            console.log("reCAPTCHA solved, allowing phone authentication.");
          },
          "expired-callback": () => {
            console.log("reCAPTCHA expired, reset it.");
          },
        },
        auth
      );
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSendCode = async () => {
    const auth = getAuth(); // Initialize auth
    const appVerifier = window.recaptchaVerifier;
    const ph = `${phoneNumber}`;
    try {
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        ph,
        appVerifier
      );
      setVerificationId(confirmationResult.verificationId);
      document.getElementById("verification-code").style.display = "block";
      document.getElementById("verify-code-btn").style.display = "block";
      console.log("Code sent to phone number:", phoneNumber);
    } catch (error) {
      console.log(ph);
      console.error("Error during signInWithPhoneNumber:", error.message);
    }
  };

  const handleVerifyCode = async () => {
    const auth = getAuth(); // Initialize auth
    try {
      const credential = PhoneAuthProvider.credential(
        verificationId,
        verificationCode
      );
      const userCredential = await signInWithCredential(auth, credential);
      console.log(
        "Phone number verified and user signed in:",
        userCredential.user
      );
    } catch (error) {
      console.error("Error during verification:", error.message);
    }
  };

  const handleLogout = async () => {
    const auth = getAuth(); // Initialize auth
    try {
      await auth.signOut();
      console.log("Logged Out");
    } catch (error) {
      console.error("Error Logging Out:", error.message);
    }
  };

  return (
    <div
      className="w-full min-h-screen h-full p-4 flex justify-center items-center"
      style={{ backgroundColor: "#0F172A" }}
    >
      {!user ? (
        <div id="phone-auth-form" className="flex flex-col gap-8">
          <h2 className="text-white font-extrabold text-4xl sm:text-5xl lg:text-7xl tracking-tight text-center dark:text-white">
            Todo List Assignment
            <br />
            Datta Creatives - Practice Buzz Drive
          </h2>
          <p className="mt-6 text-lg text-gray-400 text-center max-w-3xl mx-auto dark:text-slate-400">
            Hey I am Pranjal Kachhawaha, I am an aspiring{" "}
            <code
              style={{ color: "#38BCF6" }}
              className="font-mono font-medium text-sky-500 dark:text-sky-400"
            >
              software developer
            </code>{" "}
            skilled in{" "}
            <code
              style={{ color: "#38BCF6" }}
              className="font-mono font-medium text-sky-500 dark:text-sky-400"
            >
              UI UX Designing
            </code>{" "}
            as well as{" "}
            <code
              style={{ color: "#38BCF6" }}
              className="font-mono font-medium text-sky-500 dark:text-sky-400"
            >
              Developing applications
            </code>{" "}
            for mobile and web environments. Here is my portfolio{" "}
            <span>
              <a
                href="https://pranjalkachhawaha.netlify.app/"
                className="text-sky-500 underline"
              >
                Click Here
              </a>
            </span>
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <input
              className="w-full md:w-4/5 flex items-center text-left space-x-3 px-4 h-12 bg-white ring-1 ring-slate-900/10 hover:ring-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm rounded-lg text-slate-400 dark:bg-slate-800 dark:ring-0 dark:text-slate-300 dark:highlight-white/5 dark:hover:bg-slate-700"
              type="text"
              id="phone-number"
              placeholder="Phone Number"
              value={phoneNumber.replace(/^\+91/, "")}
              onChange={(e) => setPhoneNumber(`+91${e.target.value}`)}
            />
            <button
              id="send-code-btn"
              className="bg-slate-900 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 text-white font-semibold h-12 px-6 rounded-lg w-full flex items-center justify-center sm:w-auto dark:bg-sky-500 dark:highlight-white/20 dark:hover:bg-sky-400"
              style={{ backgroundColor: "#38BCF6" }}
              onClick={handleSendCode}
            >
              Get OTP
            </button>
          </div>
          <div id="recaptcha-container" className="flex justify-center"></div>
          <div className="flex gap-4 justify-center">
            <input
              className="w-1/5 hidden sm:flex items-center w-72 text-left space-x-3 px-4 h-12 bg-white ring-1 ring-slate-900/10 hover:ring-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm rounded-lg text-slate-400 dark:bg-slate-800 dark:ring-0 dark:text-slate-300 dark:highlight-white/5 dark:hover:bg-slate-700"
              type="text"
              id="verification-code"
              placeholder="Verification Code"
              style={{ display: "none" }}
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
            />
            <button
              className="bg-slate-900 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 text-white font-semibold h-12 px-6 rounded-lg w-full flex items-center justify-center hidden sm:w-auto dark:bg-sky-500 dark:highlight-white/20 dark:hover:bg-sky-400"
              style={{ backgroundColor: "#38BCF6" }}
              id="verify-code-btn"
              onClick={handleVerifyCode}
            >
              Verify & Login
            </button>
          </div>
          <p className=" text-center text-white">
            If you want to use test account enter{" "}
            <code
              style={{ color: "#38BCF6" }}
              className="font-mono px-1 font-medium text-sky-500 dark:text-sky-400"
            >
              9717583895
            </code>{" "}
            and use{" "}
            <code
              style={{ color: "#38BCF6" }}
              className="font-mono px-1 font-medium text-sky-500 dark:text-sky-400"
            >
              324212
            </code>{" "}
            as OTP
          </p>
        </div>
      ) : (
        <Dashboard user={user} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;
