"use client"

import { UnifiedWalletButton, UnifiedWalletProvider } from "@jup-ag/wallet-adapter";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <UnifiedWalletProvider
        wallets={[]}
        config={{
          autoConnect: false,
          env: 'mainnet-beta',
          metadata: {
            name: 'UnifiedWallet',
            description: 'UnifiedWallet',
            url: 'https://jup.ag',
            iconUrls: ['https://jup.ag/favicon.ico'],
          },
          // notificationCallback: WalletNotification,
          walletlistExplanation: {
            href: 'https://station.jup.ag/docs/additional-topics/wallet-list',
          },
        }}
      >
        <UnifiedWalletButton />
      </UnifiedWalletProvider>
    </div>
  );
}
