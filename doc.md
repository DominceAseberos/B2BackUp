# Software Engineering Project Documentation
## Project Title: B2BackUp - Disaster-Resilient Supply Chain Platform

This document serves as the comprehensive Software Requirements Specification (SRS) and System Design document for **B2BackUp**, an automated supply chain recovery platform. It follows the IEEE 29148 style to provide a professional, engineering-grade foundation for the project.

---

### Chapter 1 — Project Foundation

#### 1.1 Executive Summary
B2BackUp is a disaster-resilient supply chain continuity platform that helps Small and Medium Enterprises (SMEs), particularly in the coconut industry of Mindanao, maintain business operations during and after natural disaster disruptions. The system's core philosophy is not to replace affected businesses, but to temporarily reroute supply chain connections to maintain business continuity while affected businesses recover and rejoin the network.

#### 1.2 Problem Addressed
SMEs depend heavily on established buyers and suppliers. Natural disasters (typhoons, floods, earthquakes) can disrupt these relationships by destroying production capabilities, facilities, or transportation routes. Without an automated recovery mechanism, supply chains break, leading to severe financial losses.

#### 1.3 Proposed Solution
B2BackUp automatically:
- Detects supply chain disruptions.
- Identifies affected businesses (buyers and suppliers).
- Searches for and ranks alternative partners based on multiple criteria.
- Temporarily reroutes the supply chain for continuity.
- Tracks and supports affected businesses until they recover and rejoin the network.

#### 1.4 Scope & Limitations
- **Scope:** Coconut industry SMEs in Mindanao, disaster-induced supply chain disruptions, automated partner recommendations.
- **Limitations:** The system does not act as a delivery app or a general marketplace. It is a targeted recovery and resilience platform that activates during disruption scenarios.

---

### Chapter 2 — Business Analysis

#### 2.1 The Two-Sided Recovery Approach
The system uniquely supports both sides of a disruption:
1. **For the Buyer (Immediate Business Continuity):** If a supplier is flooded, the buyer is immediately rerouted to the Top 3 alternative suppliers to continue operations.
2. **For the Affected Supplier (Recovery):** The supplier's status changes to "🔴 Disaster Affected". The system retains their profile. Once recovered, they update their status to "✅ Business Recovered", and the system automatically reactivates them, notifying their buyers to reconnect.

#### 2.2 Complete Workflow Scenarios
**Case A – Supplier Flooded**
`Flood -> Supplier unavailable -> System marks supplier as temporarily unavailable -> Notify connected buyers -> Find Top 3 alternative suppliers -> Buyer continues operations -> Supplier recovers -> Supplier updates status -> System reconnects supplier to network`

**Case B – Buyer Flooded**
`Flood -> Buyer unavailable -> Supplier has harvested coconuts -> Notify supplier -> Find Top 3 alternative buyers -> Supplier sells products -> Buyer recovers -> Buyer returns to network`

---

### Chapter 3 — Software Requirements Specification (IEEE Style)

#### 3.1 User Classes
- **SME (Business Owner):** Registers business, maps existing supply chains, reports disruptions, accepts recommendations.
- **Buyer:** Registers buying requirements and capacity, receives supplier disruption notifications.
- **Supplier:** Registers available products and capacity, receives buyer disruption notifications.

#### 3.2 Functional Requirements (Core subset)
- **FR-01 User Authentication:** Registration and RBAC for SMEs (Buyers/Suppliers). *(Mocked for MVP)*
- **FR-02 Business Profile Management:** Capture business info, product info, and capacity.
- **FR-03 Supply Chain Relationship Mapping:** Allow businesses to register their existing nodes (Supplier -> Processor -> Buyer).
- **FR-04 Disaster Disruption Reporting:** Report supplier or buyer disruptions (e.g., flooded facilities).
- **FR-05 Automated Disruption Detection:** Analyze reports and identify cascading effects on the supply chain.
- **FR-06 Alternative Partner Matching Engine:** Automatically search and rank Top 3 available replacement partners based on distance and capacity.
- **FR-07 Connection Management:** Accept/reject recommendations and manage temporary supply chain links.

#### 3.3 Non-Functional Requirements
- **Performance:** Generate Top 3 recommendations within seconds of a disruption report.
- **Availability:** High uptime during disaster scenarios.
- **Security:** Protect sensitive business partnership and location data.

---

### Chapter 4 — System Design

#### 4.1 System Architecture Overview
```text
                    B2BackUp
     Disaster-Resilient Supply Chain Platform
                    │
──────────────────────────────────────────────────────
 Authentication & Roles
──────────────────────────────────────────────────────
 Business Profile Management
──────────────────────────────────────────────────────
 Supply Chain Mapping
──────────────────────────────────────────────────────
 Disaster Reporting
──────────────────────────────────────────────────────
 Recovery Matching Engine ⭐
──────────────────────────────────────────────────────
 Notification Engine ⭐
──────────────────────────────────────────────────────
 Business Connection Module
──────────────────────────────────────────────────────
```

---

### Chapter 5 — Algorithms

#### 5.1 Supply Chain Recovery Algorithm (Ranking Formula)
The matching engine evaluates available partners using a weighted formula. For the MVP, this relies purely on simple metrics like distance, capacity, and price to simulate a basic recommendation engine.

**Evaluation Criteria & Example Weights:**
- **Distance:** 40% (Proximity of the alternative partner)
- **Product Match:** 30% (Compatibility of agricultural products)
- **Availability / Capacity:** 20% (Can they meet the demand?)
- **Price:** 10% (Economic viability)

**Impact Example:**
Supplier B is 15km away and matches the exact coconut type required. They will rank higher than Supplier C, who is 30km away, provided Supplier B has enough capacity to fulfill the buyer's needs.

---

### Chapter 6 — User Interface

**Key Screens:**
1. **Dashboard:** Overview of active supply chain health.
2. **Supply Chain Map:** Visual representation of suppliers and buyers.
3. **Report Disaster:** Quick-action screen to report floods or facility damage.
4. **Recovery Dashboard:** Interface for reviewing the Top 3 recommended partners.

---

### Chapter 7 — Database Design *(Future Scope for MVP)*

*Note: For the hackathon MVP, the database is mocked locally on the frontend (e.g., `mockData.ts`) to ensure a flawless and lightning-fast demonstration. The schemas below represent the target production architecture.*

**Core Tables:**
- `Users`: Authentication, Roles (SME, Buyer, Supplier).
- `Businesses`: Profiles, capacities, locations.
- `Products`: Categorization of agricultural goods (e.g., Copra, Whole Coconuts).
- `Relationships`: The mapped supply chain connections (Buyer ID -> Supplier ID).
- `Disruptions`: Logs of disaster events and affected nodes.
- `RecoveryRequests`: Temporary connections made during a disaster.

---

### Chapter 8 — API Design *(Future Scope for MVP)*

*Note: For the MVP, all business logic and matching algorithms are executed locally on the frontend against the mocked state.*

- **Authentication API:** Login, JWT generation, Role verification.
- **Businesses API:** CRUD for business profiles and supply chain mapping.
- **Disruption API:** Submit disaster reports, update recovery status.
- **Matching API:** Trigger the ranking algorithm and return the Top 3 partners.
- **Notification API:** Dispatch alerts to affected nodes.

---

### Chapter 9 — Security *(Future Scope for MVP)*

- **Authentication:** JWT (JSON Web Tokens) for secure session management.
- **Authorization:** RBAC (Role-Based Access Control) ensuring SMEs can only edit their own supply chain.
- **Data Privacy:** Encryption of proprietary business relationships and pricing data.

---

### Chapter 10 — MVP & Future Scope

#### 10.1 MVP Scope (Static Prototype)
To ensure reliability and focus entirely on the core value proposition (the Matching Algorithm and Workflow), the MVP is built as a **Static Frontend Application** using hardcoded mock data.

The prototype strictly demonstrates:
- ✅ **Mocked State:** Pre-configured mock data representing businesses, products, and an active supply chain.
- ✅ **Report Disaster:** The ability for a user to mark a node as flooded/unavailable.
- ✅ **Matching Engine (Frontend Logic):** The algorithm runs entirely in the browser to process the mocked data and output Top 3 Recommendations based on distance/capacity.
- ✅ **Send Notification & Accept Partner:** UI simulation of notifications and accepting a partner.
- ✅ **Recovery Complete:** Visual update showing the temporary reroute has been established.

#### 10.2 Future Scope (Post-MVP Roadmap)
To scale the platform into a comprehensive, region-wide solution, the following features are planned for future development:
- **Live Backend API & Database:** Transitioning from the static mock data to a fully scalable cloud database (e.g., PostgreSQL via Supabase) and a Node/Express REST API.
- **Dedicated Logistics Provider Portal:** A portal for truck drivers and delivery companies to update vehicle availability and real-time route statuses (e.g., blocked roads).
- **LGU / DRRM Dashboard:** An official integration for Local Government Units to validate disaster reports, issue official warnings, and monitor the economic health of affected areas.
- Real-time disaster APIs and Satellite Imagery.
- GPS tracking for logistics providers.
- Road condition APIs (e.g., Waze/Google Maps integration).
- Machine Learning for predictive disruption analysis and advanced ranking.
