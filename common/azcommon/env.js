/*
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
!!!!!!!!!!!!!!!!!!!!!!WARNING!!!!!!!!!!!!!!!!!!!!!!

This library may be included by front-end code,
please DO NOT put any sensitive information here.

!!!!!!!!!!!!!!!!!!!!!!WARNING!!!!!!!!!!!!!!!!!!!!!!
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/

import getServerEnvName from '~/getServerEnvName';

let ServerEnvName = getServerEnvName();

export {
  ServerEnvName as ServerEnvName,
}
