import Navbar from "./Navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  <>
    <Navbar />
    <main className="mx-auto max-w-7xl  p-4">{children}</main>
  </>;
}
