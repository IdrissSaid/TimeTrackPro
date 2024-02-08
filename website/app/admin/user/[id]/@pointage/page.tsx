"use client"
import { IPointage } from "@/types/PointageInterface";
import { useEffect, useState } from "react"

export default function Pointage({ params }: { params: { id: string } }) {
  const [pointages, setPointages] = useState<Array<IPointage>>()
  useEffect(() => {
    const getData = async () => {
      const res = await fetch(`/api/user/${params.id}`, {
        method: 'GET',
      });
      const data = await res.json();

      if (res.ok) {
        console.log(data)
        setPointages(data.user.pointages)
      }
    };
    getData();
  }, [params.id]);
  if (!pointages) return <div className="w-full h-full flex items-center justify-center"><h1>Loading...</h1></div>;
  if (pointages.length == 0) return <div className="w-full h-full flex items-center justify-center"><h1>Aucune donnée.</h1></div>;

  return (
    <div className="bg-white shadow-lg p-11 h-3/5 min-w-80 rounded-md flex flex-col items-center justify-center gap-6 overflow-x-scroll">
      {
        pointages.map((pointage, index) => {
          return (
            <div key={index}>
              <h1>
                {`${pointage.date}`}
                {pointage.pause ? ' Pause' : ' Not Pause'}
              </h1>
            </div>
          );
        })
      }
    </div>
  )
}