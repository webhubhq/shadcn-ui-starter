"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import $ from "jquery"
import { cn } from "@/lib/utils"
import { RID } from "@/utils/utils"


import Isoflow from 'isoflow'
// import { networkingIsopack } from 'isoflow/dist/iconpacks';

import {
  Calculator,
  Calendar,
  CreditCard,
  Settings,
  Smile,
  User,
} from "lucide-react"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectLabel,
    SelectGroup,
    SelectValue,
} from "@/components/ui/select"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"

import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"

import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

import { CheckCircledIcon, ChevronRightIcon, StackIcon, LockOpen1Icon, ArchiveIcon, GearIcon, RocketIcon } from '@radix-ui/react-icons'
  
import { Button } from "@/components/ui/button"

import { basicIsopack, networkingIsopack, mergeIsopacks } from '@/components/isopacks';
import { customVars } from '@/components/styles';

const mergedIsopacks = mergeIsopacks([basicIsopack, networkingIsopack]);


export default function Page({}) {

  const subHeaderName = "Playground"
  const [baseUrl, setBaseUrl] = useState<string>();

  const initialData = {
    icons: mergedIsopacks,
    nodes: [
      {
        id: "node1",
        iconId: "server",
        position: {
          x: 0,
          y: 0,
        },
      },
    ],
    connectors: [],
    rectangles: []
  };



  return (
    <div
        className="flex flex-col bg-white dark:bg-black"
        style={{ width: '100vw', height: '100vh' }}
    >
        <Isoflow />
    </div>
  )
}
