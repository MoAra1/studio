import Head from "next/head";

const gtmID = "GTM-PN27VN7";

const GoogleTagManager = () => (
  <>
    <Head>
      <script
        dangerouslySetInnerHTML={{
          __html: `
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id=%27+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtmID}');`,
        }}
      />
    </Head>

    <noscript
      dangerouslySetInnerHTML={{
        __html: `
<iframe src="https://www.googletagmanager.com/ns.html?id=${gtmID}" 
height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
      }}
    />
  </>
);

export default GoogleTagManager;
