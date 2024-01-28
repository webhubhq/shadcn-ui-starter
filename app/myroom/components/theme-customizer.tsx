"use client"

import * as React from "react"
import {
  CheckIcon,
  CopyIcon,
  InfoCircledIcon,
  MoonIcon,
  ResetIcon,
  SunIcon,
} from "@radix-ui/react-icons"
import template from "lodash.template"
import { Paintbrush } from "lucide-react"
import { useTheme } from "next-themes"

import { cn } from "@/lib/utils"
// import { useConfig } from "@/hooks/use-config"
// import { ThemeWrapper } from "@/components/theme-wrapper"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Skeleton } from "@/components/ui/skeleton"
import { Theme, themes } from "@/registry/themes"

import "@/styles/mdx.css"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function ThemeCustomizer({
    selectedColor = "rose",
    setSelectedColor = () => {},
    backgroundColor = "dark",
    setBackgroundColor = () => {},
    clearPixels = () => {} }) {
  // const [config, setConfig] = useConfig()
  const { resolvedTheme: mode } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="flex space-x-2">
      <Drawer>
        <DrawerTrigger asChild>
          <Button variant="outline" className="md:hidden">
            <Paintbrush className="mr-2 h-4 w-4" />
            Customize
          </Button>
        </DrawerTrigger>
        <DrawerContent className="p-6 pt-0">
          <Customizer />
        </DrawerContent>
      </Drawer>
      <div className="hidden md:flex">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">
              <Paintbrush className="mr-2 h-4 w-4" />
              Customize
            </Button>
          </PopoverTrigger>
          <PopoverContent
            align="center"
            className="z-40 w-[340px] rounded-[0.5rem] bg-white p-6 dark:bg-zinc-950"
          >
            <Customizer
                selectedColor={selectedColor}
                setSelectedColor={setSelectedColor}
                backgroundColor={backgroundColor}
                setBackgroundColor={setBackgroundColor}
                clearPixels={clearPixels}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}

function Customizer({
    selectedColor = "rose",
    setSelectedColor = () => {},
    backgroundColor = "dark",
    setBackgroundColor = () => {},
    clearPixels = () => {},
}) {
  const [mounted, setMounted] = React.useState(false)
  const { setTheme: setMode, resolvedTheme: mode } = useTheme()
  // const [config, setConfig] = useConfig()

  React.useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <>
    <div className="flex items-start pt-4 md:pt-0 mb-2">
        <div className="space-y-1 pr-2">
          <div className="font-semibold leading-none tracking-tight">
            Settings
          </div>
          <div className="text-xs text-muted-foreground">
            To keep things interesting, you can choose different colors and backgrounds from my room!
          </div>
        </div>
      </div>
      <div className="flex flex-1 flex-col space-y-4 md:space-y-6">
        <div className="space-y-1.5">
          <Label className="text-xs">Color</Label>
          <div className="grid grid-cols-3 gap-2">
            {themes.filter(({ name }) => ["rose", "orange", "blue", "green", "yellow", "violet"].includes(name)).map((theme) => {
              const isActive = selectedColor === theme.name

              return mounted ? (
                <Button
                  variant={"outline"}
                  size="sm"
                  key={theme.name}
                    // @ts-ignore
                    onClick={() => setSelectedColor(theme.name)}
                  className={cn(
                    "justify-start",
                    isActive && "border-2 border-primary"
                  )}
                  style={
                    {
                      "--theme-primary": `hsl(${
                        theme?.activeColor[mode === "dark" ? "dark" : "light"]
                      })`,
                    } as React.CSSProperties
                  }
                >
                  <span
                    className={cn(
                      "mr-1 flex h-5 w-5 shrink-0 -translate-x-1 items-center justify-center rounded-full bg-[--theme-primary]"
                    )}
                  >
                    {isActive && <CheckIcon className="h-4 w-4 text-white" />}
                  </span>
                  {theme.label}
                </Button>
              ) : (
                <Skeleton className="h-8 w-full" key={theme.name} />
              )
            })}
          </div>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Reset Whiteboard</Label>
          <div className="grid grid-cols-5 gap-2">
            <Button
                  variant={"outline"}
                  size="sm"
                //   onClick={() => {
                //     setConfig({
                //       ...config,
                //       radius: parseFloat(value),
                //     })
                //   }}
                onClick={() => clearPixels()}
                  className={cn(
                    "px-20"
                    // config.radius === parseFloat(value) && "border-2 border-primary"
                  )}
                >
                  Clear
                </Button>
          </div>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Mode</Label>
          <div className="grid grid-cols-3 gap-2">
            {mounted ? (
              <>
                <Button
                  variant={"outline"}
                  size="sm"
                  onClick={() => {
                    // @ts-ignore
                    setBackgroundColor("light");
                    setMode("light");
                    }}
                  className={cn(mode === "light" && "border-2 border-primary")}
                >
                  <SunIcon className="mr-1 -translate-x-1" />
                  Light
                </Button>
                <Button
                  variant={"outline"}
                  size="sm"
                  onClick={() => {
                    // @ts-ignore
                    setBackgroundColor("dark");
                    setMode("dark");
                }}
                  className={cn(mode === "dark" && "border-2 border-primary")}
                >
                  <MoonIcon className="mr-1 -translate-x-1" />
                  Dark
                </Button>
              </>
            ) : (
              <>
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </>
            )}
          </div>
          <div className="text-xs text-muted-foreground">
            Please don&apos;t turn on the white lights when I&apos;m sleeping.
          </div>
        </div>
      </div>
    </>
  )
}



function CustomizerCode() {
  // const [config] = useConfig()
  // const activeTheme = themes.find((theme) => theme.name === config.theme)
  const activeTheme = themes.find((theme) => theme.name === "zinc")

  return (
    // <ThemeWrapper defaultTheme="zinc" className="relative space-y-4">
      <div data-rehype-pretty-code-fragment="">
        <pre className="max-h-[450px] overflow-x-auto rounded-lg border bg-zinc-950 py-4 dark:bg-zinc-900">
          <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
            <span className="line text-white">@layer base &#123;</span>
            <span className="line text-white">&nbsp;&nbsp;:root &#123;</span>
            <span className="line text-white">
              &nbsp;&nbsp;&nbsp;&nbsp;--background:{" "}
              {activeTheme?.cssVars.light["background"]};
            </span>
            <span className="line text-white">
              &nbsp;&nbsp;&nbsp;&nbsp;--foreground:{" "}
              {activeTheme?.cssVars.light["foreground"]};
            </span>
            {[
              "card",
              "popover",
              "primary",
              "secondary",
              "muted",
              "accent",
              "destructive",
            ].map((prefix) => (
              <>
                <span className="line text-white">
                  &nbsp;&nbsp;&nbsp;&nbsp;--{prefix}:{" "}
                  {
                    activeTheme?.cssVars.light[
                      prefix as keyof typeof activeTheme.cssVars.light
                    ]
                  }
                  ;
                </span>
                <span className="line text-white">
                  &nbsp;&nbsp;&nbsp;&nbsp;--{prefix}-foreground:{" "}
                  {
                    activeTheme?.cssVars.light[
                      `${prefix}-foreground` as keyof typeof activeTheme.cssVars.light
                    ]
                  }
                  ;
                </span>
              </>
            ))}
            <span className="line text-white">
              &nbsp;&nbsp;&nbsp;&nbsp;--border:{" "}
              {activeTheme?.cssVars.light["border"]};
            </span>
            <span className="line text-white">
              &nbsp;&nbsp;&nbsp;&nbsp;--input:{" "}
              {activeTheme?.cssVars.light["input"]};
            </span>
            <span className="line text-white">
              &nbsp;&nbsp;&nbsp;&nbsp;--ring:{" "}
              {activeTheme?.cssVars.light["ring"]};
            </span>
            <span className="line text-white">
              &nbsp;&nbsp;&nbsp;&nbsp;--radius: config.radiusrem;
            </span>
            <span className="line text-white">&nbsp;&nbsp;&#125;</span>
            <span className="line text-white">&nbsp;</span>
            <span className="line text-white">&nbsp;&nbsp;.dark &#123;</span>
            <span className="line text-white">
              &nbsp;&nbsp;&nbsp;&nbsp;--background:{" "}
              {activeTheme?.cssVars.dark["background"]};
            </span>
            <span className="line text-white">
              &nbsp;&nbsp;&nbsp;&nbsp;--foreground:{" "}
              {activeTheme?.cssVars.dark["foreground"]};
            </span>
            {[
              "card",
              "popover",
              "primary",
              "secondary",
              "muted",
              "accent",
              "destructive",
            ].map((prefix) => (
              <>
                <span className="line text-white">
                  &nbsp;&nbsp;&nbsp;&nbsp;--{prefix}:{" "}
                  {
                    activeTheme?.cssVars.dark[
                      prefix as keyof typeof activeTheme.cssVars.dark
                    ]
                  }
                  ;
                </span>
                <span className="line text-white">
                  &nbsp;&nbsp;&nbsp;&nbsp;--{prefix}-foreground:{" "}
                  {
                    activeTheme?.cssVars.dark[
                      `${prefix}-foreground` as keyof typeof activeTheme.cssVars.dark
                    ]
                  }
                  ;
                </span>
              </>
            ))}
            <span className="line text-white">
              &nbsp;&nbsp;&nbsp;&nbsp;--border:{" "}
              {activeTheme?.cssVars.dark["border"]};
            </span>
            <span className="line text-white">
              &nbsp;&nbsp;&nbsp;&nbsp;--input:{" "}
              {activeTheme?.cssVars.dark["input"]};
            </span>
            <span className="line text-white">
              &nbsp;&nbsp;&nbsp;&nbsp;--ring:{" "}
              {activeTheme?.cssVars.dark["ring"]};
            </span>
            <span className="line text-white">&nbsp;&nbsp;&#125;</span>
            <span className="line text-white">&#125;</span>
          </code>
        </pre>
      </div>
    // </ThemeWrapper>
  )
}

function getThemeCode(theme: Theme, radius: number) {
  if (!theme) {
    return ""
  }

  return template(BASE_STYLES_WITH_VARIABLES)({
    colors: theme.cssVars,
    radius,
  })
}

const BASE_STYLES_WITH_VARIABLES = `
@layer base {
  :root {
    --background: <%- colors.light["background"] %>;
    --foreground: <%- colors.light["foreground"] %>;
    --card: <%- colors.light["card"] %>;
    --card-foreground: <%- colors.light["card-foreground"] %>;
    --popover: <%- colors.light["popover"] %>;
    --popover-foreground: <%- colors.light["popover-foreground"] %>;
    --primary: <%- colors.light["primary"] %>;
    --primary-foreground: <%- colors.light["primary-foreground"] %>;
    --secondary: <%- colors.light["secondary"] %>;
    --secondary-foreground: <%- colors.light["secondary-foreground"] %>;
    --muted: <%- colors.light["muted"] %>;
    --muted-foreground: <%- colors.light["muted-foreground"] %>;
    --accent: <%- colors.light["accent"] %>;
    --accent-foreground: <%- colors.light["accent-foreground"] %>;
    --destructive: <%- colors.light["destructive"] %>;
    --destructive-foreground: <%- colors.light["destructive-foreground"] %>;
    --border: <%- colors.light["border"] %>;
    --input: <%- colors.light["input"] %>;
    --ring: <%- colors.light["ring"] %>;
    --radius: <%- radius %>rem;
  }

  .dark {
    --background: <%- colors.dark["background"] %>;
    --foreground: <%- colors.dark["foreground"] %>;
    --card: <%- colors.dark["card"] %>;
    --card-foreground: <%- colors.dark["card-foreground"] %>;
    --popover: <%- colors.dark["popover"] %>;
    --popover-foreground: <%- colors.dark["popover-foreground"] %>;
    --primary: <%- colors.dark["primary"] %>;
    --primary-foreground: <%- colors.dark["primary-foreground"] %>;
    --secondary: <%- colors.dark["secondary"] %>;
    --secondary-foreground: <%- colors.dark["secondary-foreground"] %>;
    --muted: <%- colors.dark["muted"] %>;
    --muted-foreground: <%- colors.dark["muted-foreground"] %>;
    --accent: <%- colors.dark["accent"] %>;
    --accent-foreground: <%- colors.dark["accent-foreground"] %>;
    --destructive: <%- colors.dark["destructive"] %>;
    --destructive-foreground: <%- colors.dark["destructive-foreground"] %>;
    --border: <%- colors.dark["border"] %>;
    --input: <%- colors.dark["input"] %>;
    --ring: <%- colors.dark["ring"] %>;
  }
}
`