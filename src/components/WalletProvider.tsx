"use client"

import { UnifiedWalletProvider, UnifiedWalletButton } from "@jup-ag/wallet-adapter";
export const WalletProvider = () => {
    return (
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
    );
};

