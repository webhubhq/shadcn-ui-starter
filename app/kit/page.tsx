"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import $ from "jquery"
import { cn } from "@/lib/utils"
import { RID } from "@/utils/utils"


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

import { CheckCircledIcon, ChevronRightIcon, StackIcon, LockOpen1Icon, ArchiveIcon, GearIcon, RocketIcon, MixIcon } from '@radix-ui/react-icons'
  
import { Button } from "@/components/ui/button"


export default function Page({}) {

  const subHeaderName = "API Kit"
  const [baseUrl, setBaseUrl] = useState<string>();


  return (
    <div
        className="flex flex-col bg-white dark:bg-black"
        style={{ width: '100vw', height: '100vh' }}
    >
        <div
            className="align-center flex h-[70px] flex-row px-[28px]"
            style={{ boxShadow: '0px 1px 4px 0px rgba(0, 0, 0, 0.05)' }}
        >
            <div style={{ margin: 'auto 0px' }}>
                <img src="/webhub-logo-2.png"  width="50px" />
            </div>
            <div
              className="text-[#02062B] dark:text-[#D6D5D8]"
              style={{ fontSize: 22, fontWeight: 'bold', fontFamily: 'Arial', textAlign: 'center', alignSelf: 'center', marginLeft: 10 }}
            >WebHUB</div>
            <div className="text-[#797387] dark:text-[#797680]" style={{ fontSize: 16, fontWeight: 'normal', fontFamily: 'Arial', textAlign: 'center', alignSelf: 'center', marginLeft: 6 }}>{subHeaderName}</div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <Input type="text" id="api-base-url" placeholder="your api url" style={{ minWidth: 200, maxWidth: 500 }} />
            </div>

            <div
              className="text-[##353743] dark:text-[#D6D5D8]"
              style={{ fontSize: 14, fontWeight: 'bold', fontFamily: 'Arial', textAlign: 'center', alignSelf: 'center', cursor: 'pointer' }}
            >Documentation</div>
            <Separator className="mx-[25px]" style={{ height: 20, marginTop: 'auto', marginBottom: 'auto' }} orientation="vertical" />
            <div
              className="text-[##353743] dark:text-[#D6D5D8]"
              style={{ fontSize: 14, fontWeight: 'bold', fontFamily: 'Arial', textAlign: 'center', alignSelf: 'center', cursor: 'pointer' }}
            >Feedback</div>
        </div>
        <Separator style={{ opacity: 0.2 }} />
        <div
          className="my-sandbox-container bg-[#F6F8FA] dark:bg-[#020202]"
          style={{
            display: 'flex',
            flex: 1,
            flexDirection: 'row',
            width: '100%',
            height: 'calc(100% - 130px)',
            justifyContent: 'center',
            overflowY: 'hidden',
            position: 'relative',
            top: 0,
          }}
        >
          {}
        </div>
    </div>
  )
}
