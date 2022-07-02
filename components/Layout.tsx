import Navbar from '@components/Navbar';
import { PropsWithChildren } from 'react';
import Footer from "@components/Footer";

export default function Layout({ children }: PropsWithChildren<{}>) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}