"use client"

import * as React from "react"
import {
  AlertCircle,
  Archive,
  // ArchiveX,
  File,
  Inbox,
  // MessagesSquare,
  Search,
  Send,
  ShoppingCart,
  Trash2,
  // Users2,
  EyeIcon
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { Separator } from "@/components/ui/separator"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { TooltipProvider } from "@/components/ui/tooltip"
import { AccountSwitcher } from "../components/account-switcher"
import { MailDisplay } from "../components/mail-display"
import { MailList } from "../components/mail-list"
import { Nav } from "../components/nav"
import { type Mail } from "../../sandbox/data"
import { useMail } from "../../sandbox/use-mail"
import moment from "moment"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

interface MailProps {
  accounts: {
    label: string
    email: string
    icon: React.ReactNode
  }[]
  mails: Mail[]
  defaultLayout: number[] | undefined
  defaultCollapsed?: boolean
  navCollapsedSize: number
}

export function Mail({
  accounts,
  mails,
  defaultLayout = [20, 32, 48],
  defaultCollapsed = false,
  navCollapsedSize,
}: MailProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed)
  const [mail] = useMail()

  const [status, setStatus] = React.useState<0 | 1 | 2 | 3 | 4>(0);
  const [openDialog, setOpenDialog] = React.useState<boolean>(false);

  return (
    <>
        <TooltipProvider delayDuration={0}>
            <ResizablePanelGroup
                direction="horizontal"
                onLayout={(sizes: number[]) => {
                document.cookie = `react-resizable-panels:layout:mail=${JSON.stringify(
                    sizes
                )}`
                }}
                className="h-full max-h-[100vh] items-stretch"
            >
                <ResizablePanel
                defaultSize={defaultLayout[0]}
                collapsedSize={navCollapsedSize}
                collapsible={true}
                minSize={15}
                maxSize={20}
                onCollapse={() => {
                    setIsCollapsed(true)
                    document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
                    true
                    )}`
                }}
                onResize={() => {
                    setIsCollapsed(false)
                    document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
                    false
                    )}`
                }}
                className={cn(
                    isCollapsed &&
                    "min-w-[50px] transition-all duration-300 ease-in-out"
                )}
                >
                <div
                    className={cn(
                    "flex h-[56px] items-center justify-center",
                    isCollapsed ? "h-[56px]" : "px-2"
                    )}
                >
                    <AccountSwitcher isCollapsed={isCollapsed} accounts={accounts} />
                </div>
                <Separator />
                <Nav
                    isCollapsed={isCollapsed}
                    links={[
                    {
                        title: "Inbox",
                        label: "128",
                        icon: Inbox,
                        variant: "default",
                    },
                    {
                        title: "Drafts",
                        label: "9",
                        icon: File,
                        variant: "ghost",
                    },
                    {
                        title: "Sent",
                        label: "",
                        icon: Send,
                        variant: "ghost",
                    },
                    //   {
                    //     title: "Junk",
                    //     label: "23",
                    //     icon: ArchiveX,
                    //     variant: "ghost",
                    //   },
                    {
                        title: "Trash",
                        label: "",
                        icon: Trash2,
                        variant: "ghost",
                    },
                    {
                        title: "Archive",
                        label: "",
                        icon: Archive,
                        variant: "ghost",
                    },
                    ]}
                />
                {/* <Separator />
                <Nav
                    isCollapsed={isCollapsed}
                    links={[
                    //   {
                    //     title: "Social",
                    //     label: "972",
                    //     icon: Users2,
                    //     variant: "ghost",
                    //   },
                    {
                        title: "Updates",
                        label: "342",
                        icon: AlertCircle,
                        variant: "ghost",
                    },
                    //   {
                    //     title: "Forums",
                    //     label: "128",
                    //     icon: MessagesSquare,
                    //     variant: "ghost",
                    //   },
                    {
                        title: "Shopping",
                        label: "8",
                        icon: ShoppingCart,
                        variant: "ghost",
                    },
                    {
                        title: "Promotions",
                        label: "21",
                        icon: Archive,
                        variant: "ghost",
                    },
                    ]}
                /> */}
                {!isCollapsed && <>
                    <Separator />
                    <div className="font-semibold text-xs p-5">
                        Built by <a className="text-blue-500" style={{ textDecoration: 'underline' }} href="https://webhub.up.railway.app/" target="_blank" rel="noreferrer">API72</a>. The source code is available on Github.
                    </div>
                </>}
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
                <Tabs defaultValue="all">
                    <div className="flex items-center px-4 py-2 pr-2">
                    <h1 className="text-xl font-bold">Broadcast stream</h1>
                    {/* <TabsList className="ml-auto">
                        <TabsTrigger
                        value="all"
                        className="text-zinc-600 dark:text-zinc-200"
                        >
                        All mail
                        </TabsTrigger>
                        <TabsTrigger
                        value="unread"
                        className="text-zinc-600 dark:text-zinc-200"
                        >
                        Unread
                        </TabsTrigger>
                    </TabsList> */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="flex flex-row ml-auto">
                                    <div className="font-semibold">3</div>
                                    <EyeIcon className="ml-1 h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem disabled><div className="font-semibold">3 live connections</div></DropdownMenuItem>
                                <Separator />
                                <DropdownMenuItem>(You) dJuFhcycPHcCEqA=</DropdownMenuItem>
                                <DropdownMenuItem>eKaGidzdQIdDFrB=</DropdownMenuItem>
                                <DropdownMenuItem>fLwHjeaeRJeEGsC=</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <Separator />
                    <TabsContent value="all" className="m-0">
                    <MailList items={mails} />
                    </TabsContent>
                    <TabsContent value="unread" className="m-0">
                    <MailList items={mails.filter((item) => !item.read)} />
                    </TabsContent>
                </Tabs>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={defaultLayout[2]} minSize={30}>
                <MailDisplay
                    mail={mails.find((item) => item.id === mail.selected) || null}
                />
                </ResizablePanel>
            </ResizablePanelGroup>
            </TooltipProvider>
        <Dialog open={openDialog}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Welcome to API72 Websocket Sandbox!</DialogTitle>
                    <DialogDescription>
                    Get to know Websocket API with a live hands-on UI demo that interfaces with all of your websocket&apos;s features
                    </DialogDescription>
                </DialogHeader>
                <div className="flex items-center space-x-2 mt-2">
                    <div className="grid flex-1 gap-2">
                    <Input
                        id="link"
                        placeholder="https://xxxxxxxxxx.execute-api.us-east-2.amazonaws.com/v3/"
                    />
                    <span className="text-xs text-muted">Please enter a verified API72 url</span>
                    </div>
                </div>
                <Button type="button" variant="secondary" disabled={status === 0 || status === 1}>
                    Continue
                </Button>
                <DialogFooter className="sm:justify-start">

                </DialogFooter>
            </DialogContent>
        </Dialog>
    </>
  )
}