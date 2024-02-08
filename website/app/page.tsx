"use client"
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useState } from "react";
import { useCookies } from 'next-client-cookies';

export default function Home() {
  const [identifiant, setIdentifiant] = useState("566825");
  const [message, setMessage] = useState("Ajouter \'A\' avant l\'identifiant pour le mode admin");
  const [styleError, setStyleError] = useState("text-blue-500")
  const [loading, setLoading] = useState(false);
  const [pause, setPause] = useState(false);
  const router = useRouter()
  const cookies = useCookies();

  const handleIdentifiant = (e: ChangeEvent<HTMLInputElement>) => {
    setIdentifiant(e.target.value);
  };

  const handleForm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!identifiant) {
      setMessage("Aucun identifiant");
      return;
    }

    setLoading(true);
    const res = await fetch(`/api/pointage/`, {
      method: "POST",
      body: JSON.stringify({ code: identifiant, pause: pause })
    });
    const data = await res.json();
    if (data.redirect) {
      cookies.set('code', identifiant.slice(1, identifiant.length))
      router.push('/admin')
    }
    if (res.ok)
      setStyleError("text-green-500")
    else
      setStyleError("text-red-500")
    data.message ? setMessage(data.message) : 0
    setLoading(false);
  };
  return (
    <main className="h-screen max-w-5xl m-auto flex justify-center items-center flex-col">
      <div className="bg-white shadow-xl p-6 rounded-lg flex items-center justify-center flex-col">
        <h1 className="p-4 text-4xl border-b border-black w-full text-center text-blue-500 font-bold">TimeTrack<label className="font-semibold text-[#E9C46A]">Pro</label></h1>
        <form onSubmit={handleForm} className="p-6 gap-4 flex flex-col min-w-80">
          <label>Identifiant :</label>
          <input defaultValue={identifiant} onChange={handleIdentifiant} className="border rounded-md bg-gray-200 bg-transparent w-full text-gray-700 mr-3 py-2 px-4 focus:border-blue-500 focus:bg-[#FEFEFE]" type="text" placeholder="Entrer votre identifiant" aria-label="Identifiant"/>
          <p className={`${styleError} text-xs italic`}>{message}</p>
          <label>Prenez-vous ou revenez vous de votre pause ? <input type="checkbox" onClick={() => setPause(!pause)}/></label>
          { loading ?
          <button disabled className="bg-gray-300 min-w-1/2 m-auto rounded-md px-4 py-2 shadow-md" >Enregistrer</button>
          :
          <button type="submit" className="bg-blue-500 min-w-1/2 m-auto rounded-md px-4 py-2 shadow-md hover:shadow-sm focus:text-white" >Enregistrer</button>
          }
        </form>
      </div>
    </main>
  );
}
