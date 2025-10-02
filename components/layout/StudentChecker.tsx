"use client"
import React, { useTransition } from 'react'
import { cn } from '@/lib/utils'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useId } from "react"
import Image from 'next/image'
import { MailIcon, SearchCheck } from 'lucide-react'

interface StudentCheckerProps {
  title: string;
  description: string;
  triggerText: string;
  className?: string;
}

const StudentChecker = ({ title, description, triggerText, className }: StudentCheckerProps) => {
  const id = useId();
  const [isPending, startTransition] = useTransition();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className='text-sm font-medium text-muted-foreground hover:text-primary transition-colors hidden sm:inline-block'>
          {triggerText}
        </Button>
      </DialogTrigger>
      <DialogContent className={cn(className, "sm:max-w-[425px]")}>
        <div className="flex flex-col items-center gap-2">
          <div
            className="flex size-11 shrink-0 items-center justify-center rounded-full border my-6"
            aria-hidden="true"
          >
            <Image
              src="/logo.svg"
              alt="Logo"
              width={44}
              height={44}
              className="h-11 w-11 text-primary"
            />
          </div>
          <DialogHeader>
            <DialogTitle className="sm:text-center">
              {title}
            </DialogTitle>
            <DialogDescription className="sm:text-center">
              {description}
            </DialogDescription>
          </DialogHeader>
        </div>

        <form className="space-y-5 mt-4">
          <div className="space-y-4">
            <div className="group relative">
              <Label
                htmlFor={id}
                className="origin-start text-muted-foreground/70 group-focus-within:text-foreground has-[+input:not(:placeholder-shown)]:text-foreground absolute top-1/2 block -translate-y-1/2 cursor-text px-1 text-sm transition-all group-focus-within:pointer-events-none group-focus-within:top-0 group-focus-within:cursor-default group-focus-within:text-xs group-focus-within:font-medium has-[+input:not(:placeholder-shown)]:pointer-events-none has-[+input:not(:placeholder-shown)]:top-0 has-[+input:not(:placeholder-shown)]:cursor-default has-[+input:not(:placeholder-shown)]:text-xs has-[+input:not(:placeholder-shown)]:font-medium"
              >
                <span className="inline-flex px-2">
                  Email Address
                </span>
              </Label>
              <MailIcon className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-50" />
              <Input id={id} type="email" placeholder=" " />
            </div>
          </div>
          <Button type="submit" className="w-full flex items-center justify-center gap-1.5" disabled={isPending}>
            {isPending ? (
                <Image
                  src="/loading.svg"
                  alt="Loading"
                  width={16}
                  height={16}
                  className="h-4 w-4 animate-spin"
                />
              ) : <SearchCheck className="h-4 w-4" />
            }
            <span>
              {isPending ? 'Checking...' : 'Check Status'}
            </span>
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default StudentChecker