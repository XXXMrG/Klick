import type { Metadata } from "next";
import { Bebas_Neue, JetBrains_Mono, DM_Sans } from "next/font/google";
import "./globals.css";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Klick — Web Metronome",
  description:
    "A precision metronome for musicians. Tap tempo, custom time signatures, subdivisions, accent editor, tempo trainer and more. Runs in the browser, no install needed.",
  keywords: ["metronome", "tap tempo", "bpm", "music practice", "rhythm", "web metronome"],
  openGraph: {
    title: "Klick — Web Metronome",
    description: "A precision metronome for musicians. Runs in the browser.",
    type: "website",
    images: ["/og-preview.png"],
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var l = localStorage.getItem('metronome-locale');
                  if (l === 'en' || l === 'ja') {
                    document.documentElement.lang = l;
                  } else {
                    document.documentElement.lang = 'zh-CN';
                  }
                  var t = localStorage.getItem('metronome-theme');
                  if (t === 'light' || t === 'dark') {
                    document.documentElement.setAttribute('data-theme', t);
                  }
                  var s = localStorage.getItem('metronome-skin');
                  if (s) {
                    document.documentElement.setAttribute('data-skin', s);
                  }
                  var v = localStorage.getItem('metronome-skin-vars');
                  if (v) {
                    var vars = JSON.parse(v);
                    var style = document.documentElement.style;
                    for (var k in vars) {
                      if (vars.hasOwnProperty(k)) style.setProperty(k, vars[k]);
                    }
                  }
                  var fu = localStorage.getItem('metronome-skin-fonts-url');
                  if (fu) {
                    var link = document.createElement('link');
                    link.id = 'skin-google-fonts';
                    link.rel = 'stylesheet';
                    link.href = fu;
                    document.head.appendChild(link);
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${bebasNeue.variable} ${jetBrainsMono.variable} ${dmSans.variable} antialiased`}
        suppressHydrationWarning
      >
        {/* Restore skin font overrides on <body> inline style to beat Next.js class specificity */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var v = localStorage.getItem('metronome-skin-vars');
                  if (!v) return;
                  var vars = JSON.parse(v);
                  var fk = ['--font-display','--font-mono','--font-body'];
                  var s = document.body.style;
                  for (var i = 0; i < fk.length; i++) {
                    if (vars[fk[i]]) s.setProperty(fk[i], vars[fk[i]]);
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
        {children}
      </body>
    </html>
  );
}
