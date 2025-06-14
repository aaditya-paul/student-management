import StudentNavbar from "@/components/studentNavBar";

export default function Layout({children}) {
  return (
    <section>
      <StudentNavbar>{children}</StudentNavbar>
    </section>
  );
}
