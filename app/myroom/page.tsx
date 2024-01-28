"use client"

/* eslint-disable react/jsx-props-no-spreading */
import { useState, useCallback, useEffect, useContext, useRef } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { debounce } from 'lodash';
import {
  WebsocketContext
} from '@/app/contexts/Context';

import { useTheme } from "next-themes"

import { ThemeCustomizer } from "./components/theme-customizer"
 
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

import { RID, calcMatrixIndex } from '@/utils/utils';
import { Separator } from '@/components/ui/separator';

// @ts-ignore
export default function Whiteboard({ className, ...props }) {

    const [websocketRMID, setWebsocketRMID] = useState('myroom-matrix');
    const [messageHistory, setMessageHistory, handleSendJsonMessage, lastJsonMessage, readyState, connectionStatus, getWebSocket, websocketID] = useContext(WebsocketContext);


    const _colors = {
        rose:   {
            hsl: [346.8, 0.772, 0.498],
            scm: [8, 1, 3],
            tw: "hsl(346.8, 77.2%, 49.8%)",
        },
        orange: {
            hsl: [20.5, 0.902, 0.482],
            scm: [8, 3, 0],
            tw: "hsl(20.5, 90.2%, 48.2%)",
        },
        green: {
            hsl: [142.1, 0.706, 0.453],
            scm: [1, 7, 3],
            tw: "hsl(142.1, 70.6%, 45.3%)",
        },
        blue: {
            hsl: [217.2, 0.912, 0.598],
            scm: [2, 5, 9],
            tw: "hsl(217.2, 91.2%, 59.8%)",
        },
        yellow: {
            hsl: [47.9, 0.958, 0.531],
            scm: [9, 7, 1],
            tw: "hsl(47.9, 95.8%, 53.1%)",
        },

        violet: {
            hsl: [263.4, 0.70, 0.504],
            scm: [4, 1, 8],
            tw: "hsl(263.4, 70%, 50.4%)",
        },
    };

    const _bg_colors = {
        light: {
            hsl: [0, 0, 1],
            scm: [4, 4, 4],
            tw: "hsl(0, 0%, 100%)",
        },
        dark: {
            hsl: [0, 0, 0],
            scm: [0, 0, 0],
            tw: "hsl(0, 0%, 0%)",
        },
    };


    const rows = 65;
    const cols = 46;

    const { resolvedTheme: mode } = useTheme()

    const [selectedColor, setSelectedColor] = useState("rose");
    const [backgroundColor, setBackgroundColor] = useState(mode);
    const [dragging, setDragging] = useState(false);
    const [update, setUpdate] = useState(RID());
    const gridRef = useRef(Array.from(Array(cols), () => new Array(rows).fill(null)));
    const gridChangesRef = useRef({});

    // Function to handle mouse enter event
    const handleMouseEnter = (col, row) => {
        if (dragging) {
            gridRef.current[col][row] = selectedColor; // Update hover state
            // @ts-ignore
            gridChangesRef.current[calcMatrixIndex(col, row, rows)] = selectedColor;
        }
        setUpdate(RID());
    };

    // Function to handle mouse leave event
    // const handleMouseLeave = (col, row) => {
    //     // hoverGridRef.current[row][col] = false; // Update hover state
    // };

    // Function to handle drag start event
    const handleDragStart = (col, row) => {
        gridRef.current[col][row] = selectedColor; // Update hover state
        // @ts-ignore
        gridChangesRef.current[calcMatrixIndex(col, row, rows)] = selectedColor;
        // sendGridChangesDebounced();
        setUpdate(RID());
        setDragging(true);
        console.log('start')
    };

    // Function to handle drag end event
    const handleDragEnd = () => {
        setDragging(false);
        sendGridChanges();
        console.log('end')
    };

    const notifications = [
        {
            title: "Your call has been confirmed.",
            description: "1 hour ago",
        },
        {
            title: "You have a new message!",
            description: "1 hour ago",
        },
        {
            title: "Your subscription is expiring soon!",
            description: "2 hours ago",
        },
    ];

    // @ts-ignore
    const formatAndSendMsg = ({ _set, _get, _notification }) => {
        const json = {
            "action": "request",
            "rm": websocketRMID,
            _set: _set || undefined,
            _get: _get || undefined,
            _notification: _notification || undefined,
        };

        handleSendJsonMessage(json);
    };

    const sendGridChanges = () => {
        const arr = []
        for(const [index, color] of Object.entries(gridChangesRef.current)) {
            arr.push(...[parseInt(index), ..._colors[color].scm])

            // clearing what was drawn
            // @ts-ignore
            delete gridChangesRef.current[index];
        }

        console.log('arr: ', arr)

        // @ts-ignore
        formatAndSendMsg({
            _notification: { "points": arr }
        })
    }

    const sendBackgroundChanges = (mde) => {
        const scm = _bg_colors[mde]?.scm;
        console.log("background scm: ", scm);

        if (scm) {
            // @ts-ignore
            formatAndSendMsgDebounced({
                _notification: { "background": scm }
            })
        }
        
    };

    const clearPixels = () => {
        console.log("clear pixels")
        sendClearPixels(backgroundColor)
        gridRef.current = Array.from(Array(cols), () => new Array(rows).fill(null))
        setUpdate(RID());
    };

    const sendClearPixels = (mde) => {
        const scm = _bg_colors[mde]?.scm;
        console.log("clear: ", scm);

        if (scm) {
            // @ts-ignore
            formatAndSendMsg({
                _notification: { "clear": scm }
            })
        }
        
    };

    const formatAndSendMsgDebounced = useRef(
        debounce(formatAndSendMsg, 1500),
    ).current;

    const sendGridChangesDebounced = useRef(
        debounce(sendGridChanges, 1500),
    ).current;

    
    useEffect(() => {
        if (lastJsonMessage !== null) {
            // mangage data coming into the websocket
            console.log('lastJsonMessage: ', lastJsonMessage)

            const {
            // Connection info: (unused)
            // connectionId,
            // rm,

            // broadcast keys: $enter_rm, $set, $notification, $disconnect,
            broadcast,
            
            // response keys: $enter_rm, $set_rm, $notification, $set, $get,
            response,

            } = lastJsonMessage;

            if (broadcast?.$enter_rm) {
                const { connectionId, data: { user } } = broadcast.$enter_rm;

                // make sure your not recieving notifications that are coming from yourself
                if (user.websocket_id !== websocketID) {

                }

            }

            if (broadcast?.$set_rm) {
                const { connectionId, data: { user } } = broadcast.$set_rm;
            }

            if (broadcast?.$disconnect) {

                // @ts-ignore
                broadcast.$disconnect.map(({ rm, connectionId, data }) => {

                    if (rm === websocketRMID) {

                    }

                    return null;
                });

            }

            if (broadcast?.$notification) {
                const {
                    connectionId,
                    data,
                } = broadcast.$notification;
            }

            if (response?.$get) {
                const { data } = response.$get;

            }


        }
    }, [lastJsonMessage]);

    useEffect(() => {
        sendBackgroundChanges(backgroundColor);
    }, [backgroundColor])

    useEffect(() => {

        // @ts-ignore
        formatAndSendMsg({
            _set: {
                "user": { "websocket_id": `${websocketID}`, date: new Date(), },
            },
            _get: true,
        });

    }, []);
  

  return (
    <div key="my-whiteboard" className="flex flex-row">
         <Card
            className={cn("min-w-[920px] min-h-[1300px] flex flex-row overflow-hidden")}
            {...props}
        >
            {gridRef.current.map((arr, col_i) => <div id={`col_i-${col_i}`} className="flex flex-col">
                {arr.map((bool, row_i) => <div
                    className={`border`}
                    style={{
                        minWidth: 20,
                        maxWidth: 20,
                        minHeight: 20,
                        maxHeight: 20,
                        // borderLeft: col_i > 0 ? '1px rgba(255,255,255, 0.1)' : 'none',
                        // borderTop: row_i > 0 ? '1px rgba(255,255,255, 0.1)' : 'none',
                        background: gridRef.current[col_i][row_i] ? _colors[gridRef.current[col_i][row_i]].tw : 'transparent'
                    }}
                    onMouseDown={() => handleDragStart(col_i, row_i)} // Handle drag start event
                    onMouseUp={() => handleDragEnd()} // Handle drag end event
                    onMouseEnter={() => handleMouseEnter(col_i, row_i)} // Handle mouse enter event
                    // onMouseLeave={() => handleMouseLeave(col_i, row_i)} // Handle mouse leave event
                />)}
            </div>)}
         </Card>
         <ThemeCustomizer
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
            backgroundColor={backgroundColor}
            setBackgroundColor={setBackgroundColor}
            clearPixels={clearPixels}
        />
    </div>
    
  );
}
