"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import $ from "jquery"
import { cn } from "@/lib/utils"
import { RID, apiRequest, deployCRUDAPI } from "@/utils/utils"
import { Resend } from 'resend';


// function deployEmail() {
//   console.log('at email')
//   resend.emails.send({
//     from: 'webhubhq@gmail.com',
//     to: 'jricramc@mit.edu',
//     subject: 'Hello from WebHub',
//     html: '<p>Congrats on sending your <strong>first email</strong>!</p>'
//   });
// }
const resend = new Resend('re_jXrzMemo_MCPVudu8H2vqBJtpMuwC7jfM');

function deployEmail() {
  console.log('at email');
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

import { CheckCircledIcon, ChevronRightIcon, StackIcon, LockOpen1Icon, ArchiveIcon, GearIcon } from '@radix-ui/react-icons'
  
import { Button } from "@/components/ui/button"


export default function Page({}) {

  const subHeaderName = "Sandbox"
  const [baseUrl, setBaseUrl] = useState<string>();

  const [selectedStep, setSelectedStep] = useState(0);

  const [surveyStage, setSurveyStage] = useState<number | null>(0);
  const [surveyStageComplete, setSurveyStageComplete] = useState(false);

  const [reviewStage, setReviewStage] = useState<number | null>(0);
  const [reviewStageComplete, setReviewStageComplete] = useState(false);

  const [deployStage, setDeployStage] = useState<number | null>(null);
  const [deployStageProgress, setDeployStageProgress] = useState(0);
  const [deployStageComplete, setDeployStageComplete] = useState(false);

  const [buildStage, setBuildStage] = useState(null);
  const [buildStageProgress, setBuildStageProgress] = useState(0);
  const [buildStageComplelte, setBuildStageComplete] = useState(false);

  const [q1Answer, setQ1Answer] = useState<string | undefined>();
  const [q2Answer, setQ2Answer] = useState<string | undefined>();
  const [q3Answer, setQ3Answer] = useState<string | undefined>();
  const [q4Answer, setQ4Answer] = useState({});
  const [q5Answer, setQ5Answer] = useState<string | undefined>();
  const [q6Answer, setQ6Answer] = useState<string | undefined>();
  const [q7Answer, setQ7Answer] = useState<string | undefined>();

  const [reviewOpts, setReviewOpts] = useState<any>([]);
  const [reviewEmail, setReviewEmail] = useState('');

  const reviewOptsList = [
    'dynamodb',
    's3',
    'lambda',
    'googleOAuth',
    'stripe',
  ];

  const reviewResourcesAndServices = {
    dynamodb: {
      name: 'AWS DynamoDB',
      endpoint: {
        method: 'GET',
        url: '/create/service/db/dynamodb'
      },
      reasons: {
        business: {
          inputName: 'product_database',
          description: 'Store and manage photo details, pricing, and availability'
        },
        users: {
          inputName: 'user_database',
          description: 'Store and manage user details'
        }
      }
    },
    s3: {
      name: 'AWS S3 Bucket',
      endpoint: {
        method: 'GET',
        url: '/create/service/db/s3'
      },
      reasons: {
        business: {
          inputName: 'product_s3_bucket',
          description: 'Efficiently store high-resolution photos, videos, and files for your business'
        },
      }
    },
    lambda: {
      name: 'AWS Lambda API',
      endpoint: {
        method: 'GET',
        url: '/create/service/lambda'
      },
      reasons: {
        business: {
          inputName: 'lambda_microservice',
          description: 'Trigger Webhooks as well as connect to third party APIs, service, and logic'
        },
      }
    },
    googleOAuth: {
      name: 'Google OAuth',
      endpoint: {
        method: 'POST',
        url: '/create/service/auth/google'
      },
      reasons: {
        users: {
          inputName: 'user_authentication',
          description: 'Authenticate users easily for your business / platform'
        },
      }
    },
    stripe: {
      name: 'Stripe API',
      endpoint: {
        method: 'POST',
        url: '/create/service/payment/stripe'
      },
      reasons: {
        business: {
          inputName: 'transaction_handler',
          description: 'Integrate an easy and secure way to make transactions for your business / platform'
        },
      }
    }
  };

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
      background: selected ? '#407BFF1A' : 'transparent',
      display: 'flex',
      flexDirection: 'row',
      height: 28,
      alignItems: 'center',
      alignSelf: 'center',
      padding: '0px 6px',
      cursor: 'pointer',
  }}
    className={`border-[ border${selected ? '#407BFF' : '#EEEDF0'}] dark:border-[ border-solid${selected ? '#407BFF' : '#050505'}]`}
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
    answerComponent: (disableForm: boolean) => <CardContent className="pl-[50px]">
      <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger className="font-bold" style={{ fontFamily: 'Arial', textDecoration: 'none' }}>What&apos;s so special about my API?</AccordionTrigger>
        <AccordionContent>
          At WebHUB we have revolutionized how APIs are built and operate by creating what is called a <em>Dynamic API</em>. A Dynamic API is a an API that can create infrastructure and services for itself and then exposes those thoses resoruce as endpoints. This means that developers only have to worry about what infrastructure and services they want and the API takes care of building the resources and creating endpoints for to talk to those resources. This ensures that your API applicaiton is completely self consistent and is able to evolve and adapt to your needs fricitonlessly.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger className="font-bold" style={{ fontFamily: 'Arial', textDecoration: 'none' }}>Is it user friendly?</AccordionTrigger>
        <AccordionContent>
          Yes! We created a fully functional front for our Dynamic API platoform. From start to finish you don&apos;t have to write or read one line of code.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger className="font-bold" style={{ fontFamily: 'Arial', textDecoration: 'none' }}>Is it developer friendly?</AccordionTrigger>
        <AccordionContent>
        Yes! We offer in depth documentation of our Dynamic API which you can test with WebHUB&apos;s API Kit (which you will be redirected to once you get your WebHUB API link). The API Kit has both a front end UI, but if your comfortable workign with APIs you can use your own Platform for example Postman.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
    </CardContent>,
  };

  const buildContent = [
    {
      id: 'build-content-q-1',
      question: 'Building the resources and services for your API',
      description: 'Takes about 2 - 5 minutes. We\'ll email you your API link when we\'re done.',
      answerComponent: (disableForm: boolean) => <CardContent className="pl-[50px]">
        <div className="mb-[15px] flex flex-row flex-wrap">
          <Badge variant="outline" style={{ borderRadius: 4, padding: '4px 8px' }}>Stacks: Integration...</Badge>
        </div>
        <Progress value={buildStageProgress} className="mb-[10px] h-[10px] w-[100%]" />
      </CardContent>,
    },
    {
      ...learnMoreAboutYourAPI,
    }
    
  ]

  const deployContent = [
    {
      id: 'deploy-content-q-1',
      question: 'Creating your custom API',
      description: 'Takes about 2 - 5 minutes.',
      answerComponent: (disableForm: boolean) => <CardContent className="pl-[50px]">
        <div className="mb-[15px] flex flex-row flex-wrap">
          <Badge variant="outline" style={{ borderRadius: 4, padding: '4px 8px' }}>Social Media: Instagram</Badge>
        </div>
        <Progress value={deployStageProgress} className="mb-[10px] h-[10px] w-[100%]" />
      </CardContent>,
    },
    {
      ...learnMoreAboutYourAPI
    }
  ]

  const reviewContent = [
    {
      question: 'Would you like to change the AWS Resource / Service selection?',
      description: 'This selection of AWS Resources / Services was dynamically created based off your survey responses.',
      answerComponent: (disableForm: boolean) => <CardContent className="pl-[50px]">
        <div>
        {reviewOpts.map(({ name = '', inputName = '', description = '', selected = false}, i: any, a: any) => <>
            <div className="items-top flex space-x-2">
              <Checkbox
                id={`terms-${i}`}
                disabled={disableForm}
                checked={selected}
                onCheckedChange={(val: boolean) => {
                  const arr = reviewOpts.slice();
                  arr[i].selected = val;
                  setReviewOpts(arr);
                }}
              />
              <div className="grid gap-1.5 leading-none" style={{ marginLeft: 15 }}>
                <Label htmlFor="email" className="text-md mb-[10px] font-bold">{name}</Label>
                <Input disabled={true} type="email" id="email" placeholder={inputName} />
                <p className="text-sm text-muted-foreground">
                  {description}
                </p>
              </div>
            </div>
            {a.length - 1 !== i && <Separator className="my-4 opacity-0" />}
          </>)}
          {reviewOpts.length === 0 && <Badge
            variant="outline"
            style={{ borderRadius: 4, padding: '4px 8px' }}
          >No services / resources. Your Core API will still be built and you can add resourcees / services manually</Badge>}
        </div>
      </CardContent>,
    },
    {
      question: 'Whats a good email for us to reach you with?',
      description: 'We\'ll email you your API link and important info about your API',
      answerComponent: (disableForm: boolean) => <CardContent className="pl-[50px]">
        <Input disabled={disableForm} type="email" placeholder="Email" value={reviewEmail} onChange={(ev) => setReviewEmail(ev.target.value)} />
      </CardContent>,
    },
  ]

  const surveyQuestions = [
    {
      question: 'What are you building?',
      description: 'My project is most like a...',
      answerComponent: (disableForm: boolean) => <CardContent className="pl-[50px]">
      <RadioGroup disabled={disableForm} value={q1Answer} onValueChange={(val: string) => setQ1Answer(val)}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="website" id="survey-q1-1" />
            <Label htmlFor="survey-q1-1">Website</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Microservice / API" id="survey-q1-2" />
            <Label htmlFor="survey-q1-2">Microservice / API</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="App" id="survey-q1-3" />
            <Label htmlFor="survey-q1-3">App</Label>
          </div>
      </RadioGroup>
    </CardContent>,
    },
    {
      question: `What kind of ${q1Answer || 'website'} are you building?`,
      description: undefined,
      answerComponent: (disableForm: boolean) => <CardContent className="flex flex-1 flex-col px-[50px] pb-[40px]">
      <div className="mb-[15px] flex flex-row flex-wrap">
        <Badge variant="outline" style={{ borderRadius: 4, padding: '4px 8px' }}>{q2Answer || 'Nothing selected'}</Badge>
      </div>
      <Command className="rounded-lg border shadow-md">
        <CommandInput disabled={disableForm} placeholder="Search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {[
            {
              group: 'Static',
              items: [
                {
                  icon: <User className="mr-2 h-4 w-4" />,
                  text: 'Portfolio'
                },
                {
                  icon: <CreditCard className="mr-2 h-4 w-4" />,
                  text: 'Landing Page'
                },
                {
                  icon: <Settings className="mr-2 h-4 w-4" />,
                  text: 'Brochure'
                },
                {
                  icon: <CreditCard className="mr-2 h-4 w-4" />,
                  text: 'Entertainment / Gaming'
                },
              ],
            },
            {
              group: 'Business',
              items: [
                {
                  icon: <User className="mr-2 h-4 w-4" />,
                  text: 'Ecommerce'
                },
                {
                  icon: <CreditCard className="mr-2 h-4 w-4" />,
                  text: 'Education'
                },
              ],
            },
            {
              group: 'Interactive / Social',
              items: [
                {
                  icon: <User className="mr-2 h-4 w-4" />,
                  text: 'Blog'
                },
                {
                  icon: <CreditCard className="mr-2 h-4 w-4" />,
                  text: 'Education'
                },
                {
                  icon: <User className="mr-2 h-4 w-4" />,
                  text: 'Social media'
                },
                {
                  icon: <CreditCard className="mr-2 h-4 w-4" />,
                  text: 'Events manager'
                },
                {
                  icon: <CreditCard className="mr-2 h-4 w-4" />,
                  text: 'Entertainment / Gaming'
                },
                {
                  icon: <CreditCard className="mr-2 h-4 w-4" />,
                  text: 'Streaming'
                },
              ],
            }
          ].map(({ group, items }) => <CommandGroup heading={group}>
            {items.map(({ icon, text }) => <CommandItem
              key={`${group}-${text}`}
              style={{ cursor: 'pointer' }}
              onSelect={disableForm ? () => {} : (val: string) => setQ2Answer(`${group}: ${text}`)}
            >
              {icon}
              <span>{text}</span>
            </CommandItem>)}
          </CommandGroup>)}
        </CommandList>
      </Command>
    </CardContent>,
    },
    {
      question: 'Do you have a company or idea in mind that is similar to what you are trying to do?',
      description: `My ${q1Answer || 'website'} idea is like…`,
      answerComponent: (disableForm: boolean) => <CardContent className="flex flex-1 flex-col px-[50px] pb-[40px]">
      <div className="mb-[15px] flex flex-row flex-wrap">
        <Badge variant="outline" style={{ borderRadius: 4, padding: '4px 8px' }}>{q3Answer || 'Nothing selected'}</Badge>
      </div>
      <Command className="rounded-lg border shadow-md">
        <CommandInput disabled={disableForm} placeholder="Search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {[
            {
              group: 'Business',
              items: [
                {
                  icon: null,
                  text: 'LinkedIn'
                },
                {
                  icon: null,
                  text: 'DuoLingo'
                },
              ],
            },
            {
              group: 'Interactive / Social',
              items: [
                {
                  icon: null,
                  text: 'Instagram'
                },
                {
                  icon: null,
                  text: 'Tiktok'
                },
                {
                  icon: null,
                  text: 'Spotify'
                },
              ],
            }
          ].map(({ group, items }) => <CommandGroup heading={group}>
            {items.map(({ icon, text }) => <CommandItem
              key={`${group}-${text}`}
              style={{ cursor: 'pointer' }}
              onSelect={disableForm ? () => {} : () => setQ3Answer(`${group}: ${text}`)}
            >
              {icon}
              <span>{text}</span>
            </CommandItem>)}
          </CommandGroup>)}
        </CommandList>
      </Command>
    </CardContent>,
    },
    {
      question: 'What AWS resources / services would you like to add to your API',
      description: 'We recommend to skip this if you are not a technical user / developer',
      answerComponent: (disableForm: boolean) => <CardContent className="pl-[50px]">
        <div className="mb-[10px] flex flex-row flex-wrap">
          {Object.keys(q4Answer).length > 0
            ? Object.keys(q4Answer).map((v) => <Badge variant="outline" style={{ borderRadius: 4, padding: '4px 8px', margin: '0px 5px 5px 0px' }}>{v}</Badge>)
            : <Badge variant="outline" style={{ borderRadius: 4, padding: '4px 8px', margin: '0px 5px 5px 0px' }}>{'Nothing selected'}</Badge>
          }
        </div>
        <Command className="rounded-lg border shadow-md">
          <CommandInput disabled={disableForm} placeholder="Search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            {[
              {
                group: 'Database',
                items: [
                  {
                    icon: <User className="mr-2 h-4 w-4" />,
                    text: 'DynamoDB'
                  },
                  {
                    icon: <CreditCard className="mr-2 h-4 w-4" />,
                    text: 'S3'
                  },
                ],
              },
              {
                group: 'Authentication',
                items: [
                  {
                    icon: <User className="mr-2 h-4 w-4" />,
                    text: 'Google OAuth'
                  },
                ],
              },
              {
                group: 'Payment',
                items: [
                  {
                    icon: <User className="mr-2 h-4 w-4" />,
                    text: 'Stripe'
                  },
                ],
              }
            ].map(({ group, items }) => <CommandGroup heading={group}>
              {items.map(({ icon, text }) => <CommandItem
                key={`${group}-${text}`}
                style={{ cursor: 'pointer' }}
                onSelect={disableForm ? () => {} : (val: string) => setQ4Answer((prevState) => ({ ...prevState, [`${group}: ${text}`]: text }))}
              >
                {icon}
                <span>{text}</span>
              </CommandItem>)}
            </CommandGroup>)}
          </CommandList>
        </Command>
      </CardContent>,
    },
    {
      question: `Why are you building this ${q1Answer || 'website'}?`,
      description: 'I am a...',
      answerComponent: (disableForm: boolean) => <CardContent className="pl-[50px]">
        <RadioGroup disabled={disableForm} value={q5Answer} onValueChange={(val: string) => setQ5Answer(val)}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Product Manager" id="survey-q5-1" />
              <Label htmlFor="survey-q5-1">Product Manager</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Developer" id="survey-q5-2" />
              <Label htmlFor="survey-q5-2">Developer</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Hobbiest" id="survey-q5-3" />
              <Label htmlFor="survey-q5-3">Hobbiest</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="curious person" id="survey-q5-4" />
              <Label htmlFor="survey-q5-4">curious person</Label>
            </div>
        </RadioGroup>
      </CardContent>,
    },
    {
      question: `How far are you into the design process?`,
      description: 'We’re trying to figure out where your heads at.',
      answerComponent: (disableForm: boolean) => <CardContent className="pl-[50px]">
        <RadioGroup disabled={disableForm} value={q6Answer} onValueChange={(val: string) => setQ6Answer(val)}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="I have an idea" id="survey-q6-1" />
              <Label htmlFor="survey-q6-1">I have an idea</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="I know what I want on a high level" id="survey-q6-2" />
              <Label htmlFor="survey-q6-2">I know what I want on a high level</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="I know the exact services / AWS resources I want" id="survey-q6-3" />
              <Label htmlFor="survey-q6-3">I know the exact services / AWS resources I want</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Just trying out this sandbox" id="survey-q6-4" />
              <Label htmlFor="survey-q6-4">Just trying out this sandbox</Label>
            </div>
        </RadioGroup>
      </CardContent>,
    },
    {
      question: `Write a quick description of your idea / project`,
      description: 'Tell us the high level idea for your project.',
      answerComponent: (disableForm: boolean) => <CardContent className="">
        <Textarea disabled={disableForm} placeholder="Type your message here." value={q7Answer} onChange={(ev) => setQ7Answer(ev.target.value)}/>
      </CardContent>,
    },
  ];

  const surveyCard = ({ id = '', selected = false, number = 0, question = '', description = '', answerComponent = (df: boolean) => null, disableForm = false }) => <div style={{ position: 'relative' }}>
    <Card id={id} className="w-[100%] p-[20px] shadow-none" style={{ position: 'relative' }}>
      <CardHeader>
        <CardTitle style={{ fontSize: 20, fontFamily: 'Arial', display: 'flex', flexDirection: 'row' }}>
          <div style={{ minWidth: 30, lineHeight: '28px' }}>{`${number}.`}</div>
          <div className="flex" style={{ lineHeight: '28px' }}>{question}</div></CardTitle>
        <CardDescription style={{ paddingLeft: 30, paddingTop: 10, fontFamily: 'Arial' }}>{description}</CardDescription>
      </CardHeader>
      <Separator className="mb-[35px] mt-[15px]" />
      {answerComponent(disableForm)}
    </Card>
    {!selected && <div className="bg-[#F6F8FABF] dark:bg-[#020202BF]" style={{ position: 'absolute', top: 0, width: '100%', height: '100%', borderRadius: 5 }} />}
  </div>

  const surveyButton = ({
    text = '',
    selected = false,
    submitBtn = false,
    disableSubmit = false,
    done = false,
    onClick = () => {}
  }) => <div style={{
    borderRadius: 19,
    border: `${(submitBtn || selected) ? 2 : 1}px solid ${selected && !(submitBtn && disableSubmit) ? '#407BFF' : '#DCDFE1'}`,
    background: submitBtn && !disableSubmit ? '#407BFFE5' : (selected && !(submitBtn && disableSubmit) ? '#407BFF1A' : 'transparent'),
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
  onClick={disableSubmit && submitBtn ? () => {} : onClick}
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
    disableSubmit = false,
  }) => <div key={key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    {!(state === 'none' && last) && <div style={{ transition, height: state === 'next' ? 25 : (state === 'prev' ? 100 : 20), opacity: state === 'prev' ? 0.3 : 1 }}>
      <Separator orientation="vertical" />
    </div>}
    <div style={{ transition, height: state === 'none' ? 0 : 38, opacity: state === 'none' ? 0 : 1 }}>
      {surveyButton({
        text: state === 'next' ? ((last || index === lastStage) ? submitText : 'Next Question') : 'Previous Question',
        selected: state === 'next',
        submitBtn: (last || index === lastStage),
        disableSubmit,
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
      stage: surveyStage,
      disableForm: surveyStageComplete,
      disableUnselectedStages: surveyStage !== null,
      setStage: setSurveyStage,
      submit: {
        text: 'Review',
        handle: () => {
          deployEmail()
          setSurveyStage(null)
          setSurveyStageComplete(true)
          setSelectedStep(1)
        }
      }
    },
    {
      id: 'container-review',
      name: 'Review',
      content: reviewContent,
      stage: reviewStage,
      disableForm: reviewStageComplete,
      disableUnselectedStages: reviewStage !== null,
      setStage: setReviewStage,
      submit: {
        disabled: reviewEmail.length === 0,
        text: 'Deploy my API',
        handle: () => {
          setReviewStage(null)
          setReviewStageComplete(true)
          setSelectedStep(2)
        }
      }
    },
    {
      id: 'container-deploy',
      name: 'Deploy',
      content: deployContent,
      stage: deployStage,
      lastStage: 0,
      disableForm: deployStageComplete,
      disableUnselectedStages: false,
      setStage: () => {},
      submit: {
        text: 'Build',
        handle: () => {
          setDeployStage(null)
          setDeployStageComplete(true)
          setSelectedStep(3)
        }
      }
    },
    
    {
      id: 'container-build',
      name: 'Build',
      content: buildContent,
      stage: buildStage,
      lastStage: 0,
      disableForm: deployStageComplete,
      disableUnselectedStages: false,
      setStage: () => {},
      submit: {
        text: 'Try out my API',
        handle: () => {
          setBuildStage(null)
          setBuildStageComplete(true)
        }
      }
    },
  ];

  const handleSubmit = async () => {
    setDeployStageProgress(10)
    const rid = RID()
    await fetch('/api', {
      method: 'POST',
      body: JSON.stringify({
        url: 'https://webhub.up.railway.app/api/deploy/coreAPI',
        method: 'POST',
        data: { name: rid, email: reviewEmail, rid },
      }),
    }).then(async (response) => {
        const body = await response.json();
        const { upRes: { data: { r_id, api_url } } } = body;
        console.log('api_url: ', api_url)
        setDeployStageProgress(100);
        setDeployStage(0);
      })
      .catch((err) => {
          console.log('err: ', err)
          setDeployStageProgress(0)
      });
  };

  const scrollOffset = 100

  useEffect(() => {
    if (deployStageProgress < 100 && deployStageProgress > 0) {
      const val = deployStageProgress + ((100 - deployStageProgress) / 2)
      setTimeout((newDeployStageProgress) => {
        setDeployStageProgress(newDeployStageProgress)
      }, 15000, val)
    }
  }, [deployStageProgress])

  useEffect(() => {
    const $container = $(`#${content[0].id}`);
    if (surveyStage !== undefined && surveyStage !== null) {
      console.log('surveyStage: ', surveyStage);

      let scrollTop = 0;
      if (surveyStage !== 0) {
        const $scrollTo = $(`#${content[0].id}-q-${surveyStage}`);
        // console.log('$scrollTo.offset().top: ', $scrollTo.offset().top)
        // console.log('$container.offset().top: ', $container.offset().top)
        // console.log('$container.scrollTop(): ', $container.scrollTop())
        // console.log('$scrollTo.position(): ', $scrollTo.position())
        scrollTop = ($scrollTo?.offset()?.top || 0) - ($container?.offset()?.top || 0) + ($container?.scrollTop() || 0) - scrollOffset;
      }
      
      $container.animate({
        scrollTop,
      });
    }
    
  }, [surveyStage])

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
        scrollTop = ($scrollTo?.offset()?.top || 0) - ($container?.offset()?.top || 0) + ($container?.scrollTop() || 0) - scrollOffset;
      }
      
      $container.animate({
        scrollTop,
      });
    }
    
  }, [reviewStage])

  useEffect(() => {
    console.log([
      q1Answer,
      q2Answer,
      q3Answer,
      q4Answer,
      q5Answer,
      q6Answer,
      q7Answer,
    ]);
    // we have to convert these answer into services / AWS resources

    // reviewResourcesAndServices
    const opts = {
      dynamodb: {
        reasons: {
          business: false,
          users: false
        }
      },
      s3: {
        name: 'AWS S3 Bucket',
        reasons: {
          business: false
        }
      },
      lambda: {
        name: 'AWS Lambda API',
        reasons: {
          business: false,
        }
      },
      googleOAuth: {
        name: 'Google OAuth',
        reasons: {
          users: false,
        }
      },
      stripe: {
        name: 'Google OAuth',
        reasons: {
          business: false,
        }
      }
    };
    

    if (q1Answer?.toLowerCase().includes('microservice')) {
      opts.lambda.reasons.business = true;
    }

    if (q2Answer?.toLowerCase().includes('business')) {
      opts.stripe.reasons.business = true;
      opts.dynamodb.reasons.business = true;
      opts.googleOAuth.reasons.users = true;
    } else if (q2Answer?.toLowerCase().includes('social')) {
      opts.dynamodb.reasons.users = true;
      opts.googleOAuth.reasons.users = true;
    }

    if (q3Answer?.toLowerCase().includes('business')) {
      opts.stripe.reasons.business = true;
      opts.dynamodb.reasons.business = true;
      opts.googleOAuth.reasons.users = true;
    } else if (q3Answer?.toLowerCase().includes('social')) {
      opts.dynamodb.reasons.users = true;
      opts.googleOAuth.reasons.users = true;
    }

    Object.keys(q4Answer).map((ans) => {
      if (ans.toLowerCase().includes('dynamodb')) {
        opts.dynamodb.reasons.business = true;
      } else if (ans.toLowerCase().includes('s3')) {
        opts.s3.reasons.business = true;
      } else if (ans.toLowerCase().includes('lambda')) {
        opts.lambda.reasons.business = true;
      }  else if (ans.toLowerCase().includes('google oauth')) {
        opts.googleOAuth.reasons.users = true;
      } else if (ans.toLowerCase().includes('stripe')) {
        opts.stripe.reasons.business = true;
      }
    });

    const arr = [];

    for (const k of reviewOptsList) {
      // @ts-ignore
      for (const [key, selected] of Object.entries(opts[k].reasons)) {

        if (selected) {
          arr.push({
            // @ts-ignore
            name: reviewResourcesAndServices[k].name,
            // @ts-ignore
            endpoint: reviewResourcesAndServices[k].endpoint,
            // @ts-ignore
            ...reviewResourcesAndServices[k].reasons[key],
            selected: true,
          })
        }
      }
    }

    console.log('arr: ', arr);

    setReviewOpts(arr);

  }, [surveyStageComplete])

  useEffect(() => {
    if (reviewStageComplete) {
      console.log('reviewStageComplete: ', reviewStageComplete)
      handleSubmit()
    }
  }, [reviewStageComplete])

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

            <div style={{ flex: 1 }} />

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
            style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: 60 }}
        >
          {[
            step({
              text: '1. Survey',
              selected: selectedStep === 0,
              done: surveyStageComplete,
              onClick: () => setSelectedStep(0)
            }),
            chevron,
            step({
              text: '2. Review',
              selected: selectedStep === 1,
              done: reviewStageComplete,
              onClick: surveyStageComplete ? () => setSelectedStep(1) : () => {}
            }),
            chevron,
            step({
              text: '3. Deploy',
              selected: selectedStep === 2,
              done: deployStageComplete,
              onClick: surveyStageComplete && reviewStageComplete ? () => setSelectedStep(2) : () => {}
            }),
            chevron,
            step({
              text: '4. Build',
              selected: selectedStep === 3,
              done: buildStageComplelte,
              onClick: surveyStageComplete && reviewStageComplete && deployStageComplete ? () => setSelectedStep(3) : () => {}
            })
          ]}
        </div>
        <Separator style={{ opacity: 0.4 }} />
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
          {content.map(({
            id,
            name,
            content,
            stage,
            lastStage,
            disableForm,
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
              <div className="text-black dark:text-white" style={{ fontWeight: 'bold', fontSize: 24, margin: '52px 0px 25px 0px' }}>{name}</div>
              {content.map(({ question, description, answerComponent }, i, arr) => <>
                {surveyCard({
                  id: `${id}-q-${i}`,
                  selected: stage === i || !disableUnselectedStages,
                  disableForm,
                  number: i + 1,
                  question,
                  description,
                  // @ts-ignore
                  answerComponent,
                })}
                {surveyButtonSpacer({
                  key: `${name}-${i}`,
                  // @ts-ignore
                  index: i,
                  last: arr.length - 1 === i,
                  // @ts-ignore
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
                  disableSubmit: submit.disabled,
                })}
              </>)}
              <div style={{ paddingBottom: 100 }} />
            </div>
          </div>)}
        </div>
    </div>
  )
}
