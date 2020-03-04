# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Please check our [developers guide](https://gitlab.com/tokend/developers-guide)
for further information about branching and tagging conventions.

## [Unreleased]
#### Added
- Polls
- Vote button to poll's card
- Error message when input amount is less than min amount
- Opportunity specify empty card number while creating marketplace offer

#### Changed
- Poll's card end date format

#### Fixed
- A bug with filter for `paymentMethodType` on pay page
- Hidden 'Polls' 
- A bug with typo on Successful payment page
- A bug when the email field is not filled after going from the page 
  Successful payment page
- A bug when Russian is not set in Safari by default if you use Russian 
  in system and use the application for the first time
- A bug when you enter a nonexistent promotional code the price becomes 0
- A bug when user has access to inaccessible routes
- Trailing digits in amount input field

## [1.7.0-rc.0] - 2020-01-24
#### Added
- Filter for `paymentMethodType` on pay page
- Update Promo Code form
- Update offer form

#### Changed
- KYC recovery without filling out a form

## [1.6.2] - 2020-03-04
#### Fixed
- A bug with removed asset on customer page

## [1.6.1] - 2020-01-30
### Changed

* Increased promo code length to 36 symbols

## [1.6.0] - 2019-12-25
#### Fixed
- A bug with displaying atomic swap details

## [1.6.0-rc.3] - 2019-12-25
#### Fixed
- A bug with displaying a card with long name

## [1.6.0-rc.2] - 2019-12-25
#### Fixed
- A bug when after successful registration shows an error

## [1.6.0-rc.1] - 2019-12-23
#### Changed
- Payment to non-existing accounts

### "Under the hood" changes
#### Changed
- Now using @tokend/js-sdk@1.12.1

## [1.6.0-rc.0] - 2019-12-18
#### Added
- Mass send allow to send to more than 100 users
- Mass send allow to send a few assets
- Registration by invitation link

#### Fixed
- A bug when own company show on sponsorflow
- A bug with color scheme

#### Changed
- Refactoring refund and buyback asset

### "Under the hood" changes
#### Changed
- Now using @tokend/js-sdk@1.11.3

## [1.5.0] - 2019-12-18

## [1.5.0-rc.2] - 2019-11-28
#### Fixed
- A bug when duplicate two asset name in payment methods select

## [1.5.0-rc.1] - 2019-11-28
#### Added
- Refund and Buyback asset
- Allow to buy for asset inside TokenD
- `SUPPORT_EMAIL` and `SUPPORT_PHONE` in config

#### Fixed
- A bug with typo on Shop button
- A bug with disabled filters fields on Customers page
- A bug when you can send payment more than once to customer on mass payment form

#### Changed
- Default redirect route for customer account

## [1.5.0-rc.0] - 2019-11-23
#### Added
- Customer ui for business account
- `CardList` component

#### Fixed
- A bug with infinite loader at verification user email

## [1.4.2] - 2019-11-22

#### Fixed
- Localization

## [1.4.1] - 2019-11-22

#### Fixed
- Localization

#### Removed
- asset creation request from `create-asset-form-simplified-module`
- `create-asset-request` record
- `skeleton-loader-step-form`
- `EmptyListPlaceholder`
- `EmptyTbodyPlaceholder`
- `SkeletonLoaderTableBody`
- `movements-empty-list-placeholder`
- `movements-skeleton-loader`

#### Changed
- Data mapping scheme
- Company link on `Security` page

## [1.4.0] - 2019-11-20

## [1.4.0-rc.3] - 2019-11-18
#### Added
- Google market img to `SuccessfulPayment` page
- `Added` field on Customers page

#### Changed
- Used `APP_NAME` on `SuccessfulPayment` page

#### Fixed
- A bug with sort on Customers page
- A bug with displaying `Kyc recovery` page on mobile phone
- A bug with trim filter search
- Localization

### "Under the hood" changes
#### Changed
- Now using @tokend/js-sdk@1.11.2

## [1.4.0-rc.2] - 2019-11-14
#### Fixed
- A bub with clients export

## [1.4.0-rc.1] - 2019-11-14
#### Added
- Clients export

#### Changed
- int ids to string in `r` routing

## [1.4.0-rc.0] - 2019-11-12
#### Added
- `ErrorMessage` component
- Statistics
- Expiration date for assets
- `Failed` and `Successful` payment pages
- Filters on Customers page

#### Fixed
- Issue when sponsorship didn't work

## [1.3.1] - 2019-11-11
#### Changed
- Router names from 'company' to 'business'

## [1.3.0] - 2019-11-08
#### Fixed
- Card design(added min-height to car titles)
- A bug when business disappears after change language

## [1.3.0-rc.1] - 2019-11-06
#### Added
- Trim for input field 
- Redeem default amount
- Current company page
- New component 'Card' for displaying all card
- Skeleton loader for new component 'Card'
- Global class for markdown `app__markdown`

#### Removed
- `card-viewer`
- `asset-skeleton-loade`
- `current-business-logo`
- `current-business-indicator/index.vue`
- `BusinessCardSkeleton`
- `BusinessViewer`
- `PromoCodeCardSkeleton`

#### Changed
- Moved logo and favicon to branding folder
- Display full price
- Max percent discount
- Validation on promo code form
- Get data from store on Business pages

#### Fixed
- A bug with trim in input fields with type 'password'
- A bug with typo in multi select
- A bug with color scheme
- A bug when don't show error message if response failed

### "Under the hood" changes
#### Added
- `APP_NAME` in config

## [1.3.0-rc.0] - 2019-10-31
### "Under the hood" changes
#### Changed
- Now using @tokend/js-sdk@1.11.1

## [1.2.0] - 2019-10-31
#### Fixed
- A bug with skeleton loader on Shop page
- A bug when don't show error message if response failed

## [1.2.0-rc.0] - 2019-10-21
#### Added
- A clipper field
- A banner for corporate user
- Filter balances for customers
- Promo codes
- Company link

#### Changed
- Used clipper field for avatar and banner
- Used banner in business page

#### Changed
- Color scheme improvements

#### Fixed
- A bug when drop down go out of page boundaries
- A bug with incorrect error message after enterring recipient email on transfer form
- A bug when the user can not enter a value in input-field with type 'number' on Firefox

#### Changed
- Renamed business to companies

## [1.1.0] - 2019-10-12

## [1.1.0-rc.3] - 2019-10-10
#### Added
- Confirmation on delete asset

## [1.1.0-rc.2] - 2019-10-09
#### Fixed
- A bug when user can't see balances with zero amount in business account
- A bug when the name of the industry and company was not fully displayed
- A bug when don't see loading while switching filter on transactions history page
- A bug when was no loader on delete asset
- A bug with text wrapping in the business description

#### Changed
- `IMAGE_FILE_EXTENSIONS` add jpeg

## [1.1.0-rc.1] - 2019-10-04
#### Added
- Redeem
- Track that offer was canceled on pay page
- Business page

#### Removed
- iOS installation guide
- Hid transfer policy from asset update form

#### Fixed
- A bug when not able to finish KYC recovery
- Different validation errors for card and crypto address

### "Under the hood" changes
#### Changed
- Now using @tokend/js-sdk@1.10.3-rc.1

## [1.1.0-rc.0] - 2019-09-30
#### Removed
- All schemes

#### Changed
- Refactored code
- Update vue-route

## [1.0.3-rc.11] - 2019-09-19
### "Under the hood" changes
#### Changed
- Sponsorship request structure for approve or reject

## [1.0.3-rc.10] - 2019-09-19
#### Added
- Sponsorship page

#### Changed
- Hid transfer policy

## [1.0.3-rc.9] - 2019-09-17
#### Added
- Pay page

#### Changed
- Show all base assets in set default quote asset select
- Renamed direct sell to offering
- Used new atomic swap requests

#### Fixed
- A bug when don't show an error message when field was touched

## [1.0.3-rc.8] - 2019-09-09
#### Added
- Handle new types of atomic swap bid requests
- Ability to set crypto addresses and card

#### Fixed
- Russian localization

#### Changed
- Shown only small balances

## [1.0.3-rc.7] - 2019-09-06
#### Added
- Sending to telegram username
#### Fixed
- Color scheme

## [1.0.3-rc.6] - 2019-09-04
#### Added
- Get data from store for general kyc form
- A loader on kyc recovery management page

#### Fixed
- Localization mistakes
- A bug with trailing digits count on amount fields
- Missing Russian localization
- A bug with not show more button on tx history
- A bug with displaying long asset name
- A bug with displaying long input field label

### "Under the hood" changes
#### Changed
- Now using @tokend/js-sdk@1.10.1-rc.0

## [1.0.3-rc.2] - 2019-08-29
#### Removed
- Login redirect

#### Changed
- Refactored `PhoneNumber` and `Telegram` forms

## [1.0.3-rc.1] - 2019-08-29
#### Added
- Asset description to atomic swap form
- Plus before phone number

#### Changed
- Menu item order

#### Fixed
- A bug with amount in `atomic-swap-form`
- A bug with displaying asset name on `atomicSwapCard`
- A bug with displaying subject in payment operations

## [1.0.3-rc.0] - 2019-08-27
#### Added
- Buying atomic swaps
- Missed russian translation
- `identities.module` to avoid reloading users identities
- Set/change telegram username in settings
- Pay(send) to not existing account(`Transfer` and `MassPayment` forms)

#### Removed
- Issued info from asset details
- Converted balance from asset card viewer

#### Fixed
- A bug when withdrawal form not closed after successfull operation
- A bug with kyc recovery form(general)
- A bug with redirect after login
- `AtomicSwapCard` design
- 6 symbols in asset code
- Circle asset logo on wallets screen
- Small localization improvements
- Disable send button when user has not tokens

#### Changed
- Call `loadPendingAtomicSwapBidRequests` method after success submit
- In `identity-getter.js` replace method `getAccountIdByEmail` to `getAccountIdByIdentifier`

## [1.0.2] - 2019-08-27
#### Fixed
-Hid assets with 0 balance on transfer and MassPayment form

## [1.0.1] - 2019-08-27
#### Added
- Filter assets on send by asset owner

#### Fixed
-Rename assets to wallet, 
-Hid assets with 0 balance

## [1.0.0] - 2019-08-23
#### Added
- Img url

## [1.0.0-rc.8] - 2019-08-16
#### Added
- Abbreviation for balances
- General KYC form
- Buying atomic swaps (fiat and crypto)
- Display first name and last name customer
- Buying atomic swaps

#### Removed
- Asset codes from drawer
- Pre-issuance-apps section on downloads page

#### Fixed
- Bug with validation on `Recipient email or phone` field
- Bug when user can to create atomic swap for not own asset
- Bug when user cannot send money
- Bug when the login form is cleared and enabled before routing to the app

#### Changed
- `My businesses` default tab
- `General` default tab on Settings page
- Renamed `Security -> General` and `My account -> Business`
- Transfer images of download page in to separate directory
- Renamed bank account to card number field

### "Under the hood" changes
#### Fixed
- Method `calculateConvertedBalances`

## [1.0.0-rc.7] - 2019-08-09
#### Added
- Atomic swap requests history in atomic swap details
- Update asset form
- Mass payment operation
- Set default quote asset for business in settings
- Convert asset for each business

#### Removed
- Dropdown account balances
- Issue form

## [1.0.0-rc.6] - 2019-08-02
#### Fixed
- Bug with displaying balances

#### Changed
- Hid asset explorer tabs 

## [1.0.0-rc.5] - 2019-08-02
#### Added
- Auto close indicator to status-messages
- Asset code generation with hash
- Sending asset by phone number

#### Removed
- Displaying asset codes
- Asset code in asset creation form
- Optional label to optional KYC fields
- Processing feedback on sign up
- Explorer for businesses
- Show business industry
- Set/change phone number in settings

#### Fixed
- Account ID in URL after login
- Issue when an asset are not available on issuance

#### Changed
- Color scheme

## [1.0.0-rc.4] - 2019-07-30
#### Added
- Invite field to KYC data

## [1.0.0-rc.3] - 2019-07-29
### Added
- Register of shares page

### Fixed
- Bug with naming css classes in user-movements

## [1.0.0-rc.2] - 2019-07-26
### Added
- Show transactions history of the each client for bussiness
- Create Asset Pair and Atomic Swap on asset creation

#### Changed
- `MIN_AMOUNT`, `MAX_AMOUNT`, `DECIMAL_POINTS` and `MINIMAL_NUMBER_INPUT_STEP`
  in config
- Trailing digits for create new asset

## [1.0.0-rc.1] - 2019-07-25
#### Added 
- Display asset logo full cover on Assets page
- Refresh lists after submit transactions

#### Changed
- Display asset description completely
- Required only 'Business name' field in business kyc form

#### Fixed
- Resolved an issue with randomly shown/hidden sidebar menu links of corporate
  account

### "Under the hood" changes
#### Changed
- Now using @tokend/js-sdk@1.9.0-rc.2

## [1.0.0-rc.0] - 2019-07-25
### Added
- New 'Explore atomic swaps' page
- Simultaneous support for most common delimiters (spaces, tabs, colons, commas,
  new lines) in "Mass issuance" and "Mass invitation" forms.
- Customer UI switch

#### Changed
- Now Safari version 10 should be supported

#### Removed
- Hidden sales and polls

#### Fixed
- Customer UI switch is shown only for corporate accounts now
- Change Customer UI => Customer in EN locale
- Some minor bug fixes
- Issue when a user could not create an atomic swap if an amount is less than
  an available balance
- A bug when you cannot return from "Downloads" if the tab was opened in new tab
- A bug when page reload twice

### "Under the hood" changes
#### Added
- New config keys:
  - `PLAY_MARKET_LINK`
  - `OFFLINE_ISSUANCE_WIN_LINK`
  - `OFFLINE_ISSUANCE_MAC_LINK`
  - `OFFLINE_ISSUANCE_SOURCE_LINK`
#### Changed
- If some of the config keys are empty, the related images and links will not
  be rendered. Affects the following keys:
  - `IOS_MANIFEST_LINK`
  - `PLAY_MARKET_LINK`
  - `OFFLINE_ISSUANCE_WIN_LINK`
  - `OFFLINE_ISSUANCE_MAC_LINK`
  - `OFFLINE_ISSUANCE_SOURCE_LINK`

#### Removed
- `RECOVERY_MODE` config key due to unused anymore

<<<<<<< HEAD
[Unreleased]: https://github.com/tokend/web-client/compare/1.7.0-rc.0...HEAD
[1.7.0-rc.0]: https://github.com/tokend/web-client/compare/1.6.1...1.7.0-rc.0
=======
[Unreleased]: https://github.com/tokend/web-client/compare/1.6.2...HEAD
[1.6.2]: https://github.com/tokend/web-client/compare/1.6.1...1.6.2
>>>>>>> fix
[1.6.1]: https://github.com/tokend/web-client/compare/1.6.0...1.6.1
[1.6.0]: https://github.com/tokend/web-client/compare/1.6.0-rc.3...1.6.0
[1.6.0-rc.3]: https://github.com/tokend/web-client/compare/1.6.0-rc.2...1.6.0-rc.3
[1.6.0-rc.2]: https://github.com/tokend/web-client/compare/1.6.0-rc.1...1.6.0-rc.2
[1.6.0-rc.1]: https://github.com/tokend/web-client/compare/1.6.0-rc.0...1.6.0-rc.1
[1.6.0-rc.0]: https://github.com/tokend/web-client/compare/1.5.0...1.6.0-rc.0
[1.5.0]: https://github.com/tokend/web-client/compare/1.5.0-rc.2...1.5.0
[1.5.0-rc.2]: https://github.com/tokend/web-client/compare/1.5.0-rc.1...1.5.0-rc.2
[1.5.0-rc.1]: https://github.com/tokend/web-client/compare/1.5.0-rc.0...1.5.0-rc.1
[1.5.0-rc.0]: https://github.com/tokend/web-client/compare/1.4.2...1.5.0-rc.0
[1.4.2]: https://github.com/tokend/web-client/compare/1.4.1...1.4.2
[1.4.1]: https://github.com/tokend/web-client/compare/1.4.0...1.4.1
[1.4.0]: https://github.com/tokend/web-client/compare/1.4.0-rc.3...1.4.0
[1.4.0-rc.3]: https://github.com/tokend/web-client/compare/1.4.0-rc.2...1.4.0-rc.3
[1.4.0-rc.2]: https://github.com/tokend/web-client/compare/1.4.0-rc.1...1.4.0-rc.2
[1.4.0-rc.1]: https://github.com/tokend/web-client/compare/1.4.0-rc.0...1.4.0-rc.1
[1.4.0-rc.0]: https://github.com/tokend/web-client/compare/1.3.1...1.4.0-rc.0
[1.3.1]: https://github.com/tokend/web-client/compare/1.3.0...1.3.1
[1.3.0]: https://github.com/tokend/web-client/compare/1.3.0-rc.1...1.3.0
[1.3.0-rc.1]: https://github.com/tokend/web-client/compare/1.3.0-rc.0...1.3.0-rc.1
[1.3.0-rc.0]: https://github.com/tokend/web-client/compare/1.2.0...1.3.0-rc.0
[1.2.0]: https://github.com/tokend/web-client/compare/1.2.0-rc.0...1.2.0
[1.2.0-rc.0]: https://github.com/tokend/web-client/compare/1.1.0...1.2.0-rc.0
[1.1.0]: https://github.com/tokend/web-client/compare/1.1.0-rc.3...1.1.0
[1.1.0-rc.3]: https://github.com/tokend/web-client/compare/1.1.0-rc.2...1.1.0-rc.3
[1.1.0-rc.2]: https://github.com/tokend/web-client/compare/1.1.0-rc.1...1.1.0-rc.2
[1.1.0-rc.1]: https://github.com/tokend/web-client/compare/1.1.0-rc.0...1.1.0-rc.1
[1.1.0-rc.0]: https://github.com/tokend/web-client/compare/1.0.3-rc.11...1.1.0-rc.0
[1.0.3-rc.11]: https://github.com/tokend/web-client/compare/1.0.3-rc.10...1.0.3-rc.11
[1.0.3-rc.10]: https://github.com/tokend/web-client/compare/1.0.3-rc.9...1.0.3-rc.10
[1.0.3-rc.9]: https://github.com/tokend/web-client/compare/1.0.3-rc.8...1.0.3-rc.9
[1.0.3-rc.8]: https://github.com/tokend/web-client/compare/1.0.3-rc.7...1.0.3-rc.8
[1.0.3-rc.7]: https://github.com/tokend/web-client/compare/1.0.3-rc.6...1.0.3-rc.7
[1.0.3-rc.6]: https://github.com/tokend/web-client/compare/1.0.3-rc.2...1.0.3-rc.6
[1.0.3-rc.2]: https://github.com/tokend/web-client/compare/1.0.3-rc.1...1.0.3-rc.2
[1.0.3-rc.1]: https://github.com/tokend/web-client/compare/1.0.3-rc.0...1.0.3-rc.1
[1.0.3-rc.0]: https://github.com/tokend/web-client/compare/1.0.2...1.0.3-rc.0
[1.0.2]: https://github.com/tokend/web-client/compare/1.0.1...1.0.2
[1.0.1]: https://github.com/tokend/web-client/compare/1.0.0...1.0.1
[1.0.0]: https://github.com/tokend/web-client/compare/1.0.0-rc.8...1.0.0
[1.0.0-rc.8]: https://github.com/tokend/web-client/compare/1.0.0-rc.7...1.0.0-rc.8
[1.0.0-rc.7]: https://github.com/tokend/web-client/compare/1.0.0-rc.6...1.0.0-rc.7
[1.0.0-rc.6]: https://github.com/tokend/web-client/compare/1.0.0-rc.5...1.0.0-rc.6
[1.0.0-rc.5]: https://github.com/tokend/web-client/compare/1.0.0-rc.4...1.0.0-rc.5
[1.0.0-rc.4]: https://github.com/tokend/web-client/compare/1.0.0-rc.3...1.0.0-rc.4
[1.0.0-rc.3]: https://github.com/tokend/web-client/compare/1.0.0-rc.2...1.0.0-rc.3
[1.0.0-rc.2]: https://github.com/tokend/web-client/compare/1.0.0-rc.1...1.0.0-rc.2
[1.0.0-rc.1]: https://github.com/tokend/web-client/compare/1.0.0-rc.0...1.0.0-rc.1
[1.0.0-rc.0]: https://github.com/tokend/web-client/releases/tag/1.0.0-rc.0
