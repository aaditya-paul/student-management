import AdminNavBar from "@/components/adminNavBar";

export default function Layout({children}) {
  return (
    <section>
      <AdminNavBar>{children}</AdminNavBar>
    </section>
  );
}
