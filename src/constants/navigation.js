import CodeIcon from '@material-ui/icons/Code';
import FaceIcon from '@material-ui/icons/Face';
import RecordVoiceOverIcon from '@material-ui/icons/RecordVoiceOver';
import SendIcon from '@material-ui/icons/Send';
import React from 'react';
import ClientView from '../views/ClientView';
import CommitsCreationView from '../views/CommitsCreationView';
import SendRequestsCreationView from '../views/SendRequestsCreationView';
import CommitsRevisionView from '../views/CommitsRevisionView';
import SendRequestsRevisionView from '../views/SendRequestsRevisionView';
import RevisionOfficeManagerView from '../views/RevisionOfficeManagerView';
import { ROUTE } from './routes';
import { USER_TYPE_ID } from './user';

export const DESKTOP_DRAWER_WIDTH = '300px';

export const NAVIGATION_HIERARCHY = [
  {
    value: USER_TYPE_ID.PROGRAMMER,
    routePath: ROUTE.PROGRAMMER,
    label: 'Programmatore',
    drawerIcon: <CodeIcon />,
    tabs: [
      {
        value: '0',
        label: 'Richieste di commit',
        component: CommitsCreationView
      },
      {
        value: '1',
        label: 'Richieste di invio',
        component: SendRequestsCreationView
      }
    ]
  },
  {
    value: USER_TYPE_ID.TECHNICAL_AREA_MANAGER,
    routePath: ROUTE.TECHNICAL_AREA_MANAGER,
    label: 'Referente area tecnica',
    drawerIcon: <RecordVoiceOverIcon />,
    tabs: [
      {
        value: '0',
        label: 'Richieste di commit',
        component: CommitsRevisionView
      },
      {
        value: '1',
        label: 'Richieste di invio',
        component: SendRequestsRevisionView
      }
    ]
  },
  {
    value: USER_TYPE_ID.REVISION_OFFICE_MANAGER,
    routePath: ROUTE.REVISION_OFFICE_MANAGER,
    label: 'Responsabile ufficio revisioni',
    component: RevisionOfficeManagerView,
    drawerIcon: <SendIcon />,
    tabs: []
  },
  {
    value: USER_TYPE_ID.CLIENT,
    routePath: ROUTE.CLIENT,
    label: 'Cliente',
    component: ClientView,
    drawerIcon: <FaceIcon />,
    tabs: []
  }
];

/**
 * Gets the default route path for the specified user role.
 */
export function getRelativePathForUserRole(userRoleId, index = 0) {
  const section = NAVIGATION_HIERARCHY.find(section => section.value === userRoleId);

  if (section != null) {
    return `${section.routePath}${section.tabs.length > 0 ? `/${index}` : ''}`;
  } else return '';
}
