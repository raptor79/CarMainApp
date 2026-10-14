# Car Maintenance App Upgrade Plan

This document outlines the planned upgrades for the car maintenance app, grouped by priority and implementation complexity. The app is already mobile-first and iPhone-friendly, so the roadmap focuses on product value, user experience, and secure, maintainable feature growth.

---

## Priority: High

### High / Low Complexity

#### 1. Add service reminder fields for recurring maintenance
- Add optional reminder settings for each service:
  - next service mileage
  - next service date
- Display reminder details alongside each maintenance record
- Allow users to choose either mileage-based, date-based, or both

#### 2. Sort maintenance history newest to oldest
- Sort history by service date, with the newest service first
- Keep the order consistent after records are added or removed
- Use higher mileage as a tie-breaker when service dates match

#### 3. Add calendar reminder integration
- Ask the user before creating a calendar reminder
- Request calendar permission only when needed
- Create an event for the next service date in the iPhone calendar
- Keep reminder creation visible and understandable for end users

#### 4. Improve iPhone UX and accessibility
- Increase touch target sizes for buttons and inputs
- Adjust spacing for smaller iPhone screens
- Improve accessibility labels and readable contrast
- Support dark mode and dynamic text sizing

#### 5. Add privacy and security defaults
- Implement secure local storage
- Minimize stored personal data
- Add clear consent for notifications and calendar access
- Provide deletion and data-export controls

### High / Medium Complexity

#### 6. Add maintenance reminders and due-date logic
- Show “due soon,” “overdue,” and “healthy” vehicle status
- Calculate next service based on mileage or date
- Trigger reminder alerts before a service is due
- Support custom reminder windows such as 7 days or 500 miles

#### 7. Add multi-vehicle support
- Allow users to store more than one vehicle
- Show separate service histories per car
- Track each vehicle’s mileage and reminders independently
- Add a garage dashboard overview

#### 8. Add expense tracking and budgets
- Track costs by category
- Show monthly and yearly maintenance totals
- Add budget warnings for expensive service periods
- Calculate average maintenance cost per vehicle

### High / High Complexity

#### 9. Add cloud sync and account-based backup
- Allow secure login and account sync
- Sync maintenance records across devices
- Add cloud backup for service history
- Implement secure authentication and session handling

#### 10. Add photo and invoice management
- Let users attach service receipts or photos
- Store images securely and optionally remove metadata
- Allow filtering records by receipts or service type
- Support invoice review from the service history screen

---

## Priority: Medium

### Medium / Low Complexity

#### 11. Add search and filtering
- Search by service name, date, or notes
- Filter by service type, mileage, or cost
- Sort by newest, oldest, or highest cost
- Improve records browsing on mobile screens

#### 12. Add recurring service templates
- Predefine common maintenance routines
- Let users save custom service templates
- Auto-fill recurring service details for common tasks
- Reduce manual entry for repeated services

#### 13. Add better form validation
- Validate mileage, cost, and dates before saving
- Prevent invalid service entries
- Show helpful inline error messages
- Improve data quality and reliability

### Medium / Medium Complexity

#### 14. Add service calendar view
- Show upcoming maintenance in a calendar format
- Highlight due dates and overdue items
- Allow quick access to service records from the calendar
- Improve long-term maintenance planning

#### 15. Add maintenance history insights
- Show service frequency trends
- Highlight most expensive repair categories
- Compare repair costs over time
- Display average time between services

### Medium / High Complexity

#### 16. Add export and reporting features
- Export service history as CSV or PDF
- Generate annual maintenance summaries
- Share records with mechanics or service providers
- Support professional use cases and reporting

---

## Priority: Low

### Low / Low Complexity

#### 17. Add polish improvements and animations
- Add subtle transitions and micro-interactions
- Improve empty-state screens
- Refine list cards and spacing consistency
- Increase the premium feel of the app

#### 18. Add service notes templates
- Include reusable notes blocks for common maintenance work
- Reduce typing for maintenance comments
- Improve consistency across service entries

### Low / Medium Complexity

#### 19. Add advanced reminders and notifications
- Push notifications for upcoming services
- Custom reminder channels and schedules
- Local reminder batching for multiple vehicles
- Reminder preferences per service type

### Low / High Complexity

#### 20. Add AI-powered service suggestions
- Recommend service intervals based on historical data
- Detect patterns in maintenance records
- Suggest likely next maintenance actions
- Help users plan servicing more proactively

---

## Suggested Release Roadmap

### Phase 1: Immediate improvements
- Reminder fields for next service
- Chronological maintenance history, newest service first
- Calendar reminder confirmation
- iPhone UX and accessibility improvements
- Security and privacy defaults

### Phase 2: Core product value
- Due-date logic and maintenance reminders
- Multi-vehicle support
- Budget and expense tracking
- Search and filtering

### Phase 3: Expansion and scale
- Cloud sync and backups
- Photo/invoice management
- Reporting and exports
- Calendar and insights features

### Phase 4: Advanced product features
- AI suggestions
- Premium reporting
- Deeper integrations and notifications

---

## Recommended Delivery Strategy

1. Prioritize the highest-user-value features first.
2. Keep each upgrade focused and testable.
3. Validate iPhone performance after every major release.
4. Treat privacy, security, and accessibility as release requirements, not optional extras.
5. Use small iterative releases rather than large feature bundles.

---

## Summary

The best near-term upgrades are the ones that improve maintenance planning and reliability for users while staying aligned with iPhone usability and secure app design. The highest value roadmap is:

- reminder fields
- newest-to-oldest maintenance history
- calendar integration
- due-date logic
- multi-vehicle support
- expense tracking
- privacy and security improvements

These upgrades create a usable, practical maintenance app while keeping the architecture and user experience scalable for future growth.
