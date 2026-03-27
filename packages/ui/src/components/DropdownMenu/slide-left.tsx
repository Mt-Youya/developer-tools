import { Button } from "../Button"
import { Switch } from "../Switch"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu"

export function DropdownSlideLeftAnimation() {
  "use memo"
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="outline">Slide Left Animation</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="data-[state=closed]:slide-out-to-left-20 data-[state=open]:slide-in-from-left-20 data-[state=closed]:zoom-out-100 data-[state=open]:zoom-in-100 w-56 duration-400"
      >
        <DropdownMenuLabel>Settings</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem>My Profile</DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuItem>Billing</DropdownMenuItem>
          <DropdownMenuItem>FAQs</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Contact</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem>Call Support</DropdownMenuItem>
          <DropdownMenuItem>Chat with us</DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function DropdownMenuSlideUpAnimation() {
  "use memo"
  const [googleSwitch, setGoogleSwitch] = useState(false)
  const [twitterSwitch, setTwitterSwitch] = useState(false)
  const [linkedinSwitch, setLinkedinSwitch] = useState(false)
  const [dribbbleSwitch, setDribbbleSwitch] = useState(false)
  const [behanceSwitch, setBehanceSwitch] = useState(false)
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="outline">Slide Up Animation</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="data-[state=closed]:slide-out-to-left-0 data-[state=open]:slide-in-from-left-0 data-[state=closed]:slide-out-to-bottom-20 data-[state=open]:slide-in-from-bottom-20 data-[state=closed]:zoom-out-100 w-56 duration-400">
        <DropdownMenuLabel>Apps notification</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem className="justify-between" onSelect={(event) => event.preventDefault()}>
            <img
              src="https://cdn.shadcnstudio.com/ss-assets/components/dropdown/google.png"
              alt="google"
              className="size-4"
            ></img>
            <span className="flex-1">Google</span>
            <Switch id="airplane-mode" checked={googleSwitch} onCheckedChange={setGoogleSwitch} />
          </DropdownMenuItem>
          <DropdownMenuItem className="justify-between" onSelect={(event) => event.preventDefault()}>
            <img
              src="https://cdn.shadcnstudio.com/ss-assets/components/dropdown/twitter.png"
              alt="twitter"
              className="size-4"
            ></img>
            <span className="flex-1">Twitter</span>
            <Switch id="airplane-mode" checked={twitterSwitch} onCheckedChange={setTwitterSwitch} />
          </DropdownMenuItem>
          <DropdownMenuItem className="justify-between" onSelect={(event) => event.preventDefault()}>
            <img
              src="https://cdn.shadcnstudio.com/ss-assets/components/dropdown/linkedin.png"
              alt="linkedin"
              className="size-4"
            ></img>
            <span className="flex-1">Linkedin</span>
            <Switch id="airplane-mode" checked={linkedinSwitch} onCheckedChange={setLinkedinSwitch} />
          </DropdownMenuItem>
          <DropdownMenuItem className="justify-between" onSelect={(event) => event.preventDefault()}>
            <img
              src="https://cdn.shadcnstudio.com/ss-assets/components/dropdown/dribbble.png"
              alt="dribbble"
              className="size-4"
            ></img>
            <span className="flex-1">Dribbble</span>
            <Switch id="airplane-mode" checked={dribbbleSwitch} onCheckedChange={setDribbbleSwitch} />
          </DropdownMenuItem>
          <DropdownMenuItem className="justify-between" onSelect={(event) => event.preventDefault()}>
            <img
              src="https://cdn.shadcnstudio.com/ss-assets/components/dropdown/behance.png"
              alt="behance"
              className="size-4"
            ></img>
            <span className="flex-1">Behance</span>
            <Switch id="airplane-mode" checked={behanceSwitch} onCheckedChange={setBehanceSwitch} />
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
