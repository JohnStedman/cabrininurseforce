Figma Component List – Providers Module
1. Page-Level Components
Providers List Page

Main table view showing all providers.

Components required:

Page header

Search bar

Filter dropdown

Provider table

Add provider button

Pagination controls

Empty state

Loading state

Layout sections:

Header
Search + Filters
Provider Table
Pagination
Provider Details Page

Main management screen for a single provider.

Components required:

Page header

Provider summary card

Tab navigation

Tab content container

Tabs:

Overview

Contacts

Contractors

Priority Settings

Activity Log

2. Table Components
Provider Table

Reusable table component.

Columns:

Provider Name

Status Badge

Priority Tier

Contractor Count

Primary Contact

Last Updated

Action Menu

Table row interactions:

Click row → open provider details

Action menu → edit / deactivate

Contractor Table

Used inside Provider → Contractors tab.

Columns:

Contractor Name

Job Role

Skills

Compliance Status

Do Not Send Badge

Status

Actions

Badges required:

Compliant

Expiring Soon

Non-Compliant

Do Not Send

Provider Contacts Table

Columns:

Name

Email

Phone

Role

Status

Actions

3. Cards
Provider Summary Card

Fields:

Provider Name

Status Badge

Address

Phone

Email

Priority Tier

Contractor Count

Actions:

Edit Provider

Deactivate Provider

4. Badges / Tags

Design system components required:

Status Badges

Active

Inactive

Compliance Badges

Compliant

Expiring Soon

Expired

Missing

Worker Flags

Do Not Send

Priority Badges

Priority 1

Priority 2

Priority 3

5. Buttons

Required button variants:

Primary:

Add Provider

Save

Add Contractor

Add Contact

Secondary:

Edit

Cancel

View Details

Destructive:

Remove Contractor

Deactivate Provider

Icon buttons:

Edit

Delete

More Actions (⋯)

6. Forms
Add Provider Form

Fields:

Provider Name

Status

Address

Phone

Email

Notes

Priority Tier

Actions:

Save

Cancel

Add Provider Contact Form

Fields:

Name

Email

Phone

Role

Actions:

Send Invitation

Save

Add Contractor to Provider

Fields:

Contractor Name

Job Role

Skills

Classification

Compliance documents upload

Do Not Send toggle

Actions:

Save

Cancel

7. Modals

Design reusable modal components.

Add Provider Modal

Fields:

Provider details

Actions:

Save

Cancel

Add Contact Modal

Fields:

Contact details

Actions:

Send Invite

Cancel

Confirm Deactivate Modal

Text:

"Are you sure you want to deactivate this provider?"

Actions:

Confirm

Cancel

8. Filters

Required filters:

Provider list filters:

Status

Priority Tier

Has Contractors

Recently Updated

Contractor filters:

Compliance Status

Job Role

Skills

Do Not Send

9. Search Components

Reusable search bar with:

keyword search

clear button

search icon

Searchable fields:

provider name

contractor name

contact name

10. Navigation Components
Tab Navigation

Tabs:

Overview

Contacts

Contractors

Priority Settings

Activity Log

States:

Active

Hover

Disabled

11. Priority Settings UI

Components required:

Priority Tier Selector

Options:

Tier 1

Tier 2

Tier 3

Release Window Settings

Fields:

Release delay (minutes)

Exclusive access time

Rule Table

Columns:

Tier

Release Delay

Providers Included

Status

12. Activity Log Component

Timeline or table view.

Fields:

Timestamp

Action

User

Object affected

Details

Examples:

Provider updated

Contractor added

Priority rule changed

13. Alerts & Notifications

Design components for:

Warning alerts

Examples:

Compliance expiring soon

Contractor flagged Do Not Send

Info alerts

Examples:

Provider priority updated

Contractor added successfully

14. Empty States

Design empty states for:

No providers

No contacts

No contractors

No priority rules

Each should include:

illustration or icon

explanation text

action button

Example:

No Providers Yet

Create your first provider organisation to begin managing contractors.

[ Add Provider ]
15. Loading & Error States

Design skeleton loaders for:

provider table

contractor table

provider details

Error states:

failed to load providers

failed to save changes

Recommended Figma Page Structure

Design file pages:

01 Design System
02 Providers List
03 Provider Details
04 Contacts
05 Contractors
06 Priority Settings
07 Modals
08 States (Empty / Loading / Error)