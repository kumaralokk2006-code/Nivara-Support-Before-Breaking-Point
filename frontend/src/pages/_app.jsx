import React from 'react';
import Head from 'next/head';
import { AuthProvider } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/globals.css';

export default function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Head>
        <title>NIVARA — Early Student Support Ecosystem</title>
        <meta name="description" content="Nivara is a consent-first student support system based on SIH PS-29." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Navbar />
      <main className="main-content">
        <Component {...pageProps} />
      </main>
      <Footer />
    </AuthProvider>
  );
}
