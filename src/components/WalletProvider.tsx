"use client"

import {
    ConnectionProvider,
    WalletProvider as SolanaWalletProvider,
} from "@solana/wallet-adapter-react";
import { UnifiedWalletProvider } from "@jup-ag/wallet-adapter";
import { ReactNode } from "react";

const endpoint = process.env.NEXT_PUBLIC_RPC!;

export function WalletProvider({ children }: { children: ReactNode }) {
    return (
        <ConnectionProvider endpoint={endpoint}>
            <SolanaWalletProvider wallets={[]} autoConnect>
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
                    {children}
                </UnifiedWalletProvider>
            </SolanaWalletProvider>
        </ConnectionProvider>
    );
}

