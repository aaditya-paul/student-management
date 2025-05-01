import TeacherNavbar from "@/components/teacherNavBar";

export default function Layout({children}) {
  return (
    <section>
      <TeacherNavbar>{children}</TeacherNavbar>
    </section>
  );
}
