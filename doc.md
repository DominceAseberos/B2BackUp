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
- Searches for and ranks alternative partners based on multiple criteria (including logistics).
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
- **Logistics Provider:** Updates vehicle type, capacity, availability, and route status.
- **LGU / DRRM Officer:** Monitors affected businesses and views disaster impact reports.

#### 3.2 Functional Requirements (Core subset)
- **FR-01 User Authentication:** Registration and RBAC for SMEs, Logistics, and LGUs.
- **FR-02 Business Profile Management:** Capture business info, product info, and capacity.
- **FR-03 Supply Chain Relationship Mapping:** Allow businesses to register their existing nodes (Supplier -> Processor -> Buyer).
- **FR-04 Disaster Disruption Reporting:** Report supplier, buyer, or logistics disruptions (e.g., flooded roads).
- **FR-05 Automated Disruption Detection:** Analyze reports and identify cascading effects on the supply chain.
- **FR-06 Alternative Partner Matching Engine:** Automatically search and rank Top 3 available replacement partners.
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
 Logistics Module
──────────────────────────────────────────────────────
 Recovery Monitoring & LGU Dashboard
──────────────────────────────────────────────────────
```

---

### Chapter 5 — Algorithms

#### 5.1 Supply Chain Recovery Algorithm (Ranking Formula)
The matching engine evaluates available partners using a weighted formula. Logistics is a critical factor—finding another supplier is useless if the product cannot physically move.

**Evaluation Criteria & Example Weights:**
- **Distance:** 30% (Proximity of the alternative partner)
- **Product Match:** 25% (Compatibility of agricultural products)
- **Availability / Capacity:** 20% (Can they meet the demand?)
- **Price:** 15% (Economic viability)
- **Logistics:** 10% (Is the route open? Are trucks available?)

**Logistics Impact Example:**
Supplier B is 15km away but the route is flooded (Unavailable). Supplier C is 30km away but the route is open and trucks are available. The algorithm will rank Supplier C higher because physical transportation is guaranteed.

---

### Chapter 6 — User Interface

**Key Screens:**
1. **Dashboard:** Overview of active supply chain health.
2. **Supply Chain Map:** Visual representation of suppliers and buyers.
3. **Report Disaster:** Quick-action screen to report floods, road blocks, or facility damage.
4. **Recovery Dashboard:** Interface for reviewing the Top 3 recommended partners.
5. **Logistics Portal:** Interface for transport providers to update route status (e.g., Davao → Tagum: 🔴 Blocked) and truck availability.

---

### Chapter 7 — Database Design

**Core Tables:**
- `Users`: Authentication, Roles (SME, Logistics, LGU).
- `Businesses`: Profiles, capacities, locations.
- `Products`: Categorization of agricultural goods (e.g., Copra, Whole Coconuts).
- `Relationships`: The mapped supply chain connections (Buyer ID -> Supplier ID).
- `Disruptions`: Logs of disaster events and affected nodes.
- `RecoveryRequests`: Temporary connections made during a disaster.
- `LogisticsStatus`: Real-time updates on route availability and transport capacity.

---

### Chapter 8 — API Design

- **Authentication API:** Login, JWT generation, Role verification.
- **Businesses API:** CRUD for business profiles and supply chain mapping.
- **Disruption API:** Submit disaster reports, update recovery status.
- **Matching API:** Trigger the ranking algorithm and return the Top 3 partners.
- **Notification API:** Dispatch alerts to affected nodes.
- **Logistics API:** Submit and retrieve route status and vehicle availability.

---

### Chapter 9 — Security

- **Authentication:** JWT (JSON Web Tokens) for secure session management.
- **Authorization:** RBAC (Role-Based Access Control) ensuring LGUs can only view data, while SMEs can only edit their own supply chain.
- **Data Privacy:** Encryption of proprietary business relationships and pricing data.

---

### Chapter 10 — MVP & Future Scope

#### 10.1 MVP Scope (Demo Ready)
The prototype will focus strictly on the core loop:
- ✅ **Login & Business Registration**
- ✅ **Create Supply Chain** (Map 1 supplier to 1 buyer)
- ✅ **Report Disaster** (Mark a node or route as unavailable)
- ✅ **Matching Engine** (Run the formula and output Top 3 Recommendations)
- ✅ **Logistics Integration (Manual)** (Manual input of route availability and distance)
- ✅ **Send Notification & Accept Partner**
- ✅ **Recovery Complete** (Temporary reroute established)

#### 10.2 Future Scope
- Real-time disaster APIs and Satellite Imagery.
- GPS tracking for logistics providers.
- Road condition APIs (e.g., Waze/Google Maps integration).
- Machine Learning for predictive disruption analysis and advanced ranking.
- Automated LGU disaster reporting integration.
