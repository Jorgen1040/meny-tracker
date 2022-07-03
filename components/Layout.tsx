import Navbar from '@components/Navbar';
import { PropsWithChildren } from 'react';
import Footer from "@components/Footer";

export default function Layout({ children }: PropsWithChildren<{}>) {
  return (
    <>
      <Navbar />
      <main className="container mx-auto max-w-5xl">{children}</main>
      <Footer />
    </>
  );
}