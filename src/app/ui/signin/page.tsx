"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { z } from "zod";

const formSchema = z.object({
  email: z.string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" })
    .toLowerCase(),
  
  password: z.string()
    .min(6, { message: "Password must be at least 6 characters" })
});

type FormDataType = z.infer<typeof formSchema>;

const Signin: React.FC = () => {
  const [formData, setFormData] = useState<FormDataType>({
    email: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState<{ [key: string]: { message: string } }>({});
  const [errorSubmit, setErrorSubmit] = useState<string>("");
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const parseFormData = formSchema.safeParse(formData);

    if (!parseFormData.success) {
      const errors: { [key: string]: { message: string } } = {};

      parseFormData.error.errors.forEach((error) => {
        if (error.path[0]) {
          const fieldName = error.path[0].toString();
          errors[fieldName] = { message: error.message };
        }
      });

      setFormErrors(errors);
      setErrorSubmit("");
    } else {
      try {
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(parseFormData.data),
        });
        
        const data = await response.json();

        if (response.ok) {
          localStorage.setItem("authToken", data.token);
          setFormData({
            email: "",
            password: "",
          });
          setFormErrors({});
          setErrorSubmit("");
          router.replace("/ui/home");
        } else {
          setErrorSubmit(data.message || "Failed to log in. Please try again.");
        }
      } catch (error) {
        console.error(error);
        setErrorSubmit("An unexpected error occurred. Please try again later.");
      }
    }
  };

  const updateField = (field: string) => (value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  useEffect(() => {
    if (Object.keys(formErrors).length > 0) {
      const timer = setTimeout(() => {
        setFormErrors({});
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [formErrors]);

  return (
    <div className="flex justify-center items-center h-screen">
      <form
        className="flex flex-col justify-center items-center gap-6 w-[400px] h-[400px] pl-6 pr-6"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col w-full gap-4">
          <div className="flex flex-col w-full">
            <input 
              type="email" 
              name="email" 
              placeholder="Email"
              value={formData.email}
              onChange={(e) => updateField("email")(e.target.value)}
              className="p-2 rounded-lg focus:outline-none font-normal"
            />
            {formErrors.email && <div className="font-semibold text-red-600">{formErrors.email.message}</div>}
          </div>

          <div className="flex flex-col w-full">
            <input 
              type="password" 
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => updateField("password")(e.target.value)}
              className="p-2 rounded-lg focus:outline-none font-normal"
            />
            {formErrors.password && <div className="font-semibold text-red-600">{formErrors.password.message}</div>}
          </div>
        </div>
        
        <button 
          className="bg-blue-800 hover:bg-blue-700 rounded-lg w-full p-2 hover:scale-105 hover:shadow-lg hover:shadow-black font-semibold text-white"
        >
          Entrar
        </button>

        {errorSubmit && <div className="font-semibold text-red-600">{errorSubmit}</div>}
      </form>
    </div>
  );
};

export default Signin;
