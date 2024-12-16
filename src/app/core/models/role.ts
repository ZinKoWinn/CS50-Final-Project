export interface Role {
    label: string;
    value: string;
    color: string;
}

export const roles: Role[] = [
    {
        label: 'Admin Role',
        value: 'ADMIN_ROLE',
        color: 'blue'
    },
    {
        label: 'Teamlead Role',
        value: 'TEAMLEAD_ROLE',
        color: 'purple'
    }, 
    {
        label: 'Auditor Role',
        value: 'AUDITOR_ROLE',
        color: 'purple'
    },
    {
        label: 'User Role',
        value: 'USER_ROLE',
        color: 'green'
    }
]