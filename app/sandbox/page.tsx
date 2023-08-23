"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import $ from "jquery"
import { cn } from "@/lib/utils"

import { Resend } from 'resend';

const resend = new Resend('re_jXrzMemo_MCPVudu8H2vqBJtpMuwC7jfM');

function deployEmail() {
  console.log('at email')
  resend.emails.send({
    from: 'webhubhq@gmail.com',
    to: 'jricramc@mit.edu',
    subject: 'Hello from WebHub',
    html: '<p>Congrats on sending your <strong>first email</strong>!</p>'
  });
}


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

import { CheckCircledIcon, ChevronRightIcon } from '@radix-ui/react-icons'
  
import { Button } from "@/components/ui/button"

const components: { title: string; href: string; description: string }[] = [
  {
    title: "Alert Dialog",
    href: "/docs/primitives/alert-dialog",
    description:
      "A modal dialog that interrupts the user with important content and expects a response.",
  },
  {
    title: "Hover Card",
    href: "/docs/primitives/hover-card",
    description:
      "For sighted users to preview content available behind a link.",
  },
  {
    title: "Progress",
    href: "/docs/primitives/progress",
    description:
      "Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
  },
  {
    title: "Scroll-area",
    href: "/docs/primitives/scroll-area",
    description: "Visually or semantically separates content.",
  },
  {
    title: "Tabs",
    href: "/docs/primitives/tabs",
    description:
      "A set of layered sections of content—known as tab panels—that are displayed one at a time.",
  },
  {
    title: "Tooltip",
    href: "/docs/primitives/tooltip",
    description:
      "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
  },
]

export default function Page({ subHeaderName = "Sandbox" }) {

  const [baseUrl, setBaseUrl] = useState<string>();

  const [selectedStep, setSelectedStep] = useState(0);
  const [selectedQuestion, setSelectedQuestion] = useState<number | null>(0);

  const [reviewStage, setReviewStage] = useState<number | null>(0);
  const [deployStage, setDeployStage] = useState(null);

  const [q1Answer, setQ1Answer] = useState();
  const [q2Answer, setQ2Answer] = useState();

  const baseUrlSelect = <Select onValueChange={(val: string) => setBaseUrl(val)}>
    <SelectTrigger
        className="flex-1"
        style={{ maxWidth: 600, margin: '0px auto', alignSelf: 'center' }}
    >
        <SelectValue placeholder="Base URL"/>
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectLabel>Your API Base URL</SelectLabel>
        <SelectItem value="light">Light</SelectItem>
        <SelectItem value="dark">Dark</SelectItem>
        <SelectItem value="system">System</SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>

  const transition = "0.0s";

  const step = ({ text = '', selected = false, done = false, onClick = () => {} }) => <div style={{
      borderRadius: 19,
      border: `1px solid ${selected ? '#407BFF' : '#EEEDF0'}`,
      background: selected ? '#407BFF1A' : 'white',
      display: 'flex',
      flexDirection: 'row',
      height: 28,
      alignItems: 'center',
      alignSelf: 'center',
      padding: '0px 6px',
      cursor: 'pointer',
  }}
    onClick={onClick}
  >
    <CheckCircledIcon color={(done || selected) ? '#407BFF' : '#72737A'} />
    <div style={{
      fontSize: 12,
      color: (done || selected) ? '#407BFF' : '#72737A',
      marginLeft: 3,
      marginRight: 3,
    }}>{text}</div>
  </div>

  const chevron = <div className="mx-[20px] flex flex-row" style={{ alignSelf: 'center' }}>
    <ChevronRightIcon color="#9FA1A8" />
  </div>

  const learnMoreAboutYourAPI = {
    question: 'Learn more about your API',
    description: 'So your waiting for your awesome API, but what is it?',
    answerComponent: <CardContent className="pl-[50px]">
      <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger className="font-bold" style={{ fontFamily: 'Arial', textDecoration: 'none' }}>What's so special about my API?</AccordionTrigger>
        <AccordionContent>
          Explain what a Dynamic API is.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger className="font-bold" style={{ fontFamily: 'Arial', textDecoration: 'none' }}>Is it user friendly?</AccordionTrigger>
        <AccordionContent>
          Yes. It comes with default styles that matches the other
          components&apos; aesthetic.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger className="font-bold" style={{ fontFamily: 'Arial', textDecoration: 'none' }}>How do I add to it?</AccordionTrigger>
        <AccordionContent>
          Yes. It's animated by default, but you can disable it if you prefer.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
    </CardContent>,
    setAnswer: setQ1Answer,
  };

  const buildContent = [
    {
      id: 'build-content-q-1',
      question: 'Building the resources and services for your API link',
      description: 'Takes about 2 - 5 minutes. We\'ll email you your API link when we\'re done.',
      answerComponent: <CardContent className="pl-[50px]">
        <div className="flex flex-row flex-wrap mb-[15px]">
          <Badge variant="outline" style={{ borderRadius: 4, padding: '4px 8px' }}>Stacks: Integration...</Badge>
        </div>
        <Progress value={20} className="w-[100%] h-[10px] mb-[10px]" />
      </CardContent>,
      setAnswer: setQ1Answer,
    },
    {
      ...learnMoreAboutYourAPI,
    }
    
  ]

  const deployContent = [
    {
      id: 'deploy-content-q-1',
      question: 'Creating your custom API link',
      description: 'Takes about 2 - 5 minutes.',
      answerComponent: <CardContent className="pl-[50px]">
        <div className="flex flex-row flex-wrap mb-[15px]">
          <Badge variant="outline" style={{ borderRadius: 4, padding: '4px 8px' }}>Social Media: Instagram</Badge>
        </div>
        <Progress value={20} className="w-[100%] h-[10px] mb-[10px]" />
      </CardContent>,
      setAnswer: setQ1Answer,
    },
    {
      ...learnMoreAboutYourAPI
    }
  ]

  const reviewContent = [
    {
      question: 'Resources and services',
      description: 'Generated based off of your survey responses',
      answerComponent: <CardContent className="pl-[50px]">
        <div>
        <div className="items-top flex space-x-2">
          <Checkbox id="terms1" />
          <div className="grid gap-1.5 leading-none">
            <label
              htmlFor="terms1"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Accept terms and conditions
            </label>
            <p className="text-sm text-muted-foreground">
              You agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
          <Separator className="my-4" />
          <div className="items-top flex space-x-2">
            <Checkbox id="terms1" />
            <div className="grid gap-1.5 leading-none">
              <label
                htmlFor="terms1"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Accept terms and conditions
              </label>
              <p className="text-sm text-muted-foreground">
                You agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </div>
          <Separator className="my-4" />
          <div className="items-top flex space-x-2">
            <Checkbox id="terms1" />
            <div className="grid gap-1.5 leading-none">
              <label
                htmlFor="terms1"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Accept terms and conditions
              </label>
              <p className="text-sm text-muted-foreground">
                You agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      </CardContent>,
      setAnswer: setQ1Answer,
    },
    {
      question: 'Whats a good email for us to reach you with?',
      description: 'We\'ll email you your API link and important info about your API',
      answerComponent: <CardContent className="pl-[50px]">
        <Input type="email" placeholder="Email" />
      </CardContent>,
      setAnswer: setQ1Answer,
    },
  ]

  const surveyQuestions = [
    {
      question: 'What are you building?',
      description: 'My project is most like a...',
      answerComponent: <CardContent className="pl-[50px]">
        <RadioGroup defaultValue="comfortable">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="website" id="r1" />
              <Label htmlFor="r1">Website</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="microservice-api" id="r2" />
              <Label htmlFor="r2">Microservice / API</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="app" id="r3" />
              <Label htmlFor="r3">App</Label>
            </div>
        </RadioGroup>
      </CardContent>,
      setAnswer: setQ1Answer,
    },
    {
      question: `What kind of ${q1Answer || 'website'} are you building?`,
      description: undefined,
      answerComponent: <CardContent className="flex flex-row flex-1 pb-[40px] px-[50px]">
        <Select>
          <SelectTrigger className="w-[180px] flex-1">
            <SelectValue placeholder="Select a type" />
          </SelectTrigger>
          <SelectContent style={{ height: 100, overflowY: 'scroll'}}>
            <SelectGroup>
              <SelectLabel>Fruits</SelectLabel>
              <SelectItem value="apple">Apple</SelectItem>
              <SelectItem value="banana">Banana</SelectItem>
              <SelectItem value="blueberry">Blueberry</SelectItem>
              <SelectItem value="grapes">Grapes</SelectItem>
              <SelectItem value="pineapple">Pineapple</SelectItem>
              <SelectItem value="apple1">Apple</SelectItem>
              <SelectItem value="banana2">Banana</SelectItem>
              <SelectItem value="blueberry3">Blueberry</SelectItem>
              <SelectItem value="grapes4">Grapes</SelectItem>
              <SelectItem value="pineapple5">Pineapple</SelectItem>
              <SelectItem value="apple6">Apple</SelectItem>
              <SelectItem value="banana7">Banana</SelectItem>
              <SelectItem value="blueberry8">Blueberry</SelectItem>
              <SelectItem value="grapes9">Grapes</SelectItem>
              <SelectItem value="pineapple10">Pineapple</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </CardContent>,
      setAnswer: setQ2Answer,
    },
    {
      question: 'Do you have a company or idea in mind that is similar to what you are trying to do?',
      description: `My ${q1Answer || 'website'} idea is like…`,
      answerComponent: <CardContent className="flex flex-col flex-1 pb-[40px] px-[50px]">
        <div className="flex flex-row flex-wrap mb-[15px]">
          <Badge variant="outline" style={{ borderRadius: 4, padding: '4px 8px' }}>Social Media: Instagram</Badge>
        </div>
        <Command className="rounded-lg border shadow-md">
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Suggestions">
              <CommandItem>
                <Calendar className="mr-2 h-4 w-4" />
                <span>Calendar</span>
              </CommandItem>
              <CommandItem>
                <Smile className="mr-2 h-4 w-4" />
                <span>Search Emoji</span>
              </CommandItem>
              <CommandItem>
                <Calculator className="mr-2 h-4 w-4" />
                <span>Calculator</span>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Settings">
              <CommandItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
                <CommandShortcut>⌘P</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <CreditCard className="mr-2 h-4 w-4" />
                <span>Billing</span>
                <CommandShortcut>⌘B</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
                <CommandShortcut>⌘S</CommandShortcut>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </CardContent>,
      setAnswer: setQ2Answer,
    },
    {
      question: 'What AWS resources / services would you like to add to your API',
      description: 'We recommend to skip this if you are not a technical user / developer',
      answerComponent: <CardContent className="pl-[50px]">
        <div className="flex flex-row flex-wrap mb-[10px]">
          {['Badge 1', 'Badge 2', 'Badge 3', 'Badge 4', 'Badge 5'].map((txt) => <Badge className="mr-[5px] mb-[5px]">{txt}</Badge>)}
        </div>
        <Command className="rounded-lg border shadow-md">
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Suggestions">
              <CommandItem>
                <Calendar className="mr-2 h-4 w-4" />
                <span>Calendar</span>
              </CommandItem>
              <CommandItem>
                <Smile className="mr-2 h-4 w-4" />
                <span>Search Emoji</span>
              </CommandItem>
              <CommandItem>
                <Calculator className="mr-2 h-4 w-4" />
                <span>Calculator</span>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Settings">
              <CommandItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
                <CommandShortcut>⌘P</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <CreditCard className="mr-2 h-4 w-4" />
                <span>Billing</span>
                <CommandShortcut>⌘B</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
                <CommandShortcut>⌘S</CommandShortcut>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </CardContent>,
      setAnswer: setQ1Answer,
    },
    {
      question: `Why are you building this ${q1Answer || 'website'}?`,
      description: 'I am a...',
      answerComponent: <CardContent className="pl-[50px]">
        <RadioGroup defaultValue="comfortable">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="website" id="r1" />
              <Label htmlFor="r1">Product Manager</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="microservice-api" id="r2" />
              <Label htmlFor="r2">Developer</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="app" id="r3" />
              <Label htmlFor="r3">Hobbiest</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="app" id="r3" />
              <Label htmlFor="r3">curious person</Label>
            </div>
        </RadioGroup>
      </CardContent>,
      setAnswer: setQ1Answer,
    },
    {
      question: `How far are you into the design process?`,
      description: 'We’re trying to figure out where your heads at.',
      answerComponent: <CardContent className="pl-[50px]">
        <RadioGroup defaultValue="comfortable">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="website" id="r1" />
              <Label htmlFor="r1">I have an idea</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="microservice-api" id="r2" />
              <Label htmlFor="r2">I know what I want on a high level</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="app" id="r3" />
              <Label htmlFor="r3">I know the exact services / AWS resources I want</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="app" id="r3" />
              <Label htmlFor="r3">Just trying out this sandbox</Label>
            </div>
        </RadioGroup>
      </CardContent>,
      setAnswer: setQ1Answer,
    },
    {
      question: `Write a quick description of your idea / project`,
      description: 'Tell us the high level idea for your project.',
      answerComponent: <CardContent className="">
        <Textarea placeholder="Type your message here." />
      </CardContent>,
      setAnswer: setQ1Answer,
    },
  ];

  const surveyCard = ({ id = '', selected = false, number = 0, question = '', description = '', answerComponent = undefined, setAnswer }) => <div style={{ position: 'relative' }}>
    <Card id={id} className="w-[100%] p-[20px] shadow-none" style={{ position: 'relative' }}>
      <CardHeader>
        <CardTitle style={{ fontSize: 20, fontFamily: 'Arial', display: 'flex', flexDirection: 'row' }}>
          <div style={{ minWidth: 30, lineHeight: '28px' }}>{`${number}.`}</div>
          <div className="flex" style={{ lineHeight: '28px' }}>{question}</div></CardTitle>
        <CardDescription style={{ paddingLeft: 30, paddingTop: 10, fontFamily: 'Arial' }}>{description}</CardDescription>
      </CardHeader>
      <Separator className="mt-[15px] mb-[35px]" />
      {answerComponent}
    </Card>
    {!selected && <div style={{ position: 'absolute', top: 0, width: '100%', height: '100%', backgroundColor: '#F6F8FABF' }} />}
  </div>

const surveyButton = ({ text = '', selected = false, submitBtn = false, done = false, onClick = () => {} }) => <div style={{
  borderRadius: 19,
  border: `${(submitBtn || selected) ? 2 : 1}px solid ${selected ? '#407BFF' : '#DCDFE1'}`,
  background: submitBtn ? '#407BFFE5' : (selected ? '#407BFF1A' : 'white'),
  display: 'flex',
  flexDirection: 'row',
  height: 38,
  width: 180,
  alignItems: 'center',
  justifyContent: 'center',
  alignSelf: 'center',
  padding: '0px 6px',
  cursor: 'pointer',
  fontWeight: selected ? 'bold' : 'normal',
}}
onClick={onClick}
>
  <div style={{
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'Arial',
    color: submitBtn ? 'white' : ((done || selected) ? '#407BFF' : '#72737A'),
    marginLeft: 3,
    marginRight: 3,
  }}>{text}</div>
</div>

  const surveyButtonSpacer = ({
    key = '',
    index = undefined,
    state = 'none',
    last = false,
    lastStage = undefined,
    onClick = () => {},
    submitText = '',
    handleSubmit = () => {},
  }) => <div key={key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    {!(state === 'none' && last) && <div style={{ transition, height: state === 'next' ? 25 : (state === 'prev' ? 100 : 20), opacity: state === 'prev' ? 0.3 : 1 }}>
      <Separator orientation="vertical" />
    </div>}
    <div style={{ transition, height: state === 'none' ? 0 : 38, opacity: state === 'none' ? 0 : 1 }}>
      {surveyButton({
        text: state === 'next' ? ((last || index === lastStage) ? submitText : 'Next Question') : 'Previous Question',
        selected: state === 'next',
        submitBtn: (last || index === lastStage),
        onClick: state === 'none' ? () => {} : ((last || index === lastStage) ? handleSubmit : onClick),
      })}
    </div>
    {!last && <div style={{ transition, height: state === 'next' ? 100 : (state === 'prev' ? 25 : 20), opacity: state === 'next' ? 0.3 : 1 }}>
      <Separator orientation="vertical" />
    </div>}
  </div>

  const content = [
    {
      id: 'container-survey',
      name: 'Survey',
      content: surveyQuestions,
      stage: selectedQuestion,
      disableUnselectedStages: selectedQuestion !== null,
      setStage: setSelectedQuestion,
      submit: {
        text: 'Review',
        handle: () => {
          setSelectedQuestion(null)
          setSelectedStep(1)
        }
      }
    },
    {
      id: 'container-review',
      name: 'Review',
      content: reviewContent,
      stage: reviewStage,
      disableUnselectedStages: reviewStage !== null,
      setStage: setReviewStage,
      submit: {
        text: 'Deploy my API!',
        handle: () => {
          setReviewStage(null)
          setSelectedStep(2)
        }
      }
    },
    {
      id: 'container-deploy',
      name: 'Deploy',
      content: deployContent,
      stage: 0,
      lastStage: 0,
      disableUnselectedStages: false,
      setStage: () => {},
      submit: {
        text: 'Build',
        handle: () => {
          setSelectedStep(3);
          console.log('before deploy email')
          deployEmail();
        }
      }
    },
    
    {
      id: 'container-build',
      name: 'Build',
      content: buildContent,
      stage: 0,
      lastStage: 0,
      disableUnselectedStages: false,
      setStage: () => {},
      submit: {
        text: 'Try out my API',
        handle: () => console.log('done!')
      }
    },
  ];

  const scrollOffset = 100

  useEffect(() => {
    const $container = $(`#${content[0].id}`);
    if (selectedQuestion !== undefined && selectedQuestion !== null) {
      console.log('selectedQuestion: ', selectedQuestion);

      let scrollTop = 0;
      if (selectedQuestion !== 0) {
        const $scrollTo = $(`#${content[0].id}-q-${selectedQuestion}`);
        // console.log('$scrollTo.offset().top: ', $scrollTo.offset().top)
        // console.log('$container.offset().top: ', $container.offset().top)
        // console.log('$container.scrollTop(): ', $container.scrollTop())
        // console.log('$scrollTo.position(): ', $scrollTo.position())
        scrollTop = $scrollTo.offset().top - $container.offset().top + $container.scrollTop() - scrollOffset;
      }
      
      $container.animate({
        scrollTop,
      });
    }
    
  }, [selectedQuestion])

  useEffect(() => {
    const $container = $(`#${content[1].id}`);
    if (reviewStage !== undefined && reviewStage !== null) {
      console.log('reviewStage: ', reviewStage);

      let scrollTop = 0;
      if (reviewStage !== 0) {
        const $scrollTo = $(`#${content[1].id}-q-${reviewStage}`);
        // console.log('$scrollTo.offset().top: ', $scrollTo.offset().top)
        // console.log('$container.offset().top: ', $container.offset().top)
        // console.log('$container.scrollTop(): ', $container.scrollTop())
        // console.log('$scrollTo.position(): ', $scrollTo.position())
        scrollTop = $scrollTo.offset().top - $container.offset().top + $container.scrollTop() - scrollOffset;
      }
      
      $container.animate({
        scrollTop,
      });
    }
    
  }, [reviewStage])

  return (
    <div
        className="flex flex-col bg-white"
        style={{ width: '100vw', height: '100vh' }}
    >
        <div
            className="align-center flex h-[70px] flex-row px-[28px]"
            style={{ borderBottom: '1px solid #F3F5F7', boxShadow: '0px 1px 4px 0px rgba(0, 0, 0, 0.05)' }}
        >
            <div style={{ margin: 'auto 0px' }}>
                <img src="/webhub-logo-2.png"  width="50px" />
            </div>
            <div
                style={{ color: '#02062B', fontSize: 22, fontWeight: 'bold', fontFamily: 'Arial', textAlign: 'center', alignSelf: 'center', marginLeft: 10 }}
            >WebHUB</div>
            <div style={{ color: '#797387', fontSize: 16, fontWeight: 'normal', fontFamily: 'Arial', textAlign: 'center', alignSelf: 'center', marginLeft: 6 }}>{subHeaderName}</div>
            
            <div style={{ flex: 1 }} />

            <div
                style={{ color: '#353743', fontSize: 14, fontWeight: 'bold', fontFamily: 'Arial', textAlign: 'center', alignSelf: 'center' }}
            >Documentation</div>
            <div style={{ height: 20, width: 1, backgroundColor: 'rgba(0, 0, 0, 0.2)', margin: '0px 20px', alignSelf: 'center' }} />
            <div
                style={{ color: '#353743', fontSize: 14, fontWeight: 'bold', fontFamily: 'Arial', textAlign: 'center', alignSelf: 'center' }}
            >Feedback</div>
        </div>
        <div
            style={{ borderBottom: '1px solid #F3F5F7', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: 60 }}
        >
          {[
            step({
              text: '1. Survey',
              selected: selectedStep === 0,
              done: selectedQuestion === null,
              onClick: selectedQuestion === null ? () => setSelectedStep(0) : () => {}
            }),
            chevron,
            step({
              text: '2. Review',
              selected: selectedStep === 1,
              done: reviewStage === null,
              onClick: reviewStage === null || selectedQuestion === null ? () => setSelectedStep(1) : () => {}
            }),
            chevron,
            step({
              text: '3. Deploy',
              selected: selectedStep === 2,
              done: false,
              onClick: () => {
                if (reviewStage === null) {
                  setSelectedStep(2);
                  console.log('before deploy email')
                  deployEmail();
                }
              }
            }),
            chevron,
            step({
              text: '4. Build',
              selected: selectedStep === 3,
              done: false,
              onClick: false ? () => setSelectedStep(3) : () => {}
            })
          ]}
        </div>
        <div
          className="my-sandbox-container"
          style={{
            display: 'flex',
            flex: 1,
            flexDirection: 'row',
            width: '100%',
            height: 'calc(100% - 130px)',
            backgroundColor: '#F6F8FA',
            justifyContent: 'center',
            overflowY: 'hidden',
            position: 'relative',
            top: 0,
          }}
        >
          {content.map(({
            id,
            name,
            content,
            stage,
            lastStage,
            disableUnselectedStages,
            setStage,
            submit,
            }, i) => <div
            id={id}
            style={{
              display: selectedStep === i ? 'flex' : 'none',
              flex: 1,
              flexDirection: 'row',
              width: '100%',
              height: '100%',
              justifyContent: 'center',
              overflowY: 'scroll',
              position: 'absolute',
              top: 0,
            }}
          >
            <div style={{ transition, position: 'relative', top: 0, display: 'flex', flex: 1, flexDirection: 'column', maxWidth: 540, padding: '0px 25px' }}>
              <div style={{ color: '#000000', fontWeight: 'bold', fontSize: 24, margin: '52px 0px 25px 0px' }}>{name}</div>
              {content.map(({ question, description, answerComponent, setAnswer }, i, arr) => <>
                {surveyCard({
                  id: `${id}-q-${i}`,
                  selected: stage === i || !disableUnselectedStages,
                  number: i + 1,
                  question,
                  description,
                  answerComponent,
                  setAnswer,
                })}
                {surveyButtonSpacer({
                  key: `${name}-${i}`,
                  index: i,
                  last: arr.length - 1 === i,
                  lastStage: lastStage,
                  state: stage === i
                    ? 'next'
                    : (stage === i + 1
                      ? 'prev'
                      : 'none'),
                  onClick: stage === i
                  ? () => setStage(i + 1)
                  : (stage === i + 1
                    ? () => setStage(i)
                    : () => {}),
                  submitText: submit.text,
                  handleSubmit: submit.handle,
                })}
              </>)}
              <div style={{ paddingBottom: 100 }} />
            </div>
          </div>)}
        </div>
    </div>
  )
}
