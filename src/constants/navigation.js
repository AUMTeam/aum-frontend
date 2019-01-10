import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import CodeIcon from '@material-ui/icons/Code';
import FaceIcon from '@material-ui/icons/Face';
import RecordVoiceOverIcon from '@material-ui/icons/RecordVoiceOver';
import React from 'react';
import ClientView from '../views/ClientView';
import ProgrammerView from '../views/ProgrammerView';
import RevisionOfficeManagerView from '../views/RevisionOfficeManagerView';
import TechnicalAreaManagerView from '../views/TechnicalAreaManagerView';
import { ROUTE } from './routes';
import { USER_TYPE_ID } from './user';

export const DESKTOP_DRAWER_WIDTH = '300px';

export const NAVIGATION_HIERARCHY = [
  {
    value: USER_TYPE_ID.PROGRAMMER,
    routePath: ROUTE.PROGRAMMER,
    label: 'Programmatore',
    component: ProgrammerView,
    drawerIcon: <CodeIcon />,
    tabs: [
      {
        value: "0",
        label: 'Commit'
      },
      {
        value: "1",
        label: 'Richieste di invio'
      }
    ]
  },
  {
    value: USER_TYPE_ID.TECHNICAL_AREA_MANAGER,
    routePath: ROUTE.TECHNICAL_AREA_MANAGER,
    label: 'Referente area tecnica',
    component: TechnicalAreaManagerView,
    drawerIcon: <RecordVoiceOverIcon />,
    tabs: []
  },
  {
    value: USER_TYPE_ID.REVISION_OFFICE_MANAGER,
    routePath: ROUTE.REVISION_OFFICE_MANAGER,
    label: 'Responsabile ufficio revisioni',
    component: RevisionOfficeManagerView,
    drawerIcon: <AttachMoneyIcon />,
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
export function getRouteForUser(userRoleId, index = 0) {
  const section = NAVIGATION_HIERARCHY.find(section => section.value === userRoleId);

  if (section != null) {
    return `${section.routePath}${section.tabs.length > 0 ? `/${index}` : ''}`;
  } else return '';
}
