Dashboard – Description (Figma Design Notes)
Purpose

The Dashboard provides administrators and operations users with a high-level operational overview of the system.

It surfaces key operational metrics, alerts, and quick actions related to:

Jobs and bookings

Provider contractors

Compliance status

Provider availability

Unfilled shifts

Cost visibility

The dashboard allows users to quickly identify operational risks and take action, such as filling jobs, resolving compliance issues, or reviewing provider activity.

Screen Layout

The dashboard should be structured into four main sections:

Summary Metrics

Operational Alerts

Job & Booking Activity

Provider & Contractor Insights

Layout example:

Header
Summary Metrics Row
Alerts / Notifications Panel
Jobs & Booking Overview
Provider / Contractor Insights
Recent Activity
1. Summary Metrics Section

Provides high-level operational statistics.

Displayed as metric cards.

Metrics
Metric	Description
Open Jobs	Jobs not yet filled
Jobs Filled Today	Jobs successfully booked today
Active Providers	Number of active provider organisations
Active Contractors	Number of available provider contractors
Compliance Issues	Contractors with missing or expired compliance
Upcoming Shifts	Shifts scheduled in next 24 hours
Card Behaviour

Each card should:

display numeric metric

include icon

link to relevant section

show trend indicator (optional)

Example card:

Open Jobs
12
↑ +3 since yesterday
2. Operational Alerts

Highlights issues requiring attention.

Displayed as a notification panel or alert cards.

Alerts include

Jobs approaching start time without booking

Contractors with expiring compliance

Contractors flagged Do Not Send

Providers with no available contractors

Failed job releases

Alert structure
Field	Description
Alert Type	Compliance / Job / Provider
Description	Alert message
Related Object	Contractor / Job
Action Button	Resolve / View

Example:

Compliance Expiring
3 contractors have documents expiring within 7 days
[ View Contractors ]
3. Job & Booking Activity

Provides a quick view of job distribution and booking performance.

Displayed as tables and charts.

Sections
Unfilled Jobs

Table fields:

Field	Description
Job ID	Job reference
Location	Job location
Start Time	Shift start
Status	Open / Released
Provider Release Tier	Current release stage
Actions	View / Assign
Jobs Released to Providers

Shows staged release status.

Fields:

Field	Description
Job ID	Job reference
Provider Tier	Current release level
Providers Notified	Number notified
Time Released	Timestamp
Booking Activity

Metrics such as:

jobs filled today

jobs filled by providers

jobs filled by field staff

Displayed as small chart or summary table.

4. Provider & Contractor Insights

Shows the health of the provider network.

Provider Overview

Table fields:

Field	Description
Provider Name	Organisation
Contractors	Number of contractors
Active Contractors	Currently available
Compliance Issues	Contractors with issues
Priority Tier	Job release priority
Contractor Compliance Overview

Displays compliance summary.

Example:

Compliant Contractors
85

Expiring Soon
9

Non-Compliant
4

Can be displayed as:

donut chart

status cards

5. Recent Activity

Shows the most recent system actions.

Fields:

Field	Description
Time	Timestamp
Action	Event description
User	Who performed action
Object	Provider / Contractor / Job

Examples:

Contractor added

Provider priority updated

Job assigned

Compliance document uploaded

Figma Component List – Dashboard
1. Page Components

Required components:

Page header

Dashboard grid layout

Summary cards row

Alert panel

Activity panels

Tables

Charts

2. Metric Cards

Reusable component.

Fields:

icon

metric number

label

trend indicator

optional action link

Examples:

Open Jobs

Active Providers

Compliance Issues

3. Alert Cards

Alert component variants:

Warning

Compliance expiring soon

Critical

Unfilled shifts

Info

Provider activity

Alert structure:

Icon
Title
Description
Action Button
4. Tables
Unfilled Jobs Table

Columns:

Job ID

Location

Start Time

Status

Provider Tier

Actions

Provider Overview Table

Columns:

Provider

Contractors

Active

Compliance Issues

Priority Tier

Recent Activity Table

Columns:

Time

Event

User

Object

5. Charts

Charts should include:

Booking Performance Chart

Shows:

jobs filled

jobs unfilled

jobs released

Chart type:

bar chart or line chart

Compliance Overview Chart

Shows contractor compliance status.

Chart type:

donut chart

Segments:

Compliant

Expiring Soon

Non-Compliant

6. Filters

Global dashboard filters:

Date range

Provider

Location

Job type

7. Quick Action Buttons

Displayed in header or top-right.

Buttons:

Create Job

Add Provider

Add Contractor

View Job Board

8. Empty States

Design empty states for:

No open jobs

No alerts

No providers

No recent activity

Example:

No Open Jobs

All jobs have been filled.

[ Create Job ]
9. Loading States

Skeleton loaders for:

metric cards

tables

charts

Recommended Dashboard Grid Layout

Use a 12-column grid layout.

Example structure:

Row 1: Metric Cards (6 cards)
Row 2: Alerts Panel (full width)
Row 3: Unfilled Jobs (8 columns) + Compliance Chart (4 columns)
Row 4: Provider Overview (8 columns) + Activity Feed (4 columns)
Figma Page Structure

Recommended file structure:

01 Design System
02 Dashboard
03 Dashboard Components
04 Charts
05 Tables
06 Alerts
07 States (Empty / Loading / Error)