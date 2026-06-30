import Head from 'next/head';

import Header from './Header'
import Nav from './Nav'
import Footer from './Footer'

import { metaData } from "@/config";



const Layout = ({
  pageTitle,
  pageDescription,
  siteSeoTitle,
  socialTitle,
  socialDescription,
  relativePath,
  candidateName,
  children,
}) => {
  const { baseUrl } = metaData

  const pageUrl = relativePath === '/' ? `${baseUrl}/` : `${baseUrl}/${relativePath}/`
  const featureImage = `${baseUrl}/banner-fb.jpg`
  const featureX = `${baseUrl}/banner-x.jpg`
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <title>{siteSeoTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="image" content={featureImage} />
        <link rel="canonical" href={pageUrl} />
        {/* OpenGraph / FB */}
        <meta property="og:url" content={pageUrl} />
        <meta property="og:locale" content="en_US" />
        <meta property="og:site_name" content="WyoFile" />
        <meta property="og:title" content={socialTitle} />
        <meta property="og:description" content={socialDescription} />
        <meta property="og:image" content={featureImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:type" content="website" />
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@wyofile" />
        <meta name="twitter:creator" content="@wyofile" />
        <meta name="twitter:title" content={socialTitle} />
        <meta name="twitter:image" content={featureX} />
        <meta name="twitter:description" content={socialDescription} />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </Head>

      {/* <Script async src="https://www.googletagmanager.com/gtag/js?id=G-306KYTFJD8"></Script>
      <Script id="ga">
        {`
        window.dataLayer = window.dataLayer || [];
        function gtag(){window.dataLayer.push(arguments);}
        gtag('js', new Date());

        gtag('config', 'G-306KYTFJD8');
      `}
      </Script> */}

      <Header />
      <Nav candidateName={candidateName} />
      <main>{children}</main>
      <Footer />
    </>
  );
}

export default Layout