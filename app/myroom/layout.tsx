"use client"
import "@/styles/globals-red-theme.css"
/* eslint-disable react/jsx-props-no-spreading */
import { useState, useCallback, useEffect } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import {
  WebsocketContext
} from '@/app/contexts/Context';

import { RID } from '@/utils/utils';

import Image from "next/image"

import { Separator } from '@/components/ui/separator';
import { SidebarNav } from './components/sidebar-nav';
import { Toaster } from "@/components/ui/sonner"


const sidebarNavItems = [
  {
    title: "Whiteboard",
    href: "/myroom",
  },
  // {
  //   title: "Game Mode",
  //   href: "/myroom/game",
  // },
  // {
  //   title: "Tapestry",
  //   href: "/examples/forms/appearance",
  // },
  // {
  //   title: "Notifications",
  //   href: "/examples/forms/notifications",
  // },
  // {
  //   title: "Display",
  //   href: "/examples/forms/display",
  // },
]

interface SettingsLayoutProps {
  children: React.ReactNode
}

// @ts-ignore
export default function MainLayout({ children}) {

  const [socketUrl, setSocketUrl] = useState('wss://a7uirjun9k.execute-api.us-east-2.amazonaws.com/stage-test-0-eqy3zt-KMrU6-117be9d/');
  const [messageHistory, setMessageHistory] = useState([]);
  const [websocketID, setWebsocketID] = useState();

  const {
    sendMessage,
    sendJsonMessage,
    lastMessage,
    lastJsonMessage,
    readyState,
    getWebSocket,
  } = useWebSocket(socketUrl, {
    onOpen: () => console.log('opened'),
    // Will attempt to reconnect on all close events, such as server shutting down
    shouldReconnect: (closeEvent) => true,
  });

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];


  const handleSendJsonMessage = useCallback((json: any) => sendJsonMessage(json), []);

  const handleDisconnect = () => {
    const json = {
        "action": "request",
        _disconnect: true,
    };

    handleSendJsonMessage(json);
  };
  

  useEffect(() => {
    if (lastJsonMessage !== null) {
      // console.log('lastJsonMessage: ', lastJsonMessage)
      // @ts-ignore
      setMessageHistory((prev) => prev.concat(lastJsonMessage));
    }
  }, [lastJsonMessage, setMessageHistory]);

  useEffect(() => {
    // @ts-ignore
    setWebsocketID(RID());
  }, [])

  useEffect(() => {

    const beforeunloadCallback = (ev: Event | undefined) => {
      console.log("onbeforeunload");
      const e = ev || window.event;
      //console.log(e)

      // @ts-ignore
      e.preventDefault();
      if (e) {
        // @ts-ignore
        e.returnValue = ''
      }
      return '';
    };

    const unloadCallback = (ev: Event | undefined) => {
      console.log("onunload");
      // handleDisconnect();
    };

    window.addEventListener("beforeunload", beforeunloadCallback);
    window.addEventListener("unload", unloadCallback);
    return () => {
      //cleanup function
      window.removeEventListener("beforeunload", beforeunloadCallback);
      window.removeEventListener("unload", unloadCallback);
    }
  });

  return (
    <>
      <div className="md:hidden">
        {/* <Image
          src="/examples/forms-light.png"
          width={1280}
          height={791}
          alt="Forms"
          className="block dark:hidden"
        />
        <Image
          src="/examples/forms-dark.png"
          width={1280}
          height={791}
          alt="Forms"
          className="hidden dark:block"
        /> */}
      </div>
      <div className="space-y-6 p-10 pb-16 md:block">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight text-primary">myroom</h2>
          <p className="text-muted-foreground">
            Wherever you are, myroom is not so far away
          </p>
        </div>
        <Separator className="my-6" />
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="-mx-4 lg:w-1/5">
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <WebsocketContext.Provider value={[messageHistory, setMessageHistory, handleSendJsonMessage, lastJsonMessage, readyState, connectionStatus, getWebSocket, websocketID]}>
            <div className="flex-1 lg:max-w-2xl">{children}</div>
          </WebsocketContext.Provider>
        </div>
        <Toaster />
      </div>
    </>
  )
}
