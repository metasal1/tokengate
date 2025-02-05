"use client"

import { useState, useEffect } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { Connection, PublicKey } from "@solana/web3.js"
import { UnifiedWalletButton } from "@jup-ag/wallet-adapter"
import { getAccount, getAssociatedTokenAddress, getMint } from "@solana/spl-token"

const REQUIRED_BALANCE = Number(process.env.NEXT_PUBLIC_REQUIRED_BALANCE!)
const RPC_ENDPOINT = process.env.NEXT_PUBLIC_RPC!;
const JUPITER_SWAP_URL = "https://jup.ag/swap/SOL-ErbakSHZWeLnq1hsqFvNz8FvxSzggrfyNGB6TEGSSgNE?referrer=2KWULBeCsChsZ3VwtQf4tYhVTaeG64PN8UFpWaEfST8u&feeBps=100"

export default function TokenGate() {
  const { publicKey, disconnect } = useWallet()
  const [isAllowed, setIsAllowed] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [tokenBalance, setTokenBalance] = useState<number | null>(null)
  const MINT = new PublicKey(process.env.NEXT_PUBLIC_MINT!)

  // Reset states when wallet changes
  useEffect(() => {
    setIsAllowed(null)
    setTokenBalance(null)

    // If publicKey changes to null (disconnected), no need to call disconnect
    if (!publicKey) return

    // Get the previous public key from localStorage
    const prevPublicKey = localStorage.getItem('walletPublicKey')

    // If there was a previous wallet and it's different from the current one
    if (prevPublicKey && prevPublicKey !== publicKey.toString()) {
      disconnect()
    }

    // Store the current public key
    localStorage.setItem('walletPublicKey', publicKey.toString())
  }, [publicKey, disconnect])

  const checkBalance = async () => {
    if (!publicKey) return
    setIsLoading(true)

    try {
      const connection = new Connection(RPC_ENDPOINT)

      // Get mint info to fetch decimals
      const mintInfo = await getMint(connection, MINT)

      // Get the associated token account
      const tokenAccount = await getAssociatedTokenAddress(MINT, publicKey)

      try {
        const accountInfo = await getAccount(connection, tokenAccount)
        // Use mint decimals for correct balance calculation
        const balance = Number(accountInfo.amount) / Math.pow(10, mintInfo.decimals)
        setTokenBalance(balance)
        setIsAllowed(balance >= REQUIRED_BALANCE)
      } catch (error) {
        console.error("Error fetching token account:", error)
        setTokenBalance(0)
        setIsAllowed(false)
      }
    } catch (error) {
      console.error("Error checking balance:", error)
      setTokenBalance(null)
      setIsAllowed(false)
    } finally {
      setIsLoading(false)
    }
  }

  const getRemainingTokensNeeded = () => {
    if (tokenBalance === null) return 0;
    const remaining = REQUIRED_BALANCE - tokenBalance;
    return remaining > 0 ? remaining : 0;
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <UnifiedWalletButton />
      <p className="text-lg font-medium">
        Required Balance: {REQUIRED_BALANCE.toLocaleString()} SOL
      </p>
      {publicKey && (
        <>
          <p className="text-lg">Connected: {publicKey.toString()}</p>
          <button
            onClick={checkBalance}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
          >
            {isLoading ? "Checking..." : "Check Access"}
          </button>
          {tokenBalance !== null && (
            <div className="space-y-2 text-center">
              <p className="text-lg">
                Token Balance: {tokenBalance.toLocaleString()} tokens
              </p>
              {getRemainingTokensNeeded() > 0 && (
                <div className="space-y-2">
                  <p className="text-yellow-600">
                    You need {getRemainingTokensNeeded()?.toLocaleString()} more tokens for access
                  </p>
                  <a
                    href={JUPITER_SWAP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                  >
                    Buy Tokens on Jupiter
                  </a>
                </div>
              )}
            </div>
          )}
          {isAllowed !== null && (
            <div className={`text-xl font-bold ${isAllowed ? "text-green-500" : "text-red-500"}`}>
              {isAllowed ? "Access Granted! The code word is 708060" : "Access Denied"}
            </div>
          )}
        </>
      )}
    </div>
  )
}

