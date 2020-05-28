const mutations = {
  // root
  CLEAR_STATE: 'CLEAR_STATE',
  POP_STATE: 'POP_STATE',
  CLEAR_WALLET_AND_ACCOUNT: 'CLEAR_WALLET_AND_ACCOUNT',

  // key-value
  SET_KV_ENTRY_GENERAL_ROLE_ID: 'SET_KV_ENTRY_GENERAL_ROLE_ID',
  SET_KV_ENTRY_CORPORATE_ROLE_ID: 'SET_KV_ENTRY_CORPORATE_ROLE_ID',
  SET_KV_ENTRY_UNVERIFIED_ROLE_ID: 'SET_KV_ENTRY_UNVERIFIED_ROLE_ID',
  SET_KV_ENTRY_BLOCKED_ROLE_ID: 'SET_KV_ENTRY_BLOCKED_ROLE_ID',
  SET_KV_ENTRY_US_VERIFIED_ROLE_ID: 'SET_KV_ENTRY_US_VERIFIED_ROLE_ID',
  SET_KV_ENTRY_US_ACCREDITED_ROLE_ID: 'SET_KV_ENTRY_US_ACCREDITED_ROLE_ID',
  SET_KV_ASSET_TYPE_DEFAULT: 'SET_KV_ASSET_TYPE_DEFAULT',
  SET_KV_ASSET_TYPE_KYC_REQUIRED: 'SET_KV_ASSET_TYPE_KYC_REQUIRED',
  SET_KV_ASSET_TYPE_SECURITY: 'SET_KV_ASSET_TYPE_SECURITY',
  SET_KV_POLL_TYPE_RESTRICTED: 'SET_KV_POLL_TYPE_RESTRICTED',
  SET_KV_POLL_TYPE_UNRESTRICTED: 'SET_KV_POLL_TYPE_UNRESTRICTED',

  SET_DEFAULT_QUOTE_ASSET: 'SET_DEFAULT_QUOTE_ASSET',
  SET_KV_DEFAULT_SIGNER_ROLE_ID: 'SET_KV_DEFAULT_SIGNER_ROLE_ID',

  // account
  SET_ACCOUNT: 'SET_ACCOUNT',
  SET_ACCOUNT_BALANCES_DETAILS: 'SET_ACCOUNT_BALANCES_DETAILS',

  // wallet
  SET_WALLET: 'SET_WALLET',
  SET_ENCRYPTED_SECRET_SEED: 'SET_ENCRYPTED_SECRET_SEED',

  // factors
  SET_FACTORS: 'SET_FACTORS',

  // kyc
  SET_KYC_LATEST_REQUEST: 'SET_KYC_LATEST_REQUEST',
  SET_KYC_RELATED_REQUEST: 'SET_KYC_RELATED_REQUEST',
  SET_KYC_LATEST_DATA: 'SET_KYC_LATEST_DATA',
  SET_ACCOUNT_ROLE_RESETED: 'SET_ACCOUNT_ROLE_RESETED',
  SET_KYC_LATEST_REQUEST_DATA: 'SET_KYC_LATEST_REQUEST_DATA',

  // assets
  SET_ASSETS: 'SET_ASSETS',
  UPDATE_ASSETS: 'UPDATE_ASSETS',

  // idle
  UPDATE_LOGOUT_AT: 'UPDATE_LOGOUT_AT',

  // identities
  SET_IDENTITIES: 'SET_IDENTITIES',

  // movements-history
  SET_MOVEMENTS: 'SET_MOVEMENTS',
  CONCAT_MOVEMENTS: 'CONCAT_MOVEMENTS',

  // sponsorship-requests
  SET_SPONSORSHIP_REQUESTS: 'SET_SPONSORSHIP_REQUESTS',
  CONCAT_SPONSORSHIP_REQUESTS: 'CONCAT_SPONSORSHIP_REQUESTS',

  // businesses
  SET_MY_BUSINESSES: 'SET_MY_BUSINESSES',
  SET_ALL_BUSINESSES: 'SET_ALL_BUSINESSES',
  CONCAT_ALL_BUSINESSES: 'CONCAT_ALL_BUSINESSES',
  SELECT_BUSINESS_TO_BROWSE: 'SELECT_BUSINESS_TO_BROWSE',
  CLEAR_BUSINESS_TO_BROWSE: 'CLEAR_BUSINESS_TO_BROWSE',
}

const actions = {
  // root
  LOG_OUT: 'LOG_OUT',
  LOG_IN: 'LOG_IN',
  RESTORE_SESSION: 'RESTORE_SESSION',

  // key-value
  LOAD_KV_ENTRIES: 'LOAD_KV_ENTRIES',
  LOAD_KV_ENTRIES_ACCOUNT_ROLE_IDS: 'LOAD_KV_ENTRIES_ACCOUNT_ROLE_IDS',

  // account
  LOAD_ACCOUNT: 'LOAD_ACCOUNT',
  LOAD_ACCOUNT_BALANCES_DETAILS: 'LOAD_ACCOUNT_BALANCES_DETAILS',
  INIT_ACCOUNT: 'INIT_ACCOUNT',

  // wallet
  LOAD_WALLET: 'LOAD_WALLET',
  STORE_WALLET: 'STORE_WALLET',
  DECRYPT_SECRET_SEED: 'DECRYPT_SECRET_SEED',
  GET_SESSION: 'GET_SESSION',
  PROLONGATE_SESSION: 'PROLONGATE_SESSION',

  // factors
  LOAD_FACTORS: 'LOAD_FACTORS',

  // kyc
  LOAD_KYC: 'LOAD_KYC',
  LOAD_KYC_LATEST_REQUEST: 'LOAD_KYC_LATEST_REQUEST',
  LOAD_KYC_LATEST_REQUEST_DATA: 'LOAD_KYC_LATEST_REQUEST_DATA',
  LOAD_KYC_RELATED_REQUEST: 'LOAD_KYC_RELATED_REQUEST',
  LOAD_KYC_LATEST_DATA: 'LOAD_KYC_LATEST_DATA',

  // kyc recovery
  SEND_KYC_RECOVERY_REQUEST: 'SEND_KYC_RECOVERY_REQUEST',

  // assets
  LOAD_ASSETS: 'LOAD_ASSETS',

  // idle
  START_IDLE: 'START_IDLE',
  LOGOUT_IDLE: 'LOGOUT_IDLE',
  INIT_IDLE_TICKER: 'INIT_IDLE_TICKER',
  KEEP_SESSION: 'KEEP_SESSION',
  LOGOUT_SESSION: 'LOGOUT_SESSION',

  // identities
  LOAD_IDENTITIES_BY_ACCOUNT_ID: 'LOAD_IDENTITIES_BY_ACCOUNT_ID',

  // movements-history
  LOAD_MOVEMENTS: 'LOAD_MOVEMENTS',
  LOAD_SHARE_MOVEMENTS: 'LOAD_SHARE_MOVEMENTS',

  // sponsorship-requests
  LOAD_SPONSORSHIP_REQUESTS: 'LOAD_SPONSORSHIP_REQUESTS',
  APPROVE_OR_REJECT_SPONSORSHIP_REQUEST: 'APPROVE_OR_REJECT_SPONSORSHIP_REQUEST',

  // businesses
  LOAD_MY_BUSINESSES: 'LOAD_MY_BUSINESSES',
  LOAD_ALL_BUSINESSES: 'LOAD_ALL_BUSINESSES',
  LOAD_BUSINESS: 'LOAD_BUSINESS',
}

const getters = {
  // root
  isLoggedIn: 'isLoggedIn',

  // key-values
  kvEntryGeneralRoleId: 'kvEntryGeneralRoleId',
  kvEntryCorporateRoleId: 'kvEntryCorporateRoleId',
  kvEntryUnverifiedRoleId: 'kvEntryUnverifiedRoleId',
  kvEntryBlockedRoleId: 'kvEntryBlockedRoleId',
  kvEntryUsVerifiedRoleId: 'kvEntryUsVerifiedRoleId',
  kvEntryUsAccreditedRoleId: 'kvEntryUsAccreditedRoleId',
  kvAssetTypeDefault: 'kvAssetTypeDefault',
  kvAssetTypeKycRequired: 'kvAssetTypeKycRequired',
  kvAssetTypeSecurity: 'kvAssetTypeSecurity',
  kvPollTypeRestricted: 'kvPollTypeRestricted',
  kvPollTypeUnrestricted: 'kvPollTypeUnrestricted',
  kvDefaultSignerRoleId: 'kvDefaultSignerRoleId',

  // account
  account: 'account',
  accountId: 'accountId',
  accountBalances: 'accountBalances',
  accountBalancesByOwner: 'accountBalancesByOwner',
  accountOwnedAssetsBalances: 'accountOwnedAssetsBalances',
  accountBalanceByCode: 'accountBalanceByCode',
  accountRoleId: 'accountRoleId',
  accountDepositAddresses: 'accountDepositAddresses',
  accountKycBlob: 'accountKycBlob',

  isAccountGeneral: 'isAccountGeneral',
  isAccountCorporate: 'isAccountCorporate',
  isAccountUsAccredited: 'isAccountUsAccredited',
  isAccountUsVerified: 'isAccountUsVerified',
  isAccountUnverified: 'isAccountUnverified',
  isAccountBlocked: 'isAccountBlocked',

  // wallet
  walletId: 'walletId',
  walletAccountId: 'walletAccountId',
  walletEmail: 'walletEmail',
  sessionId: 'sessionId',
  encryptedSecretSeed: 'encryptedSecretSeed',
  walletPublicKey: 'walletPublicKey',

  // factors
  factors: 'factors',
  factorsTotp: 'factorsTotp',
  factorsPassword: 'factorsPassword',
  factorsEmail: 'factorsEmail',
  factorsTotpEnabled: 'factorsTotpEnabled',
  isTotpEnabled: 'isTotpEnabled',

  factorsPhoneEnabled: 'factorsPhoneEnabled',
  isPhoneEnabled: 'isPhoneEnabled',
  factorsPhone: 'factorsPhone',
  factorsTelegramEnabled: 'factorsTelegramEnabled',
  isTelegramEnabled: 'isTelegramEnabled',
  factorsTelegram: 'factorsTelegram',

  // kyc
  kycState: 'kycState',
  kycStateI: 'kycStateI',
  kycRequestId: 'kycRequestId',
  kycRequestRejectReason: 'kycRequestRejectReason',
  kycRequestResetReason: 'kycRequestResetReason',
  kycRequestExternalDetails: 'kycRequestExternalDetails',
  kycRequestBlockReason: 'kycRequestBlockReason',
  kycAccountRoleToSet: 'kycAccountRoleToSet',
  kycPreviousRequestAccountRoleToSet: 'kycPreviousRequestAccountRoleToSet',
  kycLatestData: 'kycLatestData',
  kycLatestRequestBlobId: 'kycLatestRequestBlobId',
  kycLatestRequestData: 'kycLatestRequestData',
  kycAvatarKey: 'kycAvatarKey',
  isAccountRoleReseted: 'isAccountRoleReseted',
  isAccountAndRequestBlobIdentical: 'isAccountAndRequestBlobIdentical',

  // kyc recovery
  accountKycRecoveryStatus: 'accountKycRecoveryStatus',
  isKycRecoveryInProgress: 'isKycRecoveryInProgress',

  // assets
  assets: 'assets',
  assetByCode: 'assetByCode',
  assetsByOwner: 'assetsByOwner',
  balancesAssets: 'balancesAssets',
  balancesAssetsByOwner: 'balancesAssetsByOwner',
  balancesBaseAssets: 'balancesBaseAssets',
  depositableAssets: 'depositableAssets',
  coinpaymentsAssets: 'coinpaymentsAssets',
  transferableAssetsBalancesByOwner: 'transferableAssetsBalancesByOwner',
  transferableAssetsBalances: 'transferableAssetsBalances',
  withdrawableBalancesAssets: 'withdrawableBalancesAssets',
  statsQuoteAsset: 'statsQuoteAsset',
  ownedAssets: 'ownedAssets',
  ownedBalancesAssets: 'ownedBalancesAssets',
  baseAtomicSwapBalancesAssets: 'baseAtomicSwapBalancesAssets',
  quoteAtomicSwapAssets: 'quoteAtomicSwapAssets',
  baseAssets: 'baseAssets',
  activeOwnedAssets: 'activeOwnedAssets',

  // idle-handler
  logoutAt: 'logoutAt',

  // identitys
  usersIdentities: 'usersIdentities',
  emailByAccountId: 'emailByAccountId',
  phoneNumberByAccountId: 'phoneNumberByAccountId',
  telegramUsernameByAccountId: 'telegramUsernameByAccountId',

  // movements-history
  movements: 'movements',

  // sponsorship-requests
  sponsorshipRequests: 'sponsorshipRequests',

  // businesses
  myBusinesses: 'myBusinesses',
  allBusinesses: 'allBusinesses',
  businessToBrowse: 'businessToBrowse',
  isBusinessToBrowse: 'isBusinessToBrowse',
  businessStatsQuoteAsset: 'businessStatsQuoteAsset',
  isMyBusiness: 'isMyBusiness',
}

export const vuexTypes = {
  ...mutations,
  ...actions,
  ...getters,
}
