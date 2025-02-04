"use client"

import { useState } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { Connection } from "@solana/web3.js"
import { TOKEN_PROGRAM_ID } from "@solana/spl-token"
import { UnifiedWalletButton } from "@jup-ag/wallet-adapter"

const REQUIRED_BALANCE = 10000
const RPC_ENDPOINT = "https://api.mainnet-beta.solana.com"

export default function TokenGate() {
  const { publicKey } = useWallet()
  const [isAllowed, setIsAllowed] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const checkBalance = async () => {
    if (!publicKey) return

    setIsLoading(true)

    try {
      const connection = new Connection(RPC_ENDPOINT)

      const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
        programId: TOKEN_PROGRAM_ID,
      })

      let totalBalance = 0

      tokenAccounts.value.forEach((accountInfo) => {
        const parsedInfo = accountInfo.account.data.parsed.info
        if (parsedInfo.tokenAmount.amount >= 0) {
          totalBalance += Number.parseInt(parsedInfo.tokenAmount.amount)
        }
      })

      setIsAllowed(totalBalance >= REQUIRED_BALANCE)
    } catch (error) {
      console.error("Error checking balance:", error)
      setIsAllowed(false)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {/* <WalletMultiButton /> */}
      <UnifiedWalletButton />
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
          {isAllowed !== null && (
            <div className={`text-xl font-bold ${isAllowed ? "text-green-500" : "text-red-500"}`}>
              {isAllowed ? "Access Granted!" : "Access Denied"}
            </div>
          )}
        </>
      )}
    </div>
  )
}

