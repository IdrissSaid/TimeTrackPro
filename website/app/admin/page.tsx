"use client"
import { IUser } from "@/types/UserInterface"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

function TableView({ data }: { data: Array<IUser> }) {
  const router = useRouter()
  return (
    <table className="w-full text-sm text-left rtl:text-right text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
                <th scope="col" className="px-6 py-3">
                  Nom Prenom
                </th>
                <th scope="col" className="px-6 py-3">
                  Roles
                </th>
                <th scope="col" className="px-6 py-3">
                  Code
                </th>
                <th scope="col" className="px-6 py-3">
                  Pointages
                </th>
                <th scope="col" className="px-6 py-3">
                  Heure
                </th>
                <th scope="col" className="px-6 py-3">
                    <span className="sr-only">Edit</span>
                </th>
            </tr>
        </thead>
        <tbody>
        {
          data.map((line, index) => {
            return (
              <tr key={index} className="bg-white border-b hover:bg-gray-50">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{line.firstName} {line.lastName}</th>
                <td className="px-6 py-4">{line.role}</td>
                <td className="px-6 py-4">{line.code}</td>
                <td className="px-6 py-4">{line.pointages?.length}</td>
                <td className="px-6 py-4">{line.heures}</td>
                <td className="px-6 py-4 text-right">
                    <a href={`admin/user/${line.code}`} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
                </td>
              </tr>
            )
          })
        }
        </tbody>
        <tr>
          <th></th>
          <th></th>
          <th></th>
          <th></th>
          <th></th>
          <th className="px-6 py-4 text-right"><button onClick={() => router.push("/admin/user/create")} className="bg-blue-500 min-w-1/2 m-auto rounded-md px-4 py-2 shadow-md hover:shadow-sm text-white" >Crée un Utilisateur</button></th>
        </tr>
    </table>
  )
}

export default function Admin() {
  const [data, setData] = useState<Array<IUser>>()

  useEffect(() => {
    const getData = async () => {
      const res = await fetch('/api/user', {method: 'GET'})
      const d = await res.json()

      if (res.ok)
        setData(d.users)
    }
    getData()
  }, [])

  if (!data) return <div className="w-full h-full flex items-center justify-center"><h1>Loading...</h1></div>;

  return (
    <div className="flex bg-white items-center justify-center h-screen">
      <div className="overflow-x-auto shadow-md sm:rounded-lg w-4/5">
        <TableView data={data}/>
      </div>
    </div>
  )
}