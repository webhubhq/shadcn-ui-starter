"use client"

// This is a development entry point for the app.
// It is not used in production or included in the build.
import $ from "jquery"
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider, createTheme } from '@mui/material';

import { themeConfig } from '../../src-isoflow/styles/theme';
import { BasicEditor } from '@/src-isoflow/examples/BasicEditor/BasicEditor';
import { useUiStateStore } from '@/src-isoflow/stores/uiStateStore';

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
  import { Button } from "@/components/ui/button"
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import List from "@/components/my/workflow/list"

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RID } from "@/utils/utils";


export default function Page({}) {

    const initialNodes = [
        {
            id: '1',
            data: { label: 'Input Node' },
            position: { x: 870, y: 103 },
        },

        {
            id: '2',
            // you can also pass a React component as a label
            data: { label: <div>Default Node</div> },
            position: { x: 870, y: 198 },
        },
        {
            id: '3',
            data: { label: 'Output Node' },
            position: { x: 300, y: 353 },
        },
        {
            id: '4',
            data: { label: 'Output Node' },
            position: { x: 300, y: 448 },
        },
        {
            id: '5',
            data: { label: 'Output Node' },
            position: { x: 1060, y: 353 },
        },
        {
            id: '6',
            data: { label: 'Output Node' },
            position: { x: 1060, y: 448 },
        },
        {
            id: '7',
            data: { label: 'Output Node' },
            position: { x: 870, y: 758 },
        },
    ];
      
    const initialEdges = [
        {id: 'edges--0', source: '1', target: '2'},
        {id: 'edges-1-0-0', source: '3', target: '4'},
        {id: 'edges-1-1-0', source: '5', target: '6'},
        {id: 'edges--1', source: '2', target: '7'},
    ];

    const [nodePositions, setNodePositions] = useState({})
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);

    const [dragging, setDragging] = useState();


    const [workflow, setWorkflow] = useState([
        { id: '1', type: 'type-1', name: 'Card 1' },
        { id: '2', type: 'conditional', name: 'if statement', list: [
                [
                    { id: '3', type: 'type-3', name: 'Card 3' },
                    { id: '4', type: 'if', name: 'if-statement-4', list: [
                        [
                            { id: '11', type: 'placeholder', name: 'ph' },
                        ],
                        [
                            { id: '12', type: 'placeholder', name: 'ph' },
                        ],
                    ] },
                ],
                [
                    { id: '5', type: 'type-3', name: 'Card 5' },
                    { id: '6', type: 'switch', name: 'Card 6', list: [
                            [
                                { id: '8', type: 'type-3', name: 'Card 8' },
                            ],
                            [
                                { id: '9', type: 'type-3', name: 'Card 9' },
                            ],
                            [
                                { id: '10', type: 'type-3', name: 'Card 10' },
                            ],
                        ]
                    },
                ],
            ]
        },
        { id: '7', type: 'type-1', name: 'Card 7' },
    ]);

    const [commandQuery, setCommandQuery] = useState();
    const [selectedCommand, setSelectedCommand] = useState();

    // <CommandGroup heading="Flow controls">
    //     <CommandItem onSelect={console.log}>IF statement</CommandItem>
    //     <CommandItem>Switch</CommandItem>
    //     <CommandItem>For Loop</CommandItem>
    //     <CommandItem>Loop Data</CommandItem>
    //     <CommandItem>Variable</CommandItem>
    //     <CommandItem>Calculator</CommandItem>
    // </CommandGroup>
    // <CommandSeparator />
    // <CommandGroup heading="Actions">
    //     <CommandItem>DB Query</CommandItem>
    //     <CommandItem>Custom Code</CommandItem>
    //     <CommandItem>Email (STMP)</CommandItem>
    //     <CommandItem>HTTP Request</CommandItem>
    //     <CommandItem>Graph QL</CommandItem>
    //     <CommandItem>Create Event</CommandItem>
    // </CommandGroup>
    // <CommandSeparator />
    // <CommandGroup heading="Responses">
    //     <CommandItem>Success</CommandItem>
    //     <CommandItem>Error</CommandItem>
    // </CommandGroup>

    const commandList = [
        {
            group: 'Flow controls',
            items: [ 'IF Statement', 'Switch', 'For Loop', 'Loop Data', 'Variable', 'Calculator'],
        },
        {
            group: 'Actions',
            items: [ 'DB Query', 'Custom Code', 'Email (MSTP)', 'HTTP Request', 'Graph QL', 'Create Event'],
        },
        {
            group: 'Responses',
            items: [ 'Success', 'Error'],
        },
    ];

    // @ts-ignore
    const addItemAfterItemById = (w, itemId, item) => {
        console.log('w: ', w)
        console.log('itemID: ', itemId)
        for (let i = 0; i < w.length; i += 1) {
            const { id, list } = w[i];

            if (id === itemId) {

                w.splice(i + 1, 0, item)
                return true
            }

            // try to recursively go through the tree to find the ID
            if (list?.length > 0) {
                for (let c = 0; c < list?.length; c += 1) {
                    if (addItemAfterItemById(list[c], itemId, item)) {
                        // we found the where we need to add the item
                        break;
                    }
                    
                }
                return true
            }
        }

        return false
    }

    const convertWorkflowToList = (w = []) => {
        let l = {
            container: 'col',
            list: [],
        };

        for (let i = 0; i < w.length; i += 1) {
            const { id, type, name, list } = w[i];

            // @ts-ignore
            if (l.list[l.list.length - 1]?.container !== 'droppable') {
                // @ts-ignore
                l.list.push({
                    container: 'droppable',
                    list: [{ container: 'draggable', id, type, name }],
                });
                // @ts-ignore
            } else if (l.list[l.list.length - 1]?.container === 'droppable') {

                // @ts-ignore
                l.list[l.list.length - 1].list.push({ container: 'draggable', id, type, name });
            }

            // @ts-ignore
            if (list?.length > 0) {
                // @ts-ignore
                l.list.push({
                    container: 'row',
                    /* @ts-ignore */
                    list: list.map((wrkflw) => convertWorkflowToList(wrkflw))
                })
            }
        }

        return l;
    };

    // @ts-ignore
    console.log('convertWorkflowToList: ', convertWorkflowToList(workflow))

    const random = (min = 0, max = 1) => Math.floor(Math.random() * max) + min

    // @ts-ignore
    const convertListToReact = ({ container, list, id, type, name }, indexes = []) => {

        const indexesId = `droppableId-${indexes.join('-')}`

        if (container === 'col') {
            return <div className="flex flex-col">
                {
                /* @ts-ignore */
                list.map((l, i) => convertListToReact(l, indexes.concat([i])))
                }
            </div>
        } else if (container === 'row') {
            return <div className="flex flex-row">
                {
                /* @ts-ignore */
                list.map((l = {}, i = 0) => convertListToReact(l, indexes.concat([i])))
                }
            </div>
        } else if (container === 'droppable') {
            return <Droppable key={indexesId} droppableId={indexesId}>
                {(provided) => <div
                    id={indexesId} className={`${indexesId} flex flex-col items-center`} {...provided.droppableProps} ref={provided.innerRef}
                    style={{
                        position: 'relative',
                        // background: `rgb(${random(0,255)}, ${random(0,255)}, ${random(0,255)})`,
                        marginBottom: 60
                    }}
                >
                    {/* @ts-ignore */}
                    {list.map((l = {}, i = 0) => convertListToReact(l, indexes.concat([i])))}
                    {provided.placeholder}
                </div>}
            </Droppable>
        } else if (container === 'draggable') {

            return <Popover>
                <PopoverTrigger onClick={console.log}>

                    {/* <Button className="py-0 px-0 h-[80px] mb-[15px] flex flex-col" style={{ background: 'rgba(0,0,0,0) '}}> */}
                        {/* @ts-ignore */}
                        <Draggable key={id} draggableId={id} index={indexes.slice(-1)[0]} type="TASK">
                            {(provided) => <><div id={id} className="flex flex-col items-center px-3 w-[380px] mb-[0px]" ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>

                                <Card className="w-[350px]">
                                    <CardContent className="flex flex-col py-2">
                                        <div className="flex justify-between">
                                            <div className="flex pt-2 items-center">
                                                <Badge className="rounded-lg">{type}</Badge>
                                                <span className="text-labelMuted mx-1 text-sm text-slate-500">Workflow2</span>
                                            </div>
                                        </div>
                                        <div className="whitespace-nowrap text-ellipsis overflow-hidden w-full pb-2 pt-1 font-bold text-sm text-left">{name}</div>
                                    </CardContent>
                                </Card>
                            
                            </div>
                            
                            <Button
                                className="mb-[8px] rounded-sm h-[15px] w-[14px]"
                                style={{ position: 'relative', left: -15, opacity: selectedCommand && !dragging ? 1 : 0 }}
                                onClick={(ev) => {
                                ev.stopPropagation()
                                if (selectedCommand && !dragging) {
                                    console.log({
                                        draggableProps: provided.draggableProps,
                                        dragHandleProps: provided.dragHandleProps,
                                        id, index: indexes.slice(-1)[0]
                                    })
                                    const w = workflow.slice()
                                    if (addItemAfterItemById(w, id, { id: RID(), type: selectedCommand || 'undefined', name: 'Untitled' })) {
                                        setWorkflow(w)
                                        /* @ts-ignore */
                                        setSelectedCommand()
                                    }
                                }
                            }} size="sm">+</Button>

                            </>}
                        </Draggable>

                        {/* <Button onClick={console.log} className="rounded-lg" size="sm">+</Button>
                        
                    </Button> */}

                    
                </PopoverTrigger>
                <PopoverContent className="w-[350px] max-h-[45vh] shadow-lg overflow-auto">
                    <div className="grid gap-4">
                    <div className="space-y-2">
                        <Badge className="rounded-lg">{type}</Badge>
                    </div>
                    <div className="grid gap-5">
                        <div className="grid grid-cols-3 items-center gap-4">
                            <Input
                                id="width"
                                defaultValue={name || 'untitled'}
                                className="col-span-3 h-8"
                            />
                        </div>
                        {[null, null, '5 < 2'].map((v, i) => <div className="grid grid-row-3 items-center gap-2">
                            <Label htmlFor="maxWidth">{`Case ${i + 1}`}</Label>
                            <Input
                                id={`case-${i + 1}`}
                                placeholder="{{input}} > 20"
                                value={v ? v : undefined}
                                onChange={console.log}
                                className="col-span-2 h-8"
                            />
                        </div>)}
                        <div className="grid grid-row-3 items-center gap-2">
                            <Label htmlFor="height">Height</Label>
                            <Input
                                id="height"
                                defaultValue="25px"
                                className="col-span-2 h-8"
                            />
                        </div>
                        <div className="grid grid-row-3 items-center gap-2">
                            <Label htmlFor="maxHeight">Max. height</Label>
                            <Input
                                id="maxHeight"
                                defaultValue="none"
                                className="col-span-2 h-8"
                            />
                        </div>
                        <div className="grid grid-cols-3 items-right gap-4 pt-[14px]">
                            <div className="flex flex-1" />
                            <Button variant="outline" size="sm">Cancel</Button>
                            <Button size="sm">Save</Button>
                        </div>
                    </div>
                    </div>
                </PopoverContent>
            </Popover>
            
        }
    };

    // @ts-ignore
    const getArrayByIndexes = (a, indexes = []) => {
        console.log('a: ', a)
        const arr = a?.list || a;
        if (indexes.length > 1) {
            console.log('arr[indexes[0]]: ', arr[indexes[0]])
            return getArrayByIndexes(arr[indexes[0]], indexes.slice(1))
        } else if (indexes.length > 0) {
            return arr
        }

        return undefined
    }

    // @ts-ignore
    const handleOnDragEnd = (result) => {
        console.log('result: ', result)
        if (!result.destination) return;

        /* @ts-ignore */
        const sourceIndexes = result.source.droppableId.split('-').slice(1).map((v) => parseInt(v))
        const sourceIndex = result.source.index;

        /* @ts-ignore */
        const destinationIndexes = result.destination.droppableId.split('-').slice(1).map((v) => parseInt(v))
        const destinationIndex = result.destination.index;

        console.log('destinationIndexes: ', destinationIndexes)
        console.log('destinationIndex: ', destinationIndex)

        console.log('workflow.slice(): ', workflow.slice())


        const w = workflow.slice();

        /* @ts-ignore */
        const spliceWorkflow = (w, indexes, index, spliceArray) => {

            console.log('w: ', w)
            console.log('indexes: ', indexes)


            let c = 0
            for (let i = 0; i < w.length; i += 1) {
                console.log('c: ', c)
                if (c === indexes[0]) {
                    // splice at this position
                    return w.splice(c + index, ...spliceArray)[0]
                }

                const { list } = w[i]

                if (list?.length > 0) {
                    c += 1;
                    if (c === indexes[0]) {
                        return spliceWorkflow(w[i].list[indexes[1]], indexes.slice(2), index, spliceArray)
                    } else {
                        c += 1;
                    }
                }
                
            }
            
            return null
        };

        const item = spliceWorkflow(w, sourceIndexes, sourceIndex, [1]);

        spliceWorkflow(w, destinationIndexes, destinationIndex, [0, item]);


        console.log('w final: ', w)

        setWorkflow(w)

        /* @ts-ignore */
        setDragging();

    }

    // @ts-ignore
    // const handleOnDragEnd = (result) => {
    //     console.log('result: ', result)
    //     if (!result.destination) return;

    //     const items = Array.from(list);
    //     const destination_indexes = result.destination.droppableId.split('-').map((str = '0') => parseInt(str))
    //     const source_indexes = result.source.droppableId.split('-').map((str = '0') => parseInt(str))
    //     console.log('destination_indexes: ', destination_indexes)
    //     console.log('source_indexes: ', source_indexes)
    //     console.log('items: ', items)

    //     const source_item = getArrayByIndexes(items, source_indexes).splice(source_indexes.slice(-1)[0], 1)[0]

    //     console.log('source_item: ', source_item)

    //     const destination_array = getArrayByIndexes(items, destination_indexes)

    //     console.log('destination_array: ', destination_array)

    //     destination_array.splice(destination_indexes.slice(-1)[0], 0, source_item)


    //     // setList(items);
    // }

    const views = {
        apis: <div className="grow">
            <div className="px-4 py-3 flex justify-between select-none">
                <div className="flex flex-col justify-between">
                    <div className="flex">
                        <div>
                            <span>
                                <span className="text-xs text-labelFaint cursor-pointer">API</span>
                                <span className="mx-2 text-xs text-borderSolid cursor-default"> / </span>
                            </span>
                            <span>
                                <span className="text-xs text-labelFaint cursor-pointer">Routes</span>
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center mt-2 routeArray">
                        <span className="flex text-lg font-bold text-labelBase leading-none">APIs</span>
                    </div>
                </div>
                <div className="flex items-start">
                    <div className="flex relative">
                        <Button size="sm" >Add API</Button>
                    </div>
                </div>
            </div>
            <div className="mt-6 select-none">
                <div className="flex flex-row flex-nowrap justify-between items-center">
                    <div>
                        <div className="text-xs text-labelFaint ml-5 w-96">Name</div>
                    </div>
                </div>
                <div className="mt-1.5">

                    <Separator orientation="horizontal" />
                </div>
            </div>
        </div>,
        workflows: <div className="grow h-screen flex flex-col w-full">
            <div className="px-4 py-3 flex justify-between select-none" style={{ backgroundColor: 'rgba(255, 255, 255, 0.01)' }}>
                <div className="flex flex-col justify-between">
                    <div className="flex">
                        <div>
                            <span>
                                <span className="text-xs text-labelFaint cursor-pointer">Workflows</span>
                                <span className="mx-2 text-xs text-borderSolid cursor-default"> / </span>
                            </span>
                            <span>
                                <span className="text-xs text-labelFaint cursor-pointer">New Workflow</span>
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center mt-2 routeArray">
                        <div className="flex mr-3">
                            <Badge>Badge</Badge>
                        </div>
                        <span className="flex font-bold text-lg text-labelBase leading-none">
                            New Workflow
                        </span>
                    </div>
                </div>
            </div>
            <Separator orientation="horizontal" style={{ width: '100%', opacity: 0.5 }} />
            <div className="flex flex-row pt-5">
                {/* @ts-ignore */}
                <DragDropContext onDragEnd={handleOnDragEnd}>
                    {/* <List id="0" list={list} /> */}
                </DragDropContext>

                {/* <Card className="w-[350px]">
                    <CardContent className="flex flex-col py-2">
                        <div className="flex justify-between">
                            <div className="flex pt-2 items-center">
                                <Badge className="rounded-lg">Time</Badge>
                                <span className="text-labelMuted mx-1 text-sm text-slate-500">Workflow</span>
                            </div>
                        </div>
                        <div className="whitespace-nowrap text-ellipsis overflow-hidden w-full pb-2 pt-1 font-bold text-sm">New API Route</div>
                    </CardContent>
                </Card> */}
                {/* <Card className="w-[350px] h-[80px] border-2 flex flex-col border-dashed border-blue-600 justify-center align-self-center">
                    <CardContent className="flex flex-col py-2 justify-self-center align-center">
                        <div
                            className="whitespace-nowrap text-ellipsis overflow-hidden w-full pb-2 pt-1 font-bold text-sm text-center"
                        >Drop Here</div>
                    </CardContent>
                </Card> */}
            </div>
        </div>
    }

    /* @ts-ignore */
    const edgesToSVGPaths = ({ position: { source, target } }) => {
        
        const height = target.y - source.y
        const width = target.x - source.x
        // height buffer
        const hBuffer = Math.abs(width) > 1 ? 40 : 0;

        const xPadding = 4;

        const left = source.x + (width > 0 ? 0 : width) - xPadding

        const w = hBuffer > 0 ? Math.abs(width) + (xPadding * 2) : xPadding * 2

        return <svg style={{ position: 'absolute', top: source.y, left }} width={`${w}`} height={`${height}`}>
            <path 
                d={`M ${width > 0 ? xPadding : w - xPadding} 0 v ${height - hBuffer} h ${width} v ${hBuffer}`}
                strokeMiterlimit="10" 
                fill="none" 
                stroke="#3835B9"
                strokeWidth="2"
                strokeDasharray="3,4"
                strokeDashoffset="3">
                <animate
                    attributeName="stroke-dashoffset"
                    values="100;0"
                    dur="2s"
                    calcMode="linear"
                    repeatCount="indefinite" />
            </path>
        </svg>
    };

    useEffect(() => {
        console.log(' ')
        /* @ts-ignore */
        const getNodesAndEdgesFromWorkflow = (w, indexes = []) => {
            const indexesId = `edges-${indexes.join('-')}`
            const e = [];
            // first_children
            const fc = [];
            // last_children
            const lc = [];
            for (let i = 0; i < w.length; i += 1) {

                const st = $('#workflow-container').scrollTop() || 0;

                const c1 = $(`#${w[i].id}`)?.get(0)?.getBoundingClientRect();
                const c1_temp = $(`#${w[i].id}`).offset()
                console.log('c1_temp: ', c1_temp)
                const c2 = w[i + 1]?.id ? $(`#${w[i + 1].id}`)?.get(0)?.getBoundingClientRect() : undefined;

                const c1XCenter = c1 ? (c1.x - (c1.width / 3)) : undefined;
                const c2XCenter = c2 ? (c2.x - (c2.width / 3)) : undefined;

                const c1YBottom = c1 ? (c1.y - 40) + st : undefined;
                const c1YTop = c1 ? (c1.y - c1.height + 17) + st : undefined;
                const c2YTop = c2 ? (c2.y - c2.height + 17) + st : undefined;

                /* @ts-ignore */
                (w[i]?.list || []).map((l, index) => {
                    /* @ts-ignore */
                    const { edges, first_children, last_children } = getNodesAndEdgesFromWorkflow(l, indexes.concat([i, index]))
                    console.log('first_children: ', first_children)

                    e.push(...edges)

                    // creating edges between parent and children

                    const extra_fc = first_children.map(({ id, position: { target } }, child_index) => ({
                        id: `${indexesId}-${i}-fc-${child_index}`,
                        source: w[i].id,
                        target: id,
                        animated: true,
                        position: {
                            source: { x: c1XCenter, y: c1YBottom },
                            target,
                        }
                    }))
                    e.push(...extra_fc)

                    // if this is not the last element in array use last_children to make edges
                    if (i < w.length - 1) {

                        const extra_lc = last_children.map(({ id, position: { source } }, child_index) => ({
                            id: `${indexesId}-${i}-lc-${child_index}`,
                            source: id,
                            target: w[i + 1].id,
                            animated: true,
                            position: {
                                source,
                                target: { x: c2XCenter, y: c2YTop },
                            }
                        }))

                        e.push(...extra_lc)

                    } else {
                        // if it is the last element we put these last_children in lc to be used higher up the stack
                        lc.push(...last_children)
                    }
                })

                if (i === 0) {
                    console.log('fc.push...')
                    fc.push({
                        id: w[i].id,
                        position: {
                            target: { x: c1XCenter, y: c1YTop },
                        }
                    })
                }

                if (i < w.length - 1) {

                    if (w[i]?.list?.length > 0) {
                        // pass
                        console.log('pass: ', w[i])
                    } else {

                        e.push({
                            id: `${indexesId}-${i}`,
                            source: w[i].id,
                            target: w[i + 1].id,
                            animated: true,
                            position: {
                                source: { x: c1XCenter, y: c1YBottom },
                                target: { x: c2XCenter, y: c2YTop },
                            }
                        })
                    }

                } else {
                    // this is the last element in the array
                    
                    if (!(w[i]?.list?.length > 0)) {
                        // check if this last element has no children
                        lc.push({
                            id: w[i].id,
                            position: {
                                source: { x: c1XCenter, y: c1YBottom },
                            }
                        })
                    }
                }
            }

            return { edges: e, first_children: fc, last_children: lc }
        }

        const { edges, first_children, last_children } = getNodesAndEdgesFromWorkflow(workflow)
        console.log('edges: ', edges)
        /* @ts-ignore */
        setEdges(edges)
        console.log('last_children: ', last_children)

    }, [workflow])


    return (
        <div className="flex flex-row flex-1" style={{ overflow: 'hidden' }}>
            <div className="flex flex-row dark:bg-[#00000033]" style={{ width: 300 }}></div>
            <Separator orientation="vertical" style={{ height: '100vh' }} />
            <div className="flex flex-1 flex-row">
                <div className="grow h-screen flex flex-col w-full">
                    <div className="px-4 py-3 flex justify-between select-none" style={{ backgroundColor: 'rgba(255, 255, 255, 0.01)' }}>
                        <div className="flex flex-col justify-between">
                            <div className="flex">
                                <div>
                                    <span>
                                        <span className="text-xs text-labelFaint cursor-pointer">Workflows</span>
                                        <span className="mx-2 text-xs text-borderSolid cursor-default"> / </span>
                                    </span>
                                    <span>
                                        <span className="text-xs text-labelFaint cursor-pointer">New Workflow</span>
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center mt-2 routeArray">
                                <div className="flex mr-3">
                                    <Badge>Badge</Badge>
                                </div>
                                <span className="flex font-bold text-lg text-labelBase leading-none">
                                    New Workflow
                                </span>
                            </div>
                        </div>
                    </div>
                    <Separator orientation="horizontal" style={{ width: '100%', opacity: 0.5 }} />
                    <div className="flex flex-row" style={{
                        position: 'relative', width: 'calc(100vw - 300px)', height: 'calc(100vh - 78px)',
                    }}>
                        <div id="workflow-container" className="pt-6" style={{ position: 'relative', width: '100%', height: '100%', overflow: 'scroll' }}>
                            {!dragging && edges.map(edgesToSVGPaths)}
                            {/* @ts-ignore */}
                            <DragDropContext onDragStart={() => setDragging(true)} onDragEnd={handleOnDragEnd}>
                                {/* @ts-ignore */}
                                {convertListToReact(convertWorkflowToList(workflow), [])}
                            </DragDropContext>
                        </div>
                        
                        <div style={{ position: 'absolute', right: 20, top: 20, width: 350 }} >
                            {!selectedCommand && <Command className="border shadow-md">
                                <CommandInput
                                    placeholder="Type a command or search..."
                                    value={commandQuery}
                                    /* @ts-ignore */
                                    onValueChange={setCommandQuery}
                                />
                                <CommandList>
                                    <CommandEmpty>No results found.</CommandEmpty>
                                    {commandList.map(({ group, items }) => <CommandGroup heading={group}>
                                        {/* @ts-ignore */}
                                        {items.map((item) => <CommandItem onSelect={() => setSelectedCommand(item)}>{item}</CommandItem>)}
                                    </CommandGroup>)}
                                </CommandList>
                            </Command>}

                            {selectedCommand && <Card className="w-[350px]">
                                <CardHeader>
                                    <CardTitle>{selectedCommand}</CardTitle>
                                    <CardDescription>Deploy your new project in one-click.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form>
                                    <div className="grid w-full items-center gap-4">
                                        <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="name">Name</Label>
                                        <Input id="name" placeholder="Name of your project" />
                                        </div>
                                        <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="framework">Framework</Label>
                                        <Select>
                                            <SelectTrigger id="framework">
                                            <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                            <SelectContent position="popper">
                                            <SelectItem value="next">Next.js</SelectItem>
                                            <SelectItem value="sveltekit">SvelteKit</SelectItem>
                                            <SelectItem value="astro">Astro</SelectItem>
                                            <SelectItem value="nuxt">Nuxt.js</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        </div>
                                    </div>
                                    </form>
                                </CardContent>
                                <CardFooter className="flex justify-between">
                                    {/* @ts-ignore */}
                                    <Button variant="outline" onClick={() => setSelectedCommand()}>Exit</Button>
                                </CardFooter>
                            </Card>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

};
