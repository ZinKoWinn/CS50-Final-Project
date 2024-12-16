import { Injectable } from '@angular/core';
import * as IntroJs from 'intro.js/intro.js';
import { AuthorizeService } from '@shared/services/authorize-service';

@Injectable({
    providedIn: 'root',
})
export class AppTourService {
    constructor(private authorizeService: AuthorizeService) { }

    commonViewSteps(): any[] {
        let commonStep: any[] = [
            {
                intro: 'Welcome to meeting note management application! This guided tour will help you navigate through the features of the sidebar and main content area.',
            }
        ];

        if (!this.authorizeService.isAdmin) {
            commonStep.push({
                element: document.querySelector('.user-wrapper-container'),
                intro: 'View your user information and find the logout option here.',
                position: 'right',
            }
            );
        }

        commonStep.push(
            {
                element: document.querySelector('#weekly'),
                intro: 'Explore weekly meeting notes here.',
                position: 'right',
            },
            {
                element: document.querySelector('#monthly'),
                intro: 'Explore monthly meeting notes here.',
                position: 'right',
            },
            {
                element: document.querySelector('#viber-noti'),
                intro: 'Click for Viber notification channel (optional).',
                position: 'right',
            },
            {
                element: document.querySelector('.ant-layout-sider-trigger'),
                intro: 'Expand sidebar width with a click.',
                position: 'auto',
            },
            {
                element: document.querySelector('#My-Note'),
                intro: 'Submit your weekly meeting notes here.',
                position: 'auto',
            },
            {
                element: document.querySelector('#project-name-input'),
                intro: 'Type the project name, and auto-complete suggestions will appear. Feel free to add your own if necessary',
                position: 'auto',
            },
            {
                element: document.querySelector('#note-input'),
                intro: 'Type meeting notes for the chosen project.',
                position: 'auto',
            },
            {
                element: document.querySelector('#clear'),
                intro: 'To clear the meeting note form, click here or use the shortcut Ctrl + Q.',
                position: 'left',
            },
            {
                element: document.querySelector('#submit'),
                intro: 'To submit the meeting note, click here or use the shortcut Ctrl + Enter.',
                position: 'left',
            }
        );
        return commonStep;
    }

    getTeamLeadViewStep(): any[] {
        return this.commonViewSteps().concat(
            {
                element: document.querySelector('#Team-Members-Notes'),
                intro: 'View your team members weekly meetings here.',
                position: 'auto',
            },
        );
    }

    getAdminViewStep(): any[] {
        return this.commonViewSteps().concat(
            {
                element: document.querySelector('#Team-Members-Notes'),
                intro: 'View your team members weekly meeting notes here.',
                position: 'auto',
            },
            {
                element: document.querySelector('#All-Members-Notes'),
                intro: 'View all members weekly meeting notes here.',
                position: 'auto',
            },
        );
    }

    meetingNoteTour(): void {
        let introObj = new IntroJs();
        introObj.setOptions({
            disableInteraction: true,
            dontShowAgain: true,
            exitOnOverlayClick: false,
            steps: this.authorizeService.isAdmin ? this.getAdminViewStep() : this.authorizeService.isTeamLead ? this.getTeamLeadViewStep() : this.commonViewSteps(),
        }).start();
    }

    signInTour(): void {
        let introObj = new IntroJs();
        introObj.setOptions({
            disableInteraction: true,
            exitOnOverlayClick: false,
            dontShowAgain: true,
            steps: [
                {
                    intro: 'Welcome to our meeting note application! This guided tour will help you get started with the "Sign In" process.',
                },
                {
                    element: document.querySelector('#sign-up'),
                    intro: 'If you do not have an account, you can click here to sign up.',
                    position: 'right',
                },
                {
                    element: document.querySelector('#email'),
                    intro: 'Enter your email address here.',
                    position: 'auto',
                },
                {
                    element: document.querySelector('#password'),
                    intro: 'Enter your password here.',
                    position: 'auto',
                },
                {
                    element: 'button[nzType="primary"]',
                    intro: 'Finally, click this button to sign in!',
                    position: 'auto',
                },
                {
                    element: document.querySelector('.login-form-forgot'),
                    intro: 'If you forgot your password, you can click here to recover it.',
                    position: 'right',
                }
            ],
        }).start();
    }

    signUpTour(): void {
        let introObj = new IntroJs();
        introObj.setOptions({
            disableInteraction: true,
            exitOnOverlayClick: false,
             dontShowAgain: true,
            steps: [
                {
                    intro: 'Welcome to our meeting note application! This guided tour will help you "Sign Up" for a new account.',
                },
                {
                    element: document.querySelector('#sign-in'),
                    intro: 'If you already have an account, you can click here to sign in.',
                    position: 'auto',
                },
                {
                    element: document.querySelector('input[formControlName="email"]'),
                    intro: 'Enter your valid email address where you can receive messages.',
                    position: 'auto',
                },
                {
                    element: document.querySelector('nz-select[formControlName="name"]'),
                    intro: 'Choose a display name from the dropdown.',
                    position: 'auto',
                },
                {
                    element: document.querySelector('#password'),
                    intro: 'Enter a password for your account.',
                    position: 'auto',
                },
                {
                    element: document.querySelector('#confirm-password'),
                    intro: 'Enter a confirm password for your account.',
                    position: 'auto',
                },
                {
                    element: document.querySelector('button[nzType="primary"]'),
                    intro: 'Click this button to create your account.',
                    position: 'auto',
                }
            ],
        }).start();
    }
}