# Context & Ubiquitous Language

This glossary establishes the canonical corporate, operational, and project governance definitions for the automated sales-engineering factory. All synthesized metrics, case validations, and resume outputs must align strictly with these parameters.

## Core Corporate Profiles
**companyName**:
The official legal name of the prospective enterprise targeted for optimization.
_Avoid_: Prospect, firm, client, lead

**sector**:
The specific macroeconomic or industrial domain the business occupies (e.g., Financial Services, Aerospace, Healthcare).
_Avoid_: Domain, area, vertical

## Operational Strategy
**painPoint**:
A glaring, measurable operational process waste (Muda) causing margin erosion, data leakage, or systemic execution bottlenecks inside the target company's current architecture.
_Avoid_: Problem, issue, bug

**solution**:
The bleeding-edge, sovereign full-stack software application built to eliminate the identified painPoint via zero-trust scoping, deep modules, and event-driven automation.
_Avoid_: Software, fix, script

## Financial Engineering
**beforeCost**:
The cost of ongoing enterprise operations under the prospective company's legacy, unoptimized workflow before implementing the solution.
_Avoid_: Old cost, legacy expense, beforeProfits

**afterCosts**:
The cost of ongoing enterprise operations realized after implementing the optimized automation/AI solution.
_Avoid_: New cost, target expense, afterProfits

**netSavings**:
The annual net financial savings achieved by deducting `afterCosts` from `beforeCost` (`beforeCost - afterCosts`).
_Avoid_: Total profit, margin bump

**investmentCost**:
The total calculated baseline cost required to fully build, verify, deploy, and scale the solution inside the target environment.
_Avoid_: Price, quote, bill

## Project Control & Governance (EVM & SAFe)
**cpi (Cost Performance Index)**:
A measure of the project's financial efficiency, calculated as Earned Value (EV) divided by Actual Cost (AC). A value ≥ 1.0 indicates the deployment is tracking on or under the fixed budget baseline.
_Avoid_: Budget score, cost tracking

**spi (Schedule Performance Index)**:
A measure of the project's velocity efficiency, calculated as Earned Value (EV) divided by Planned Value (PV). A value ≥ 1.0 indicates the vertical slice implementation is tracking on or ahead of the schedule baseline.
_Avoid_: Speed metric, progress rate

**piPredictability (Program Increment Predictability Measure / Historical Delivery Reliability)**:
The percentage ratio of business value delivered against total planned value committed during Scaled Agile (SAFe) Program Increment (PI) planning loops.

---

## Cardinality & Context Relationships
- A single **companyName** operates within one **sector** and experiences an active **painPoint**.
- The **solution** resolves the **painPoint**, reducing **beforeCost** down to **afterCosts** to generate net savings and justify the **investmentCost**.
- Project execution is continuously audited and verified against the **cpi**, **spi**, and **piPredictability** guardrails.
