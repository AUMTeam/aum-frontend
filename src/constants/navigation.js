import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import CodeIcon from '@material-ui/icons/Code';
import FaceIcon from '@material-ui/icons/Face';
import RecordVoiceOverIcon from '@material-ui/icons/RecordVoiceOver';
import React from 'react';
import { ROUTES } from './routes';
import { USER_TYPE_IDS } from './user';

export const NAVIGATION_HIERARCHY = [
  {
    value: USER_TYPE_IDS.PROGRAMMER,
    routePath: ROUTES.PROGRAMMER,
    label: 'Programmatore',
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
    drawerIcon: <RecordVoiceOverIcon />,
    tabs: []
  },
  {
    value: USER_TYPE_IDS.REVISION_OFFICE_MANAGER,
    routePath: ROUTES.REVISION_OFFICE_MANAGER,
    label: 'Responsabile ufficio revisioni',
    drawerIcon: <AttachMoneyIcon />,
    tabs: []
  },
  {
    value: USER_TYPE_IDS.CLIENT,
    routePath: ROUTES.CLIENT,
    label: 'Cliente',
    drawerIcon: <FaceIcon />,
    tabs: []
  }
];
