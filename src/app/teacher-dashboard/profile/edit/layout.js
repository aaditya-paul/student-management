import {TransparentLoadingScreen} from "@/components/loadingScreen";
import {Suspense} from "react";

export default function Layout({children}) {
  return (
    <section>
      <Suspense fallback={<TransparentLoadingScreen />}>{children}</Suspense>
    </section>
  );
}
