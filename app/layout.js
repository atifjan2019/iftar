import { Inter, Amiri } from 'next/font/google';
import './globals.css';

const inter = Inter({
    subsets: ['latin'],
    weight: ['300', '400', '500', '600', '700'],
    variable: '--font-inter',
});

const amiri = Amiri({
    subsets: ['arabic'],
    weight: ['400', '700'],
    variable: '--font-amiri',
});

export const metadata = {
    title: 'Oldham Brothers Iftar Gathering | Tuesday 10th March',
    description:
        'Join us for a free Iftar gathering for brothers in Oldham. Tuesday 10th March from 5:00 PM at Bittersweet, Old Town Hall. Register now!',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" dir="ltr">
            <body className={`${inter.variable} ${amiri.variable}`} suppressHydrationWarning>{children}</body>
        </html>
    );
}
