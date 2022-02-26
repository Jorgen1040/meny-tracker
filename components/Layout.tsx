import Navbar from '@components/Navbar';
import { PropsWithChildren } from 'react';
//import Footer from './footer'

export default function Layout({ children }: PropsWithChildren<{}>) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      {/* <Footer /> */}
    </>
  )
}