import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Team } from 'src/app/core/models/team';
import { Project } from 'src/app/core/models/project';
import { Audit, defaultAudit } from 'src/app/core/models/audit';
import { Member } from 'src/app/core/models/member';
import { generateUniqueId } from '@shared/utils/common.util';

@Injectable({
    providedIn: 'root',
})
export class DataService {
    private dataUrl = 'assets/data.json';

    constructor(private http: HttpClient) { }

    getData(): Observable<{ teams: Team[], members: Member[], projects: Project[] }> {
        return this.http.get<any>(this.dataUrl);
    }

    getTeams(): Observable<Team[]> {
        return this.getData().pipe(
            map(data => data.teams.map(team => this.updateTeamData(team)))
        );
    }

    getMembers(): Observable<Member[]> {
        return this.getData().pipe(
            map(data => data.members.map(member => this.updateMemberData(member)))
        );
    }

    getProjects(): Observable<Project[]> {
        return this.getData().pipe(
            map(data => data.projects.map(project => this.updateProjectData(project)))
        );
    }

    private updateTeamData(team: Team): Team {
        const teamId = team.id ? team.id : generateUniqueId(team.name);
        let audit: Audit = { ...defaultAudit, createdBy: 'System' };
        return { ...team, id: teamId, audit: audit };
    }

    private updateMemberData(member: Member): Member {
        const memberId = member.id ? member.id : generateUniqueId(member.name);
        let audit: Audit = { ...defaultAudit, createdBy: 'System' };
        return { ...member, id: memberId, audit: audit };
    }

    private updateProjectData(project: Project): Project {
        let audit: Audit = { ...defaultAudit, createdBy: 'System' };
        return { ...project, audit: audit };
    }
}