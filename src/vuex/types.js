const mutations = {
  // root
  CLEAR_STATE: 'CLEAR_STATE',
  POP_STATE: 'POP_STATE',
  CLEAR_WALLET_AND_ACCOUNT: 'CLEAR_WALLET_AND_ACCOUNT',

  // account
  SET_ACCOUNT: 'SET_ACCOUNT',
  SET_ACCOUNT_BALANCES_DETAILS: 'SET_ACCOUNT_BALANCES_DETAILS',

  // wallet
  SET_WALLET: 'SET_WALLET',
  SET_ENCRYPTED_SECRET_SEED: 'SET_ENCRYPTED_SECRET_SEED',

  // factors
  SET_FACTORS: 'SET_FACTORS',

  // kyc
  SET_KYC_REQUEST: 'SET_KYC_REQUEST',
  SET_KYC_BLOB: 'SET_KYC_BLOB',
  SET_KYC_REQUEST_BLOB: 'SET_KYC_REQUEST_BLOB',

  // kyc recovery
  SET_KYC_RECOVERY_REQUEST: 'SET_KYC_RECOVERY_REQUEST',
  SET_KYC_RECOVERY_REQUEST_BLOB: 'SET_KYC_RECOVERY_REQUEST_BLOB',

  // idle
  UPDATE_LOGOUT_AT: 'UPDATE_LOGOUT_AT',

  // identities
  SET_IDENTITIES: 'SET_IDENTITIES',
}

const actions = {
  // root
  LOG_OUT: 'LOG_OUT',
  LOG_IN: 'LOG_IN',
  RESTORE_SESSION: 'RESTORE_SESSION',

  // account
  LOAD_ACCOUNT: 'LOAD_ACCOUNT',
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
  LOAD_KYC_REQUEST: 'LOAD_KYC_REQUEST',
  LOAD_KYC_REQUEST_BLOB: 'LOAD_KYC_REQUEST_BLOB',
  LOAD_KYC_BLOB: 'LOAD_KYC_BLOB',

  // kyc recovery
  LOAD_KYC_RECOVERY: 'LOAD_KYC_RECOVERY',
  LOAD_KYC_RECOVERY_REQUEST: 'LOAD_KYC_RECOVERY_REQUEST',
  LOAD_KYC_RECOVERY_REQUEST_BLOB: 'LOAD_KYC_RECOVERY_REQUEST_BLOB',

  // idle
  START_IDLE: 'START_IDLE',
  LOGOUT_IDLE: 'LOGOUT_IDLE',
  INIT_IDLE_TICKER: 'INIT_IDLE_TICKER',
  KEEP_SESSION: 'KEEP_SESSION',
  LOGOUT_SESSION: 'LOGOUT_SESSION',

  // identities
  LOAD_IDENTITIES_BY_ACCOUNT_ID: 'LOAD_IDENTITIES_BY_ACCOUNT_ID',
}

const getters = {
  // root
  isLoggedIn: 'isLoggedIn',

  // account
  account: 'account',
  accountId: 'accountId',
  accountRoleId: 'accountRoleId',
  accountDepositAddresses: 'accountDepositAddresses',
  accountKycBlob: 'accountKycBlob',
  accountKycRecoveryStatus: 'accountKycRecoveryStatus',
  isAccountKycRecoveryInProgress: 'isAccountKycRecoveryInProgress',
  isAccountKycRecoveryInitiated: 'isAccountKycRecoveryInitiated',

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
  kyc: 'kyc',
  kycRequest: 'kycRequest',

  // kyc recovery
  kycRecoveryRequest: 'kycRecoveryRequest',

  // idle-handler
  logoutAt: 'logoutAt',

  // identitys
  usersIdentities: 'usersIdentities',
  emailByAccountId: 'emailByAccountId',
  phoneNumberByAccountId: 'phoneNumberByAccountId',
  telegramUsernameByAccountId: 'telegramUsernameByAccountId',
}

export const vuexTypes = {
  ...mutations,
  ...actions,
  ...getters,
}
