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

#### 1.5 Three Core Pillars
B2BackUp is built upon three foundational pillars:
1. **Business Continuity:** Ensuring trade flows are maintained even when primary partners fail.
2. **Financial Resilience:** Protecting the cash flow of SMEs by minimizing operational downtime.
3. **Disaster Resilience:** Creating an interconnected ecosystem that bounces back from catastrophic regional events.

---

### Chapter 2 — Business Analysis

#### 2.1 Industry Background
SMEs in Mindanao's coconut industry exhibit a high dependence on stable, long-term supply chains. They are uniquely vulnerable to disaster, as the region frequently experiences typhoons and floods that destroy inventory or render transportation routes impassable.

#### 2.2 Core Industry Problems
*For each problem, the platform identifies the limitation in existing solutions and offers a targeted benefit.*
1. **Single-Point of Failure Supply Chains:** *Problem:* SMEs rely on one supplier. *Solution:* B2BackUp maps alternatives. *Benefit:* Instant continuity.
2. **Lack of Automated Recovery:** *Problem:* Manual searching takes weeks. *Solution:* Automated matching algorithm. *Benefit:* Reroute in seconds.
3. **Logistics Blindspots:** *Problem:* A supplier exists, but the road is flooded. *Solution:* Integrated route tracking. *Benefit:* Realistic recommendations.
4. **Permanent Displacement:** *Problem:* Recovering suppliers lose their old buyers. *Solution:* Temporary rerouting with automatic reconnection. *Benefit:* Preserves loyal business ties.
5. **Lack of Disaster Warning:** *Problem:* Reactive instead of proactive. *Solution:* PAGASA/PHIVOLCS integrations. *Benefit:* Early preparation.
6. **Financial Drain During Downtime:** *Problem:* No sales = bankruptcy. *Solution:* Financial health tracking. *Benefit:* Maintained cash flow.
7. **No Standardization in Relief:** *Problem:* LGUs struggle to assess economic damage. *Solution:* LGU Dashboard integration. *Benefit:* Data-driven relief efforts.
8. **Lack of Business Continuity Plans (BCP):** *Problem:* SMEs don't have emergency plans. *Solution:* AI-generated BCPs. *Benefit:* Better disaster readiness.

#### 2.3 Evolution of the Solution
Initial marketplace idea → Emergency recovery platform → Temporary rerouting model.

#### 2.4 Why It Is NOT a Marketplace
Unlike a standard e-commerce or B2B marketplace where businesses constantly hunt for the cheapest prices, B2BackUp **activates only when disruption occurs**. It is designed to preserve existing, trusted business relationships rather than replace them.

#### 2.5 Business Relationship Preservation
The system enforces a strict workflow of: **Temporary rerouting → Business recovery → Automatic reconnection**, ensuring that a disaster doesn't permanently destroy years of trust between a farmer and a processor.

---

### Chapter 3 — Software Requirements Specification (IEEE Style)

#### 3.1 User Classes
- **SME (Business Owner):** Registers business, maps existing supply chains, reports disruptions, accepts recommendations.
- **Buyer:** Registers buying requirements and capacity, receives supplier disruption notifications.
- **Supplier:** Registers available products and capacity, receives buyer disruption notifications.

#### 3.2 User Journeys
- **Buyer:** Receives disruption alert -> Views Top 3 alternative suppliers -> Accepts temporary connection -> Reconnects with original supplier later.
- **Supplier:** Facility flooded -> Reports disaster -> Monitored by LGU -> Recovers and presses "Recovered" -> Buyers reconnect.
- **Logistics Provider:** Updates vehicle status -> Reports blocked roads.
- **LGU/DRRM:** Monitors regional economic health -> Validates disaster zones.
- **Administrator:** Manages system health, approves LGU accounts.

#### 3.3 Functional Requirements (Core subset)
- **FR-01 User Authentication:** Registration and RBAC for SMEs (Buyers/Suppliers). *(Mocked for MVP)*
- **FR-02 Business Profile Management:** Capture business info, product info, and capacity.
- **FR-03 Supply Chain Relationship Mapping:** Allow businesses to register their existing nodes (Supplier -> Processor -> Buyer).
- **FR-04 Disaster Disruption Reporting:** Report supplier or buyer disruptions (e.g., flooded facilities).
- **FR-05 Automated Disruption Detection:** Analyze reports and identify cascading effects on the supply chain.
- **FR-06 Alternative Partner Matching Engine:** Automatically search and rank Top 3 available replacement partners.

#### 3.4 Business Rules
- Matching occurs **only** during declared disruptions.
- Capacity validation must be met (Alternative must have enough stock).
- Partner connections are marked strictly as **temporary**.
- Automatic restoration prompts are sent immediately after the original partner reports recovery.

---

### Chapter 4 — System Design

#### 4.1 System Workflows
- **Complete System Workflow:** Registration → Supply Chain Mapping → Disaster Report → Matching → Logistics → Acceptance → Recovery.
- **Notification Workflow:** Event Triggered → Affected Nodes Identified → Real-time Alert Dispatched (Dashboard/SMS).
- **Buyer/Supplier Recovery Workflow:** Temporary connection established → Original node recovers → Alert sent to temporary connection regarding termination → Re-establishment of original tie.
- **Logistics Workflow:** Transport requested → Route checked against PAGASA/LGU data → Logistics provider confirms availability.

---

### Chapter 5 — Algorithms

#### 5.1 Supply Chain Recovery Algorithm (Ranking Formula)
The matching engine evaluates available partners using a comprehensive, risk-aware ranking and recommendation system.

**Complete Matching Criteria:**
- Distance & Route Availability
- Product compatibility
- Production Capacity
- Current Inventory
- Certifications (e.g., Organic)
- Reliability Score
- Previous transactions
- Lead time
- Logistics availability
- Disaster severity of the alternative partner's region

**AI Recommendation Logic:**
The system will eventually leverage AI for Risk-aware ranking, analyzing historical weather patterns and preventing the recommendation of a partner who is in the projected path of the same typhoon.

---

### Chapter 6 — User Interface

#### 6.1 Dashboard Overview
The main hub provides a holistic view containing:
- **Business Health:** Current operational status.
- **Supply Chain Health:** Green/Yellow/Red indicators of all mapped partners.
- **Risk Score:** Algorithmic vulnerability assessment.
- **Recovery Requests:** Pending temporary connection invites.
- **Notifications:** Real-time disruption alerts.
- **Route Status:** Map overlay of accessible logistics routes.

#### 6.2 Complete UI Flow
`Dashboard → Alert Received → View Recommendation → Inspect Partner Details → Verify Logistics → Confirmation`

---

### Chapter 7 — Database Design *(Future Scope for MVP)*

*Note: For the hackathon MVP, the database is mocked locally on the frontend (e.g., `mockData.ts`) to ensure a flawless and lightning-fast demonstration.*

**Core Tables:**
- `Users`, `Businesses`, `Products`, `Relationships`, `Disruptions`, `RecoveryRequests`.

---

### Chapter 8 — API Design *(Future Scope for MVP)*

*Note: For the MVP, all business logic and matching algorithms are executed locally on the frontend against the mocked state.*

- **Core APIs:** Authentication API, Businesses API, Disruption API, Matching API, Notification API.
- **Disaster API Integrations:** 
  - PAGASA (Weather tracking)
  - PHIVOLCS (Earthquakes/Volcanic activity)
  - LGU feeds (Local disaster declarations)
  - Google Maps / Road status
  - Satellite imagery (future)

---

### Chapter 9 — Security *(Future Scope for MVP)*

- **Authentication:** JWT for secure session management.
- **Authorization:** RBAC ensuring SMEs can only edit their own supply chain.
- **Data Privacy:** Encryption of proprietary business relationships and pricing data.

---

### Chapter 10 — MVP & Future Scope

#### 10.1 Hackathon Demo Flow (Static Prototype)
To ensure reliability and focus entirely on the core value proposition, the MVP is built as a **Static Frontend Application** using hardcoded mock data.

**The Flow:** Registration → Supply Chain Mapping → Disaster Report → Matching → Logistics → Acceptance → Recovery.
*(Note: Logistics and LGU features are simulated or bypassed for the strict MVP).*

---

### Chapter 11 — Business Continuity Module (New)
A dedicated module to ensure SMEs are proactively prepared for disasters before they happen:
- AI-generated Business Continuity Plans (BCP)
- Business Impact Analysis
- Risk Assessment
- Recovery Objectives
- Emergency Contacts
- Recovery Checklist

---

### Chapter 12 — Financial Resilience Module (New)
Helping businesses survive the financial strain of operational downtime:
- Financial Health Score
- Cash Flow Monitoring
- Emergency Funding / Grants Portal
- Loan Readiness
- Cost Optimization algorithms during disruptions

---

### Chapter 13 — Innovation & Competitive Analysis (New)
- **Why B2BackUp is different:** It focuses on preservation, not replacement.
- **Comparison with marketplaces:** Marketplaces are predatory during crises; B2BackUp is protective.
- **Scalability:** Easily expanded from coconuts to rice, corn, and retail supply chains.
- **Commercialization:** Subscription model for large processors, freemium for small farmers.
- **Sustainability & SDG Alignment:** Aligns with UN SDGs 8 (Decent Work), 9 (Industry/Infrastructure), and 11 (Sustainable Cities).

---

### Chapter 14 — Success Metrics (New)
The system's efficacy is measured via:
- Recovery time (Time from disaster report to new connection).
- Matching accuracy.
- Notification latency.
- Supply continuity rate (Percentage of operations salvaged).
- Acceptance rate of recommended partners.

---

### Chapter 15 — Future Enhancements (New)
To scale the platform into a comprehensive, region-wide solution:
- Predictive AI for preemptive supply chain rerouting before a typhoon lands.
- Machine Learning for advanced partner ranking based on historical recovery success.
- IoT integrations for automated inventory destruction reporting.
- Drone-assisted damage assessment tied to LGU validations.
- Automatic disaster detection via social media and satellite scraping.

---

### Appendix
- Use Case Diagram
- Activity Diagram
- Sequence Diagram
- ER Diagram
- Class Diagram
- Data Flow Diagram
- UI Mockups
