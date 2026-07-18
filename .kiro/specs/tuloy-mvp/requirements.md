# Requirements Document

## Introduction

Tuloy (formerly ResiliLink) is a Disaster-Resilient Supply Chain Continuity Platform for coconut-industry SMEs in Mindanao, Philippines. This document specifies the requirements for the Minimum Viable Product (MVP).

The MVP supports one core flow: a business registers, creates a supply chain profile, experiences a disaster that disrupts a buyer or supplier, reports the disruption, receives a ranked list of alternative partners from a matching engine, sends a connection request to a chosen partner, and — once the partner accepts — restores its supply chain and continues operations.

The MVP is delivered as a single system with three account types (portals): the Business Portal, the Buyer/Supplier Portal, and the Admin Portal. These are account types within one platform, not separate systems.

A React + Vite + TypeScript frontend already exists in `src/`. Where an existing module already satisfies a requirement, a non-normative **Implementation Note** records this so the design phase can reconcile the specification with the code. These notes are informative only and do not relax the requirement.

### In Scope

- User roles, authentication, and account types
- Business registration and business profile management
- Supply chain relationship mapping
- Disruption reporting
- The Alternative Partner Matching Engine (scoring criteria and top-3 behavior)
- Connection request handshake (send / accept / reject)
- Buyer/supplier availability management
- Recovery monitoring and status
- Admin verification and monitoring portal

### Out of Scope

The following are explicitly excluded from the MVP: LGU Portal, DRRM integration, accounting, finance module, document storage, AI chatbot, full marketplace, payment system, and delivery tracking.

## Glossary

- **Tuloy_Platform**: The overall system that provides supply chain continuity services to all account types.
- **Authentication_Service**: The component that authenticates users and enforces account-type access.
- **Registration_Service**: The component that creates business accounts and captures registration details.
- **Profile_Service**: The component that stores and updates business profiles and dashboards.
- **Supply_Chain_Mapper**: The component that records a business's normal buyer and supplier relationships.
- **Disruption_Reporter**: The component that captures disruption reports from a business.
- **Matching_Engine**: The component that filters and ranks alternative partners and returns the top 3.
- **Connection_Service**: The component that sends, accepts, and rejects connection requests between businesses and partners.
- **Availability_Manager**: The component through which a buyer/supplier account sets its availability status.
- **Recovery_Monitor**: The component that tracks the status of disruptions and recoveries for a business.
- **Admin_Console**: The component that provides administrator dashboard metrics.
- **Verification_Service**: The component through which an administrator verifies partner businesses.
- **Account_Type**: One of Business, Buyer/Supplier, or Administrator, determining which portal a user accesses.
- **Business_Account**: An SME account (coconut farmer, processor, trader, or cooperative) that uses the Business Portal.
- **Partner_Account**: A buyer or supplier account that uses the Buyer/Supplier Portal.
- **Administrator_Account**: A system administrator account that uses the Admin Portal.
- **Business_Profile**: The stored record of a business's name, owner, location, industry, business type, and products.
- **Supply_Chain_Profile**: The stored mapping of a business's current buyer and current supplier relationships.
- **Disruption_Report**: A record describing a problem type, affected partner, reason, and urgency.
- **Recovery_Need**: A structured need derived from a disruption report, specifying the role, product, and volume to source.
- **Match_Result**: A ranked alternative partner with a match score and supporting criteria.
- **Match_Score**: An integer from 0 to 100 (a percentage, rounded to a whole number) representing how well an alternative partner fits a Recovery_Need. It is the weighted sum of five criterion sub-scores.
- **Connection_Request**: A request from a business to a partner proposing a product and quantity to trade.
- **Availability_Status**: One of Available, Limited Capacity, or Unavailable, set by a Partner_Account.
- **Business_Status**: The operational state of a business, such as Operating Normally, Disrupted, or Recovering.
- **Verification_Status**: Whether a partner business has been verified by an administrator (Verified or Unverified).
- **Urgency**: A disruption priority of Low, Medium, or High.
- **Problem_Type**: The category of a disruption, either Buyer Unavailable or Supplier Unavailable.

## Requirements

### Requirement 1: Account Types and Authentication

**User Story:** As a platform user, I want to sign in to an account of a specific type, so that I only access the portal and capabilities that match my role.

#### Acceptance Criteria

1. THE Tuloy_Platform SHALL support exactly three Account_Types: Business_Account, Partner_Account, and Administrator_Account.
2. WHEN a user submits valid credentials, THE Authentication_Service SHALL authenticate the user and grant access to the portal for the user's Account_Type.
3. IF a user submits invalid credentials, THEN THE Authentication_Service SHALL deny access and return an authentication error message.
4. WHILE a user is authenticated, THE Tuloy_Platform SHALL restrict the user to capabilities permitted for the user's Account_Type.
5. IF an unauthenticated request is made for a protected capability, THEN THE Authentication_Service SHALL deny the request.

*Implementation Note: The existing `src/App.tsx` provides an in-memory role toggle (`WorkspaceRole` = buyer/supplier) for demo navigation but does not implement authentication or distinct account types. This requirement is not yet satisfied and will be addressed in design.*

### Requirement 2: Business Registration

**User Story:** As a coconut-industry SME owner, I want to register my business, so that I can create an account and participate in the platform.

#### Acceptance Criteria

1. WHEN a user submits a registration form containing Business Name, Owner, Location, Industry, Business Type, and Products, THE Registration_Service SHALL create a Business_Account with those details and return a confirmation identifying the created Business_Account.
2. IF a registration submission is missing Business Name, Owner, Location, Industry, Business Type, or Products, THEN THE Registration_Service SHALL reject the submission, preserve the submitted values, and identify the missing fields.
3. WHEN a Business_Account is created, THE Registration_Service SHALL set the initial Verification_Status of the business to Unverified.
4. WHEN a Business_Account is created, THE Registration_Service SHALL set the initial Business_Status to Operating Normally.

*Implementation Note: `src/domain/types.ts` defines `BusinessProfile` (name, role, location, products, monthlyVolumeTons, currentPartners) and `src/domain/mockData.ts` seeds a demo business, but no registration flow exists. Registration fields (Owner, Industry, Business Type, Verification_Status) are not yet captured.*

### Requirement 3: Business Dashboard and Profile

**User Story:** As a registered business, I want to view and maintain my business dashboard and profile, so that the platform reflects my current products, capacity, and operational status.

#### Acceptance Criteria

1. WHEN a Business_Account opens its dashboard, THE Profile_Service SHALL display the Business_Status, current buyer, current supplier, products, and monthly capacity for the signed-in Business_Account.
2. WHEN a business updates its products or monthly capacity, THE Profile_Service SHALL store the updated Business_Profile and return a confirmation identifying the updated Business_Profile.
3. WHEN a business changes its Business_Status, THE Profile_Service SHALL store the updated Business_Status and return a confirmation identifying the updated Business_Status.
4. WHEN a Business_Account opens its dashboard, THE Profile_Service SHALL display the current Verification_Status of the signed-in Business_Account.

*Implementation Note: `src/features/BuyerDashboard.tsx` and `SupplierDashboard.tsx` render dashboard data from `BusinessProfile`/`Partner` mock data. Business_Status and Verification_Status display and editing are not yet implemented.*

### Requirement 4: Supply Chain Relationship Mapping

**User Story:** As a registered business, I want to map my normal buyer and supplier relationships, so that the platform knows which partners to consider when a disruption occurs.

#### Acceptance Criteria

1. WHEN a business defines a current buyer relationship, THE Supply_Chain_Mapper SHALL store the buyer partner as part of the business's Supply_Chain_Profile and return a confirmation identifying the stored relationship.
2. WHEN a business defines a current supplier relationship, THE Supply_Chain_Mapper SHALL store the supplier partner as part of the business's Supply_Chain_Profile and return a confirmation identifying the stored relationship.
3. THE Supply_Chain_Mapper SHALL store, for each mapped relationship, the partner name, the partner role, the related product, and the partner location.
4. WHEN a business opens its supply chain mapping screen, THE Supply_Chain_Mapper SHALL display the business's Supply_Chain_Profile as the mapping from supplier to business to buyer.

*Implementation Note: `BusinessProfile.currentPartners` in `src/domain/types.ts` holds the mapped buyer/supplier `Partner` records, and the demo business in `mockData.ts` maps a buyer and a supplier. A dedicated mapping/editing screen is not yet implemented.*

### Requirement 5: Disruption Reporting

**User Story:** As a business affected by a disaster, I want to report a disruption to a buyer or supplier, so that the platform can start finding alternatives.

#### Acceptance Criteria

1. WHEN a business submits a Disruption_Report containing Problem_Type, Affected Partner, Reason, and Urgency, THE Disruption_Reporter SHALL create a Disruption_Report record and return a confirmation identifying the created Disruption_Report.
2. THE Disruption_Reporter SHALL accept a Problem_Type of either Buyer Unavailable or Supplier Unavailable.
3. THE Disruption_Reporter SHALL accept an Urgency of Low, Medium, or High.
4. WHEN a Problem_Type of Buyer Unavailable is selected, THE Disruption_Reporter SHALL restrict the selectable Affected Partner to buyers in the business's Supply_Chain_Profile.
5. WHEN a Problem_Type of Supplier Unavailable is selected, THE Disruption_Reporter SHALL restrict the selectable Affected Partner to suppliers in the business's Supply_Chain_Profile.
6. IF a Disruption_Report submission is missing Problem_Type, Affected Partner, Reason, or Urgency, THEN THE Disruption_Reporter SHALL reject the submission, preserve the submitted values, and identify the missing fields.
7. WHEN a Disruption_Report is created, THE Disruption_Reporter SHALL derive a Recovery_Need specifying the partner role to source, the product, and the required volume.
8. WHEN a Disruption_Report is created, THE Disruption_Reporter SHALL set the business's Business_Status to Disrupted.

*Implementation Note: `src/features/ReportDisruptionView.tsx` captures a disruption type and affected partner and filters partners by role, and `src/domain/recovery.ts` (`buildRecoveryNeed`) derives a `RecoveryNeed`. The existing view does not yet capture Reason or Urgency, and the existing `DisruptionType` also includes `route_blocked`, which is out of MVP scope for Problem_Type (kept only if design retains it internally).*

### Requirement 6: Alternative Partner Matching Engine

**User Story:** As a business that reported a disruption, I want the system to recommend the best available alternative partners, so that I can quickly reconnect and continue operating.

#### Acceptance Criteria

1. WHEN a Recovery_Need is available, THE Matching_Engine SHALL consider only partners whose role matches the role required by the Recovery_Need.
2. WHEN evaluating candidate partners, THE Matching_Engine SHALL exclude partners that do not offer or accept the product specified by the Recovery_Need.
3. WHEN evaluating candidate partners, THE Matching_Engine SHALL exclude partners whose Availability_Status is Unavailable.
4. WHEN evaluating candidate partners, THE Matching_Engine SHALL exclude the affected partner named in the Disruption_Report.
5. THE Matching_Engine SHALL compute a Match_Score for each remaining candidate from five criteria with the following fixed weights that sum to 100 percent: Distance 40 percent, Capacity Availability 25 percent, Price Competitiveness 15 percent, Product Compatibility 10 percent, and Business Verification 10 percent.
6. THE Matching_Engine SHALL normalize each criterion sub-score to an integer from 0 to 100, where a higher sub-score indicates a better fit: a nearer Distance scores higher, greater Capacity Availability scores higher, a Price closer to the fair reference price scores higher, a full Product Compatibility match scores 100 while no match scores 0, and a Verified business scores higher than an Unverified business.
7. THE Matching_Engine SHALL compute each candidate's Match_Score as the weighted sum of its criterion sub-scores, rounded to an integer from 0 to 100.
8. THE Matching_Engine SHALL rank remaining candidates in descending order of Match_Score.
9. WHEN two or more candidates have an equal Match_Score, THE Matching_Engine SHALL order the tied candidates by shortest Distance first, then by greatest Capacity Availability first.
10. WHEN more than three candidates remain after filtering, THE Matching_Engine SHALL return exactly the three highest-ranked candidates.
11. WHEN three or fewer candidates remain after filtering, THE Matching_Engine SHALL return all remaining candidates ranked by the ordering defined in criteria 8 and 9.
12. WHEN no candidates remain after filtering, THE Matching_Engine SHALL return an empty result set and indicate that no alternatives are available.
13. WHEN the business opens the recovery matches screen, THE Matching_Engine SHALL display, for each returned Match_Result, the Match_Score as a percentage, the Distance, the Capacity, the Price, and the Verification_Status.

*Implementation Note: `src/domain/matching.ts` (`findAlternatives`) already filters by role, product, affected partner, disaster status, and blocked route, ranks by a weighted score (40% distance, 25% capacity, 15% price, 10% logistics, 10% reliability), and returns the top 3; `src/features/RecoveryMatchesView.tsx` and `src/ui/MatchCard.tsx` display scores and criteria. Reconciliation needed in design: the MVP criteria set is Distance + Product Compatibility + Capacity + Price + Business Verification, whereas the existing weights use Logistics and Reliability instead of an explicit Business Verification criterion, and Availability_Status supersedes the existing `disasterStatus`/`routeStatus` filters.*

### Requirement 7: Connection Request Handshake

**User Story:** As a business with a recommended alternative, I want to send a connection request and have the partner accept or reject it, so that a new supply chain relationship can be established.

#### Acceptance Criteria

1. WHEN a business selects a recommended partner and submits a product and quantity, THE Connection_Service SHALL create a Connection_Request addressed to that partner and return a confirmation identifying the created Connection_Request.
2. IF a Connection_Request submission is missing a partner, product, or quantity, THEN THE Connection_Service SHALL reject the submission, preserve the submitted values, and identify the missing fields.
3. WHEN a Connection_Request is created, THE Connection_Service SHALL set the request status to Pending.
4. WHEN a partner accepts a Pending Connection_Request, THE Connection_Service SHALL set the request status to Accepted.
5. WHEN a partner rejects a Pending Connection_Request, THE Connection_Service SHALL set the request status to Rejected.
6. WHEN a Connection_Request status becomes Accepted, THE Connection_Service SHALL record the resulting relationship in the requesting business's Supply_Chain_Profile.
7. WHILE a Connection_Request status is Pending, THE Connection_Service SHALL prevent the request from being accepted or rejected more than once.

*Implementation Note: The existing order lifecycle in `src/domain/orders.ts` and `src/state/useOrders.ts` models placed/accepted/declined order states with a timeline, which is analogous to the send/accept/reject handshake. Design should decide whether the MVP Connection_Request reuses or generalizes this order flow.*

### Requirement 8: Buyer/Supplier Availability Management

**User Story:** As a buyer or supplier, I want to set my availability status, so that the matching engine only recommends me when I can actually trade.

#### Acceptance Criteria

1. THE Availability_Manager SHALL allow a Partner_Account to set its Availability_Status to Available, Limited Capacity, or Unavailable.
2. WHEN a Partner_Account updates its Availability_Status, THE Availability_Manager SHALL store the updated Availability_Status and return a confirmation identifying the updated Availability_Status.
3. WHEN a Partner_Account opens its profile screen, THE Availability_Manager SHALL display the Partner_Account profile including business, role, accepted or offered products, capacity, location, and current Availability_Status.
4. WHEN the Matching_Engine evaluates a Partner_Account, THE Matching_Engine SHALL use the partner's current Availability_Status.

*Implementation Note: `Partner` in `types.ts` carries `disasterStatus` and `routeStatus`, which the matching engine treats as availability filters, but no Partner_Account screen exists to set an Availability_Status. Design should map the MVP's three-value Availability_Status onto (or replace) these fields.*

### Requirement 9: Recovery Requests for Partners

**User Story:** As a buyer or supplier, I want to see incoming connection requests, so that I can accept or reject new business opportunities during a disruption.

#### Acceptance Criteria

1. WHEN a Partner_Account opens its incoming requests screen, THE Connection_Service SHALL display to that Partner_Account all Connection_Requests addressed to that partner with a status of Pending.
2. WHEN a Partner_Account chooses to accept a Connection_Request, THE Connection_Service SHALL accept the request per Requirement 7.
3. WHEN a Partner_Account chooses to reject a Connection_Request, THE Connection_Service SHALL reject the request per Requirement 7.
4. WHEN a Partner_Account opens its incoming requests screen, THE Connection_Service SHALL display, for each incoming Connection_Request, the requesting business, the product, and the quantity.

### Requirement 10: Recovery Monitoring and Status

**User Story:** As a business, I want to see the status of my disruption and recovery, so that I know when my supply chain has been restored.

#### Acceptance Criteria

1. WHEN a business opens its recovery monitoring screen, THE Recovery_Monitor SHALL display the status of each active Disruption_Report for the signed-in business.
2. WHEN a Connection_Request arising from a disruption is Accepted, THE Recovery_Monitor SHALL mark the associated disruption as Recovered.
3. WHEN a disruption is marked Recovered, THE Recovery_Monitor SHALL set the business's Business_Status to Operating Normally.
4. WHILE a disruption has no Accepted Connection_Request, THE Recovery_Monitor SHALL report the disruption as Pending Recovery.

*Implementation Note: `src/features/RestoredView.tsx` presents a supply-chain-restored confirmation after a match is selected, which corresponds to the recovered state. A persistent recovery-status view across multiple disruptions is not yet implemented.*

### Requirement 11: Admin Monitoring Dashboard

**User Story:** As a system administrator, I want a dashboard of platform activity, so that I can monitor adoption and recovery outcomes.

#### Acceptance Criteria

1. WHEN an administrator opens the Admin_Console dashboard, THE Admin_Console SHALL display the count of registered businesses.
2. WHEN an administrator opens the Admin_Console dashboard, THE Admin_Console SHALL display the count of verified partners.
3. WHEN an administrator opens the Admin_Console dashboard, THE Admin_Console SHALL display the count of active disruptions.
4. WHEN an administrator opens the Admin_Console dashboard, THE Admin_Console SHALL display the count of successful recoveries.
5. WHEN the underlying data changes, THE Admin_Console SHALL reflect the updated counts on next display.

*Implementation Note: No Admin Portal exists in `src/`. This requirement is new.*

### Requirement 12: Admin Partner Verification

**User Story:** As a system administrator, I want to verify a business's identity and details, so that businesses on the platform can trust verified partners.

#### Acceptance Criteria

1. WHEN an administrator opens the verification screen, THE Verification_Service SHALL display businesses that have a Verification_Status of Unverified.
2. WHEN an administrator verifies a business, THE Verification_Service SHALL record the business's identity, product category, location, and contact information as reviewed, set the Verification_Status to Verified, and return a confirmation identifying the verified business.
3. WHEN a business's Verification_Status becomes Verified, THE Profile_Service SHALL display the business as Verified to other accounts.
4. WHERE a business is Verified, THE Matching_Engine SHALL apply the Business Verification criterion favorably when computing that business's Match_Score.

*Implementation Note: `Partner.verified` exists and is surfaced in reliability scoring in `matching.ts`, but there is no administrator workflow to set it and no Verification_Service. This requirement is largely new.*
