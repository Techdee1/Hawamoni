import { 
  createQR, 
  encodeURL, 
  TransactionRequestURL,
  TransferRequestURL,
  parseURL
} from '@solana/pay'
import { PublicKey } from '@solana/web3.js'
import BigNumber from 'bignumber.js'
import { 
  SolanaPayRequest, 
  SolanaPayURL, 
  PaymentRequestData,
  PaymentRequestResponse 
} from '@/types/solana'

class SolanaPayService {
  private static readonly BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  private static readonly TIMEOUT_MINUTES = parseInt(process.env.NEXT_PUBLIC_PAYMENT_TIMEOUT_MINUTES || '30')

  /**
   * Generate Solana Pay URL and QR code
   */
  async generatePaymentRequest(request: SolanaPayRequest): Promise<SolanaPayURL> {
    try {
      // Generate reference keys for tracking
      const reference = request.reference || [new PublicKey(PublicKey.unique().toString())]
      
      // Create Solana Pay URL
      const url = encodeURL({
        recipient: new PublicKey(request.recipient),
        amount: request.amount,
        splToken: request.splToken,
        reference,
        label: request.label,
        message: request.message,
        memo: request.memo
      })

      // Generate QR code
      const qr = createQR(url, 400, 'transparent')
      const qrBlob = await qr.getRawData('png')
      
      if (!qrBlob) {
        throw new Error('Failed to generate QR code')
      }

      // Convert blob to base64
      const qrCode = await this.blobToBase64(qrBlob)

      return {
        url: url.toString(),
        qrCode,
        reference
      }
    } catch (error) {
      console.error('Error generating payment request:', error)
      throw new Error(`Failed to generate payment request: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Create payment request for campus bill splitting
   */
  async createSplitBillPayment(splitBillRequest: any): Promise<SolanaPayURL> {
    const { totalAmount, participants, description, createdBy } = splitBillRequest
    const amountPerPerson = totalAmount / participants.length
    
    const request: SolanaPayRequest = {
      recipient: createdBy,
      amount: new BigNumber(amountPerPerson),
      label: 'Hawamoni - Split Bill',
      message: `Split payment: ${description}`,
      memo: `Split ${totalAmount} USDC among ${participants.length} people`
    }

    return this.generatePaymentRequest(request)
  }

  /**
   * Create payment request for group dues
   */
  async createGroupDuesPayment(groupDuesRequest: any): Promise<SolanaPayURL> {
    const { amount, description, collectedBy, groupName } = groupDuesRequest
    
    const request: SolanaPayRequest = {
      recipient: collectedBy,
      amount: new BigNumber(amount),
      label: `${groupName || 'Group'} - Dues Payment`,
      message: `Group dues: ${description}`,
      memo: `Dues payment for ${groupName || 'group'}`
    }

    return this.generatePaymentRequest(request)
  }

  /**
   * Create reimbursement payment request
   */
  async createReimbursementPayment(
    amount: number,
    toWallet: string,
    description: string,
    groupName?: string
  ): Promise<SolanaPayURL> {
    const request: SolanaPayRequest = {
      recipient: toWallet,
      amount: new BigNumber(amount),
      label: `${groupName || 'Group'} - Reimbursement`,
      message: `Reimbursement: ${description}`,
      memo: `Reimbursement from ${groupName || 'group'}`
    }

    return this.generatePaymentRequest(request)
  }

  /**
   * Parse Solana Pay URL
   */
  static parsePaymentURL(url: string): TransactionRequestURL | TransferRequestURL | null {
    try {
      return parseURL(url)
    } catch (error) {
      console.error('Error parsing payment URL:', error)
      return null
    }
  }

  /**
   * Validate Solana Pay URL
   */
  static isValidPaymentURL(url: string): boolean {
    try {
      const parsed = parseURL(url)
      return 'recipient' in parsed && parsed.recipient !== undefined
    } catch {
      return false
    }
  }

  /**
   * Generate shareable payment link
   */
  static generateShareableLink(paymentUrl: string, title?: string): string {
    const encodedUrl = encodeURIComponent(paymentUrl)
    const encodedTitle = encodeURIComponent(title || 'Solana Payment Request')
    
    return `${this.BASE_URL}/payment/share?url=${encodedUrl}&title=${encodedTitle}`
  }

  /**
   * Create transaction request URL for complex payments
   */
  static createTransactionRequest(
    endpoint: string,
    reference: PublicKey[],
    label?: string,
    message?: string
  ): string {
    const url = new URL(endpoint, this.BASE_URL)
    
    // Add reference parameters
    reference.forEach((ref, index) => {
      url.searchParams.append('reference', ref.toString())
    })
    
    if (label) url.searchParams.append('label', label)
    if (message) url.searchParams.append('message', message)
    
    return url.toString()
  }

  /**
   * Generate QR code from any URL
   */
  async generateQRCode(url: string, size: number = 400): Promise<string> {
    try {
      const qr = createQR(url, size, 'transparent')
      const qrBlob = await qr.getRawData('png')
      
      if (!qrBlob) {
        throw new Error('Failed to generate QR code')
      }

      return await this.blobToBase64(qrBlob)
    } catch (error) {
      console.error('Error generating QR code:', error)
      throw new Error('Failed to generate QR code')
    }
  }

  /**
   * Helper: Convert blob to base64
   */
  blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        const result = reader.result as string
        resolve(result)
      }
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  }

  /**
   * Get payment expiry time
   */
  static getExpiryTime(): Date {
    const now = new Date()
    return new Date(now.getTime() + (this.TIMEOUT_MINUTES * 60 * 1000))
  }

  /**
   * Check if payment request is expired
   */
  static isExpired(expiryTime: Date): boolean {
    return new Date() > expiryTime
  }
}

// Export a singleton instance
export const solanaPayService = new SolanaPayService()