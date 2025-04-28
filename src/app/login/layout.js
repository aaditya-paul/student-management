import LoadingScreen from "@/components/loadingScreen";
import {Suspense} from "react";

export default function Layout({children}) {
  return (
    <section>
      <Suspense fallback={<LoadingScreen />}>{children}</Suspense>
    </section>
  );
}
