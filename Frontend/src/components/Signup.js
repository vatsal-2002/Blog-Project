import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Auth.css";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    captcha: "",
  });
  const [message, setMessage] = useState("");
  const [captchaCode, setCaptchaCode] = useState("");
  const [captchaError, setCaptchaError] = useState("");

  const generateCaptcha = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let code = "";

    for (let i = 0; i < 6; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    setCaptchaCode(code);
  };

  const generateCaptchaBackground = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = 200;
    canvas.height = 80;

    for (let i = 0; i < 10; i++) {
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.strokeStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.3)`;
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    const fontSize = 40;
    ctx.font = `bold ${fontSize}px Arial`;
    ctx.fillStyle = "black";

    const letters = captchaCode.split("");
    const totalWidth = letters.reduce((acc, letter) => acc + ctx.measureText(letter).width + 5, 0);
    let startX = (canvas.width - totalWidth) / 2;

    letters.forEach((letter) => {
      const randomYOffset = Math.random() * 10 - 5;
      const randomRotation = (Math.random() - 0.5) * 0.3;

      ctx.save();
      const centerY = canvas.height / 2 + randomYOffset;

      ctx.translate(startX, centerY);
      ctx.rotate(randomRotation);

      ctx.fillText(letter, 0, 0);

      ctx.restore();
      startX += ctx.measureText(letter).width + 5;
    });

    for (let i = 0; i < 3; i++) {
      ctx.beginPath();

      const lineType = Math.random();

      if (lineType < 0.33) {
        const y = Math.random() > 0.5 ? 10 : canvas.height - 10;
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
      } else if (lineType < 0.66) {
        ctx.moveTo(0, 0);
        ctx.lineTo(canvas.width, canvas.height);
      } else {
        ctx.moveTo(canvas.width, 0);
        ctx.lineTo(0, canvas.height);
      }

      ctx.strokeStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.7)`;
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    return canvas.toDataURL();
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === "captcha") {
      setCaptchaError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.captcha !== captchaCode) {
      setCaptchaError("Captcha code is incorrect.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/register", formData);
      setMessage(response.data.message);
      setFormData({ username: "", email: "", password: "", captcha: "" });
      setCaptchaError("");
    } catch (error) {
      setMessage(error.response?.data?.error || "Error occurred");
    }
  };

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            alt="Your Company"
            src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
            className="mx-auto h-10 w-auto"
          />
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Name
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>

            {/* CAPTCHA Field */}
            <div>
              <div className="flex items-center gap-2">
                <div className="captcha-container bg-gray-200 p-2 text-center text-lg font-bold">
                  <img
                    src={generateCaptchaBackground()}
                    alt="Captcha Image"
                    className="captcha-image"
                    style={{
                      height: "24px",
                      width: "auto",
                    }}
                  />
                </div>
                <button
                  type="button"
                  onClick={generateCaptcha}
                  className="flex items-center justify-center bg-transparent p-2"
                >
                  <img
                    src={require("../assets/refresh.png")}
                    alt="Refresh"
                    className="w-6 h-6"
                  />
                </button>
              </div>
              <div className="mt-2">
                <input
                  type="text"
                  name="captcha"
                  placeholder="Enter CAPTCHA"
                  value={formData.captcha}
                  onChange={handleChange}
                  required
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
              {captchaError && <p className="text-red-500 text-sm">{captchaError}</p>}
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign in
              </button>
            </div>
          </form>
          {message && <p>{message}</p>}
        </div>
      </div>
    </>
  );
};

export default Signup;
