"use client"

// This is a development entry point for the app.
// It is not used in production or included in the build.
import $ from "jquery"
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider, createTheme } from '@mui/material';

import { themeConfig } from '../../src/styles/theme';
import { BasicEditor } from '@/src/examples/BasicEditor/BasicEditor';
import { useUiStateStore } from '@/src/stores/uiStateStore';

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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import List from "@/components/my/workflow/list"

import ReactFlow, { Background, BackgroundVariant } from 'reactflow';
import 'reactflow/dist/style.css';


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

    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);

    // const [list, setList] = useState([
    //     [
    //         { id: '1', type: 'type-1', name: 't-1' },
    //         { id: '2', type: 'conditional', name: 'if-statement-2', list: [
    //             [
    //                 { id: '5', type: 'type-7', name: 't-5' },
    //                 { id: '6', type: 'conditional', name: 'if-statement-6', list: [] }
    //             ],
    //             [
    //                 { id: '7', type: 'type-7', name: 't-7' },
    //                 { id: '8', type: 'conditional', name: 'if-statement-8', list: [
    //                     [
    //                         { id: '3', type: 'type-3', name: 't-3' },
    //                         { id: '4', type: 'conditional', name: 'if-statement-4', list: [] }
    //                     ],
    //                     [
    //                         { id: '33', type: 'type-3', name: 't-33' },
    //                         { id: '44', type: 'conditional', name: 'if-statement-44', list: [] }
    //                     ],
    //                 ] }
    //             ],
    //         ] }
    //     ],
    // ])

    const [workflow, setWorkflow] = useState([
        { id: '1', type: 'type-1', name: 'Card 1' },
        { id: '2', type: 'conditional', name: 'if statement', list: [
                [
                    { id: '3', type: 'type-3', name: 'Card 3' },
                    { id: '4', type: 'conditional', name: 'if-statement-4' },
                ],
                [
                    { id: '5', type: 'type-3', name: 'Card 5' },
                    { id: '6', type: 'conditional', name: 'Card 6', list: [
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

    const convertWorkflowToList = (w = []) => {
        let l = {
            container: 'col',
            list: [],
        };

        for (let i = 0; i < w.length; i += 1) {
            const { id, type, name, list } = w[i];

            if (l.list[l.list.length - 1]?.container !== 'droppable') {
                l.list.push({
                    container: 'droppable',
                    list: [{ container: 'draggable', id, type, name }],
                });
            } else if (l.list[l.list.length - 1]?.container === 'droppable') {

                l.list[l.list.length - 1].list.push({ container: 'draggable', id, type, name });
            }

            if (list?.length > 0) {
                l.list.push({
                    container: 'row',
                    list: list.map((wrkflw) => convertWorkflowToList(wrkflw))
                })
            }
        }

        return l;
    };

    console.log('convertWorkflowToList: ', convertWorkflowToList(workflow))

    const random = (min = 0, max = 1) => Math.floor(Math.random() * max) + min

    const convertListToReact = ({ container, list, id, type, name }, indexes = []) => {

        const indexesId = `droppableId-${indexes.join('-')}`

        if (container === 'col') {
            return <div className="flex flex-col">
                {list.map((l, i) => convertListToReact(l, indexes.concat([i])))}
            </div>
        } else if (container === 'row') {
            return <div className="flex flex-row">
                {list.map((l = {}, i = 0) => convertListToReact(l, indexes.concat([i])))}
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
                    {list.map((l = {}, i = 0) => convertListToReact(l, indexes.concat([i])))}
                    {provided.placeholder}
                </div>}
            </Droppable>
        } else if (container === 'draggable') {
            return <Draggable key={id} draggableId={id} index={indexes.slice(-1)[0]} type="TASK">
                {(provided) => <div id={id} className="flex flex-col items-center px-3 w-[380px]" ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                    <Card className="w-[350px]  mb-[15px]">
                        <CardContent className="flex flex-col py-2">
                            <div className="flex justify-between">
                                <div className="flex pt-2 items-center">
                                    <Badge className="rounded-lg">{type}</Badge>
                                    <span className="text-labelMuted mx-1 text-sm text-slate-500">Workflow</span>
                                </div>
                            </div>
                            <div className="whitespace-nowrap text-ellipsis overflow-hidden w-full pb-2 pt-1 font-bold text-sm">{name}</div>
                        </CardContent>
                    </Card>
                </div>}
            </Draggable>
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

    useEffect(() => {

        // first we need to traverse through the array and build out ReactFlow Nodes

        /*
            [
                { id: '1', type: 'type-1', name: 'Card 1' },
                { id: '2', type: 'conditional', name: 'if statement', list: [
                        [
                            { id: '3', type: 'type-3', name: 'Card 3' },
                            { id: '4', type: 'conditional', name: 'if-statement-4' },
                        ],
                        [
                            { id: '5', type: 'type-3', name: 'Card 5' },
                            { id: '6', type: 'conditional', name: 'Card 6', list: [
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
            ]
        */

        const getNodesAndEdgesFromWorkflow = (w, indexes = []) => {
            const indexesId = `edges-${indexes.join('-')}`
            const e = [];
            const n = [];
            for (let i = 0; i < w.length; i += 1) {

                (w[i]?.list || []).map((l, index) => {
                    const { nodes, edges } = getNodesAndEdgesFromWorkflow(l, indexes.concat([i, index]))

                    e.push(...edges)
                    n.push(...nodes)
                })

                if (i < w.length - 1) {

                    e.push({
                        id: `${indexesId}-${i}`,
                        source: w[i].id,
                        target: w[i + 1].id,
                        animated: true,
                    })
    
                    const c1 = $(`#${w[i].id}`).get(0)?.getBoundingClientRect();
                    const c2 = $(`#${w[i + 1].id}`).get(0)?.getBoundingClientRect();
    
                    /*
                        {
                            id: '1',
                            type: 'input',
                            data: { label: 'Input Node' },
                            position: { x: 0, y: 0 },
                        }
                    */

                    console.log('w[i].id: ', w[i].id)
                    console.log('w[i + 1].id: ', w[i + 1].id)
                    
                    n.push(...[
                        {
                            id: w[i].id,
                            // type: 'input',
                            data: { label: 'Input Node' },
                            position: { x: c1?.x, y: c1?.y },
                        },
                        {
                            id: w[i + 1].id,
                            // type: 'input',
                            data: { label: 'Input Node' },
                            position: { x: c2?.x, y: c2?.y },
                        },
                    ])

                }

            }

            return { nodes: n, edges: e }
        }

        const { nodes, edges } = getNodesAndEdgesFromWorkflow(workflow)
        console.log('nodes: ', nodes)
        setNodes(nodes)
        console.log('edges: ', edges)
        setEdges(edges)

    }, [workflow])


    return (
        <div className="flex flex-row flex-1">
            <div className="flex flex-row" style={{ width: 300, backgroundColor: 'rgba(0, 0, 0, 0.2)' }}></div>
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
                    <div className="flex flex-row" style={{ position: 'relative', width: 'calc(100vw - 300px)', height: 'calc(100vh - 78px)' }}>

                        <div style={{ position: 'relative', zIndex: 2 }}>
                            <div style={{ position: 'absolute', zIndex: 1, width: '100%', height: '100%'}}>

                                <ReactFlow nodes={nodes} edges={edges}>
                                <Background id="background-dots" color="rgba(255, 255, 255, 0.5)" variant={BackgroundVariant.Dots} />
                                {/* <Background id="1" gap={10} color="#f1f1f1" variant={BackgroundVariant.Lines} />
                                <Background id="2" gap={100} offset={1} color="#ccc" variant={BackgroundVariant} /> */}
                                </ReactFlow>
                            </div>

                            <div className="pt-6" style={{ position: 'relative', zIndex: 2 }}>
                                <DragDropContext onDragEnd={handleOnDragEnd}>
                                    {convertListToReact(convertWorkflowToList(workflow), [])}
                                </DragDropContext>
                            </div>
                            
                        </div>
                        
                        
                    </div>
                </div>
            </div>
        </div>
    )

};
