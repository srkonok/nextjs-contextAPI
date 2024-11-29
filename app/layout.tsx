import ProviderWrapper from '../components/AuthProvider';
import '../styles/globals.css';

export const metadata = {
  title: 'Auth Example',
  description: 'Authentication example with Next.js App Router and TypeScript',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ProviderWrapper>{children}</ProviderWrapper>
      </body>
    </html>
  );
}
