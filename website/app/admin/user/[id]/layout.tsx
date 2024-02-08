import { ReactElement } from "react";

export default function UserLayout({ children, pointage, show } : { children: ReactElement, pointage: ReactElement, show: ReactElement}) {
  return (
    <section className="h-screen max-w-6xl m-auto flex justify-center items-center">
      {show}
      {pointage}
    </section>
  )
}