export const ClaimStatus = {
  VERIFYING: 'VERIFYING',
  VERIFIED_PENDING_REVIEW: 'VERIFIED_PENDING_REVIEW',
  REJECTED: 'REJECTED',
  APPROVED_PENDING_MULTISIG: 'APPROVED_PENDING_MULTISIG',
  PAID: 'PAID',
  FAILED: 'FAILED'
} as const

export type ClaimStatus = (typeof ClaimStatus)[keyof typeof ClaimStatus]
