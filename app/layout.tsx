import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'UCXO — Business execution, coordinated.', description: 'Turn business objectives into coordinated action. Plan workflows, connect people and Engine Agents, and keep execution accountable.' };
export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {return <html lang="en"><body>{children}</body></html>}
