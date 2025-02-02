"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Home: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      router.back();
    }
    else {
      setLoading(false);
    }
  }, []);

  return (
    <>
      {!loading && <div>Home</div>}
      {loading && <div>Carregando...</div>}
    </>
  );
}

export default Home;