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

import { toast } from "sonner"

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

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"

import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
  } from "@/components/ui/drawer"

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

import { RID, calcMatrixColRow, calcMatrixIndex, randomNameGenerator } from '@/utils/utils';
import { Separator } from '@/components/ui/separator';
import { EyeOpenIcon } from '@radix-ui/react-icons';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';

// @ts-ignore
export default function Whiteboard() {

    const [websocketRMID, setWebsocketRMID] = useState('myroom-matrix');
    const [messageHistory, setMessageHistory, handleSendJsonMessage, lastJsonMessage, readyState, connectionStatus, getWebSocket, websocketID] = useContext(WebsocketContext);
    const [inRoom, setInRoom] = useState(false);
    const [firstSyncWithDoc, setFirstSyncWithDoc] = useState(false);
    const [begin, setBegin] = useState(false);

    const _unique_db_name = "test-0-w3xfsh";

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

    const scmMatchingColor = (scm_obj: object) => {
        for (const [color, { scm }] of Object.entries(_colors)) {
            // @ts-ignore
            if (scm_obj[0] === scm[0] && scm_obj[1] === scm[1] && scm_obj[2] === scm[2]) {
                return color;
            }
        }

        return null;
    }

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

    const { setTheme: setMode, resolvedTheme: mode } = useTheme()

    const [selectedColor, setSelectedColor] = useState("rose");
    const [backgroundColor, setBackgroundColor] = useState(mode);
    const [dragging, setDragging] = useState(false);
    const [update, setUpdate] = useState(RID());
    const gridRef = useRef(Array.from(Array(cols), () => new Array(rows).fill(null)));
    const gridChangesRef = useRef({});

    const [viewers, setViewers] = useState({});
    const [rmDoc, setRmDoc] = useState();

    const formatViwersData = () => {

        const v = {
            me: undefined,
            others: [],
            rpclient: undefined,
        }

        // @ts-ignore
        for (const [connectionId, { user }] of Object.entries(viewers)) {

            const { name, websocket_id, type, date } = user || {};

            if (type === "web-controller") {

                if (websocket_id === websocketID) {
                    v.me = user;
                } else {
                    // @ts-ignore
                    v.others.push(user);
                }


            } else if (type === "raspberry-pi-client") {
                // @ts-ignore
                if (!v.rpclient || (v.rpclient && v.rpclient.date < date)) {
                    v.rpclient = user;
                }
            }
        }

        return v;
    };

    const {
        me, others, rpclient
    } = formatViwersData();

    // Function to handle mouse enter event

    // @ts-ignore
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

    // @ts-ignore
    const handleDragStart = (col, row) => {
        gridRef.current[col][row] = selectedColor; // Update hover state
        // @ts-ignore
        gridChangesRef.current[calcMatrixIndex(col, row, rows)] = selectedColor;
        // sendGridChangesDebounced();
        setUpdate(RID());
        setDragging(true);
    };

    // Function to handle drag end event
    const handleDragEnd = () => {
        setDragging(false);
        sendGridChanges();
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
    const formatAndSendMsg = ({ _set, _get, _notification, _setdoc, _updatedoc, _getdoc }) => {
        const json = {
            "action": "request",
            "rm": websocketRMID,
            _set: _set || undefined,
            _get: _get || undefined,
            _notification: _notification || undefined,
            _setdoc: _setdoc || undefined,
            _updatedoc: _updatedoc || undefined,
            _getdoc: _getdoc || undefined,
        };

        handleSendJsonMessage(json);
    };

    const sendGridChanges = () => {
        const arr = []
        const points_obj = {};
        for(const [index, color] of Object.entries(gridChangesRef.current)) {
            // @ts-ignore
            arr.push(...[parseInt(index), ..._colors[color].scm])

            // record an equivalent data for points in doc whiteboard
            
            // @ts-ignore
            points_obj[index] = _colors[color].scm;

            // clearing what was drawn
            // @ts-ignore
            delete gridChangesRef.current[index];
        }

        // console.log('arr: ', arr)

        // @ts-ignore
        formatAndSendMsg({
            _notification: { "points": arr },
            _updatedoc: {
                db: { mongodb: { unique_db_name: _unique_db_name } },
                doc: {
                    whiteboard: {
                        // updating points
                        points: points_obj,
                    }
                }
            }
        })
    }

    // @ts-ignore
    const sendBackgroundChanges = (mde) => {
        // @ts-ignore
        const scm = _bg_colors[mde]?.scm;
        console.log("background scm: ", scm);

        if (scm) {
            // @ts-ignore
            formatAndSendMsg({
                _notification: { "background": scm },
                _updatedoc: {
                    db: { mongodb: { unique_db_name: _unique_db_name } },
                    doc: {
                        whiteboard: {
                            // setting background
                            background: scm,
                        }
                    }
                }
            })
        }
        
    };

    const syncWithDoc = () => {

        // @ts-ignore
        formatAndSendMsg({
            _notification: { "sync-with-doc": true },
            _getdoc: { db: { mongodb: { unique_db_name: _unique_db_name } } }
        })
        
    };

    const clearPixels = () => {
        // console.log("clear pixels")
        sendClearPixels(backgroundColor)
        gridRef.current = Array.from(Array(cols), () => new Array(rows).fill(null))
        setUpdate(RID());
    };

    // @ts-ignore
    const sendClearPixels = (mde) => {
        // @ts-ignore
        const scm = _bg_colors[mde]?.scm;
        // console.log("clear: ", scm);

        if (scm) {
            // @ts-ignore
            formatAndSendMsg({
                _notification: { "clear": scm },
                _setdoc: {
                    db: { mongodb: { unique_db_name: _unique_db_name } },
                    doc: {
                        whiteboard: {
                            // setting background
                            background: { 0: scm[0], 1: scm[1], 2: scm[2] },
                            // clearing points
                            points: undefined,
                        }
                    }
                }
            })
        }
        
    };

    const updateGridRefWithPoints = (points: object) => {
        for (const [index, scm_obj ] of Object.entries(points)) {
            const color = scmMatchingColor(scm_obj)

            if (color) {
                const { col, row } = calcMatrixColRow(parseInt(index), rows);
                gridRef.current[col][row] = color;
            }
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
            rm,

            // broadcast keys: $enter_rm, $set, $notification, $disconnect, $setdoc, $updatedoc
            broadcast,
            
            // response keys: $enter_rm, $notification, $set, $get, $setdoc, $updatedoc, $getdoc
            response,

            } = lastJsonMessage;

            if (broadcast?.$enter_rm) {
                const { connectionId, data: { user } } = broadcast.$enter_rm;

                // make sure your not recieving notifications that are coming from yourself
                if (user.websocket_id !== websocketID) {

                    // @ts-ignore
                    if (!viewers[connectionId]) {
                        // found new user so we will add them to viewers object
                        setViewers((prevState) => ({...prevState, [connectionId]: { user } }))
                    }
                }

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

                console.log('notification data: ', data);

                if (data.points) {

                    // convert points into object

                    const points_obj = {};

                    // @ts-ignore
                    for (let i = 0; i < data.points; i += 4) {
                        // @ts-ignore
                        points_obj[data.points[i]] = [
                            data.points[i + 1],
                            data.points[i + 2],
                            data.points[i + 3],
                        ];
                    }

                    updateGridRefWithPoints(points_obj)
                    setUpdate(RID())
                }

                if (data.clear) {
                    gridRef.current = Array.from(Array(cols), () => new Array(rows).fill(null));
                    setUpdate(RID());
                }
            }

            if (broadcast?.$setdoc) {
                const {
                    connectionId,
                    data,
                } = broadcast.$setdoc;

                setRmDoc(data);
            }

            if (broadcast?.$updatedoc) {
                const {
                    connectionId,
                    data,
                } = broadcast.$updatedoc;

                setRmDoc(data);
            }



            if (response?.$enter_rm) {
                const { success } = response.$enter_rm;
                if (success && rm === websocketRMID) {
                    setInRoom(true);
                }
            }
            
            if (response?.$get) {
                const { success, data } = response.$get;
                console.log('room_data: ', data);
                setViewers(data);

                if (!success) {
                    toast("Error!", {
                        description: "Unable to see who's in the room",
                        action: {
                            label: "Refresh",
                            onClick: () => location.reload(),
                        },
                    })
                }
            }


            if (response?.$notification) {
                const { success, data } = response.$notification;

                if (!success) {
                    toast("Error!", {
                        description: "Unable to send updates to other clients",
                        action: {
                            label: "Refresh",
                            onClick: () => location.reload(),
                        },
                    })
                }
            }

            if (response?.$setdoc) {
                const { success, data } = response.$setdoc;

                if (!success) {
                    toast("Error!", {
                        description: "Changes not saved to database",
                        action: {
                            label: "Refresh",
                            onClick: () => location.reload(),
                        },
                    })
                }
            }

            if (response?.$updatedoc) {
                const { success, data } = response.$updatedoc;

                if (!success) {
                    toast("Error!", {
                        description: "Changes not saved to database",
                        action: {
                            label: "Refresh",
                            onClick: () => location.reload(),
                        },
                    })
                }
            }


            if (response?.$getdoc) {
                const { success, data } = response.$getdoc;
                // console.log('doc_data: ', data);

                if (!firstSyncWithDoc) {
                    setFirstSyncWithDoc(true);
                }
                setRmDoc(data);

                if (!success) {
                    toast("Error!", {
                        description: "Unable to sync with database",
                        action: {
                            label: "Refresh",
                            onClick: () => location.reload(),
                        },
                    })
                }
            }

        }
    }, [lastJsonMessage]);

    useEffect(() => {

        if (rmDoc) {
            // @ts-ignore
            const bg = rmDoc?.whiteboard?.background;
            
            // @ts-ignore
            const points = rmDoc?.whiteboard?.points || [];

            updateGridRefWithPoints(points);

            setUpdate(RID());
        }

    }, [rmDoc]);

    useEffect(() => {
        if (inRoom) {
            // get the current doc data of the room

            // @ts-ignore
            formatAndSendMsg({
                _getdoc: { db: { mongodb: { unique_db_name: _unique_db_name } } }
            })

        }
    }, [inRoom])

    // useEffect(() => {
    //     if (inRoom) {
    //         sendBackgroundChanges(backgroundColor);
    //     }
    // }, [backgroundColor, inRoom])

    useEffect(() => {

        if (websocketID) {

            const clrs = Object.keys(_colors);
            const randomColor = clrs[Math.floor(Math.random() * clrs.length)]

            // @ts-ignore
            formatAndSendMsg({
                _set: {
                    "user": {
                        name: randomNameGenerator(),
                        color: randomColor,
                        type: "web-controller",
                        "websocket_id": `${websocketID}`,
                        date: new Date(),
                    },
                },
                _get: true,
            });
        }

    }, [websocketID]);


    const accordionComp = <Accordion type="single" collapsible className="w-full">
    <AccordionItem value="item-1">
        <AccordionTrigger>Me</AccordionTrigger>
        <AccordionContent>
            <div className="flex flex-col">
                {me && <div className="flex flex-row justify-between">
                    <Badge
                        className="rounded-sm"
                        style={{
                            // @ts-ignore
                            background: _colors[me.color].tw,
                        }}
                    
                    >
                        {/* @ts-ignore */}
                        {me.name}
                    </Badge>
                    {/* <div className="text-sm text-gray-500">{me.date}</div> */}
                </div>}
            </div>
        </AccordionContent>
    </AccordionItem>
    <AccordionItem value="item-2">
        <AccordionTrigger>{`${others.length} other viewer${others.length === 1 ? '' : 's'}`}</AccordionTrigger>
        <AccordionContent>
            <div className="flex flex-col">
                {others.map(({ name, color, date }) => <div className="flex flex-row justify-between mb-2">
                    <Badge
                        className="rounded-sm"
                        style={{
                            // @ts-ignore
                            background: _colors[color].tw,
                        }}
                    >{name}</Badge>
                    {/* <div className="text-xs text-gray-500">{date}</div> */}
                </div>)}
            </div>
        </AccordionContent>
    </AccordionItem>
    <AccordionItem value="item-3">
        <AccordionTrigger>Raspberry Pi Client</AccordionTrigger>
        <AccordionContent>
            <div className="flex flex-col">
                <div className="flex flex-row justify-between">
                    <div
                        className="text-sm text-success"
                        style={{
                            color: _colors[rpclient ? 'green' : 'rose'].tw,
                        }}
                    >{rpclient ? 'Online' : 'Offline'}</div>
                    {/* <div className="text-sm text-gray-500">{me.date}</div> */}
                </div>
            </div>
        </AccordionContent>
    </AccordionItem>
</Accordion>
  

  return (
    <div key="my-whiteboard" className="flex flex-row">

        <AlertDialog open={!begin} defaultOpen>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>{me ? "Connected!" : "Connecting..."}</AlertDialogTitle>
                <AlertDialogDescription>
                    {me ? "You're all set!" : "This should only take a few seconds"}
                </AlertDialogDescription>
                </AlertDialogHeader>
                    {me && <div className="flex flex-row items-center">
                        <Badge
                            className="rounded-sm"
                            style={{
                                // @ts-ignore
                                background: _colors[me.color].tw,
                            }}
                        
                        >
                            {/* @ts-ignore */}
                            {me.name}
                        </Badge>
                        <div className="mx-3 text-gray-500">-</div>
                        {/* @ts-ignore */}
                        <div className="text-sm text-gray-500">{me.date}</div>
                    </div>}
                <AlertDialogFooter>
                <AlertDialogAction
                    disabled={!(inRoom && firstSyncWithDoc)}
                    onClick={() => setBegin(true)}
                >Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

         <Card
            className={cn("min-w-[920px] min-h-[1300px] flex flex-row overflow-hidden")}
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
                        // @ts-ignore
                        background: gridRef.current[col_i][row_i] ? _colors[gridRef.current[col_i][row_i]].tw : 'transparent'
                    }}
                    onTouchStart={(e) => {
                        e.preventDefault();
                        handleDragStart(col_i, row_i);
                    }} // Handle drag start event
                    onTouchEnd={() => handleDragEnd()} // Handle drag end event
                    onTouchMove={(e) => handleMouseEnter(col_i, row_i)} // Handle mouse enter event
                    onMouseDown={() => handleDragStart(col_i, row_i)} // Handle drag start event
                    onMouseUp={() => handleDragEnd()} // Handle drag end event
                    onMouseEnter={() => handleMouseEnter(col_i, row_i)} // Handle mouse enter event
                    // onMouseLeave={() => handleMouseLeave(col_i, row_i)} // Handle mouse leave event
                />)}
            </div>)}
         </Card>
         <div className="flex flex-col">

            <ThemeCustomizer
                selectedColor={selectedColor}
                // @ts-ignore
                setSelectedColor={setSelectedColor}
                backgroundColor={backgroundColor}
                // @ts-ignore
                setBackgroundColor={setBackgroundColor}
                clearPixels={clearPixels}
            />

            <div className="flex space-x-2 mt-1">
                <Drawer>
                    <DrawerTrigger asChild>
                    <Button className="md:hidden">
                        <EyeOpenIcon className="mr-2 h-4 w-4" />
                        {others.length + 1}
                    </Button>
                    </DrawerTrigger>
                    <DrawerContent className="p-6 pt-0">
                        {accordionComp}
                    </DrawerContent>
                </Drawer>
                <div className="hidden md:flex">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button>
                                <EyeOpenIcon className="mr-2 h-4 w-4" />
                                {others.length + 1}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent
                            align="center"
                            className="z-40 w-[340px] rounded-[0.5rem] bg-white p-6 dark:bg-zinc-950"
                        >
                            {accordionComp}
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
         </div>
    </div>
    
  );
}
