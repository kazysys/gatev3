// pages/_app.tsx
import '../styles/styles.css'; // Importa o CSS global do Tailwind

export default function MyApp({ Component, pageProps }) {
    return <Component {...pageProps} />;
}
