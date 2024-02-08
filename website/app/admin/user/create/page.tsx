"use client"
import { IUser } from "@/types/UserInterface"
import { useRouter } from "next/navigation";
import { useState } from "react"

export default function Show({ params }: { params: { id: string } }) {
  const [editedUser, setEditedUser] = useState<IUser>({
    firstName: '',
    lastName: '',
    role: [],
  });
  const [message, setMessage] = useState({message: "", style: ""})
  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage({message: "", style: ""})
    setEditedUser({
      ...editedUser,
      [e.target.name]: e.target.value,
    });
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setMessage({message: "", style: ""})
    setEditedUser((prevUser) => {
      if (prevUser.role === undefined) {
        prevUser.role = [];
      }
      if (checked) {
        return {
          ...prevUser,
          role: [...prevUser.role, value],
        };
      } else {
        return {
          ...prevUser,
          role: prevUser.role?.filter((role) => role !== value),
        };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    if (!editedUser.firstName || !editedUser.lastName || !editedUser.role) {
      setMessage({message: "Donnée manquante", style: "text-red-500"});
      return
    }
    e.preventDefault();
    const res = await fetch(`/api/user/`, {
      method: 'POST',
      body: JSON.stringify({
        firstName: editedUser.firstName,
        lastName: editedUser.lastName,
        role: editedUser.role,
      })
    });
    console.log(res);
    if (res.ok){
      setMessage({message: "Created", style: "text-green-500"});
      router.push('/admin')
    } else {
      setMessage({message: "Erreur lors de la Creation", style: "text-red-500"});
    }
  };

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-white shadow-lg p-11 rounded-md flex flex-col items-center justify-center gap-6">
        <button className="min-w-1/2 m-auto rounded-md px-4 py-2 shadow-md hover:shadow-sm focus:text-white" onClick={()=>router.push('/admin')} >Retour</button>
        <label>First Name:</label>
        <input defaultValue={editedUser.firstName} name="firstName" onChange={handleInputChange} className="border rounded-md bg-gray-200 bg-transparent w-full text-gray-700 mr-3 py-2 px-4 focus:border-blue-500 focus:bg-[#FEFEFE]" type="text" placeholder="Entrer votre identifiant" aria-label="Identifiant"/>
        <label>Last Name :</label>
        <input defaultValue={editedUser.lastName} name="lastName" onChange={handleInputChange} className="border rounded-md bg-gray-200 bg-transparent w-full text-gray-700 mr-3 py-2 px-4 focus:border-blue-500 focus:bg-[#FEFEFE]" type="text" placeholder="Entrer votre identifiant" aria-label="Identifiant"/>
        <label>Role:</label>
        <label>Admin <input type="checkbox" value={"ADMIN"} name="admin" checked={editedUser.role?.includes('ADMIN')} onChange={handleRoleChange} /></label>
        <label>User <input type="checkbox" value={"USER"} name="user" checked={editedUser.role?.includes('USER')} onChange={handleRoleChange} /></label>
        <br />
        <button type="submit" className="bg-blue-500 min-w-1/2 m-auto rounded-md px-4 py-2 shadow-md hover:shadow-sm focus:text-white" >Enregistrer</button>
        <label className={message.style}>{message.message}</label>
      </form>
    </div>
  );
}
