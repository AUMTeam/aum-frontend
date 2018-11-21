import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import CodeIcon from '@material-ui/icons/Code';
import FaceIcon from '@material-ui/icons/Face';
import RecordVoiceOverIcon from '@material-ui/icons/RecordVoiceOver';
import React from 'react';
import { USER_TYPE_IDS } from './user';
import { ROUTES } from './routes';
import { ProgrammerView } from '../views/ProgrammerView';
import { TechnicalAreaManagerView } from '../views/TechnicalAreaManagerView';
import { RevisionOfficeManagerView } from '../views/RevisionOfficeManagerView';
import { ClientView } from '../views/ClientView';

export const NAVIGATION_HIERARCHY = [
  {
    value: USER_TYPE_IDS.PROGRAMMER,
    routePath: ROUTES.PROGRAMMER,
    label: 'Programmatore',
    component: ProgrammerView,
    drawerIcon: <CodeIcon />,
    tabs: [
      {
        value: 0,
        label: 'Tab 1'
      },
      {
        value: 1,
        label: 'Tab 2'
      }
    ]
  },
  {
    value: USER_TYPE_IDS.TECHNICAL_AREA_MANAGER,
    routePath: ROUTES.TECHNICAL_AREA_MANAGER,
    label: 'Referente area tecnica',
    component: TechnicalAreaManagerView,
    drawerIcon: <RecordVoiceOverIcon />,
    tabs: []
  },
  {
    value: USER_TYPE_IDS.REVISION_OFFICE_MANAGER,
    routePath: ROUTES.REVISION_OFFICE_MANAGER,
    label: 'Responsabile ufficio revisioni',
    component: RevisionOfficeManagerView,
    drawerIcon: <AttachMoneyIcon />,
    tabs: []
  },
  {
    value: USER_TYPE_IDS.CLIENT,
    routePath: ROUTES.CLIENT,
    label: 'Cliente',
    component: ClientView,
    drawerIcon: <FaceIcon />,
    tabs: []
  }
];

export function getRouteForUser(userId, index = 0) {
  const section = NAVIGATION_HIERARCHY.find(
    section => section.value === userId
  );

  return `${decodeUserIdInRoute(userId)}${
    section !== null && section.tabs.length > 0
      ? `/${index}`
      : ''
  }`;
}

function decodeUserIdInRoute(userId) {
  switch (userId) {
    case USER_TYPE_IDS.PROGRAMMER:
      return `${ROUTES.PROGRAMMER}`;
    case USER_TYPE_IDS.TECHNICAL_AREA_MANAGER:
      return `${ROUTES.TECHNICAL_AREA_MANAGER}`;
    case USER_TYPE_IDS.REVISION_OFFICE_MANAGER:
      return `${ROUTES.REVISION_OFFICE_MANAGER}`;
    case USER_TYPE_IDS.CLIENT:
      return `${ROUTES.CLIENT}`;
  }
}
