"use client"

import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
    ConnectionProvider,
    WalletProvider as SolanaWalletProvider,
} from "@solana/wallet-adapter-react";
import { UnifiedWalletProvider } from "@jup-ag/wallet-adapter";
import { clusterApiUrl } from "@solana/web3.js";
import { ReactNode } from "react";

const network = WalletAdapterNetwork.Mainnet;
const endpoint = "https://api.mainnet-beta.solana.com";

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

