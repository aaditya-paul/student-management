import {Suspense} from "react";

export default function Layout({children}) {
  return (
    <section>
      <Suspense fallback={"Loading"}>{children}</Suspense>
    </section>
  );
}
