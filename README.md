# Meeting Note Management System
#### Video Demo:  https://youtu.be/l8yuCPkmNqA
#### Description:
The Meeting Note Management System is a web application designed for small IT teams to efficiently track and manage weekly meeting activities and milestones. Built using Angular and Firebase, this system offers role-based access to cater to different team members, including Admins, Team Leaders, Auditors, and Users.

**Key Features:**

- **Role-Based Access Control**:
  - **Admin**: Full access to data management, including team member creation, managing teams and projects, and altering user authorizations. Admins can also view all team members' activities and generate reports.
  - **Team Leader**: Can view their team's weekly activities and submit on behalf of team members who are unable to submit due to leave or other reasons.
  - **Auditor**: Has access to view the weekly activities of all team members across the organization.
  - **User**: Can submit their weekly activities and view their own activity history.

- **Weekly Activity Submissions**: Team members can submit their weekly activities, which can be tracked by the Admin and other relevant roles. Admins can also view and manage these submissions, ensuring all team members' progress is captured.

- **Sign-Up and Registration**: New members can only register if they are pre-defined by an Admin, ensuring security and preventing unauthorized users from accessing the system.

- **Maintenance Page**: A maintenance mode feature can be activated to make the system temporarily inaccessible, allowing only Admins to access the system during redeployment or maintenance periods.

- **Activity History and Reporting**: The system allows users to view their activity history, and Admins can export activities to text format for easy sharing and record-keeping.

The Meeting Note Management System streamlines the process of tracking weekly activities, ensuring transparency, accountability, and effective team coordination. Its flexible features and role-based access enhance productivity and communication within small IT teams.

## How to Run

---

1. Install dependencies:
```bash
  npm install
```

2. Start the application:

```bash
  npm start
```

**Default Credentials:**

- **Super Admin**:
  - Email: `superadmin@gmail.com`
  - Password: `superadmin`

- **Auditor**:
  - Email: `auditor@gmail.com`
  - Password: `auditor`

- **Default User Password**: `P@ger123`

