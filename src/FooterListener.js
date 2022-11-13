import React, { Component, useState, useEffect, useContext } from "react";

import Event from './Event';
import RemotePushController from './RemotePushController';

function FooterListener({ props, paramsCheck = null }) {
  //alert(JSON.stringify(paramsCheck));
  const [currentScreen, setCurrentScreen] = useState(props.route.name);
  //alert(props.route.name);

  return (
    <>
      <Event props={props} paramsCheck={paramsCheck} />
      <RemotePushController props={props} />
    </>
  );
}

export default FooterListener;
