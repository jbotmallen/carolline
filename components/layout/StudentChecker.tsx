"use client"
import React, { useState, useTransition } from 'react'
import { cn } from '@/lib/utils'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import Image from 'next/image'
import { Loader, MailIcon, SearchCheck } from 'lucide-react'
import { checkStudentStatus } from '@/server/checker.action'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { EmailInput, emailSchema } from '@/lib/validation'
import useSWR from "swr"
interface StudentCheckerProps {
  title: string;
  description: string;
  triggerText: string;
  className?: string;
  triggerClassName?: string;
}

const fetcher = (url: string) => fetch(url).then(res => res.json())

const StudentChecker = ({ title, description, triggerText, className, triggerClassName }: StudentCheckerProps) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const form = useForm<EmailInput>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: '',
    },
  });
  const { data, isLoading } = useSWR("/api/status", fetcher);

  const handleOpen = () => {
    if (data && data.status === "authenticated") {
      toast.success("You are already verified as a student. Redirecting to chat...");
      router.push('/chat');
      setOpen(false);
    } else {
      console.log("User not authenticated, opening dialog.", data.status);
      setOpen(true);
    }
  }

  if (isLoading) {
    return (
      <Button variant="outline" disabled>
        <Loader className="h-4 w-4 animate-spin text-secondary-foreground" />
      </Button>
    )
  }

  const handleSubmit = async (values: EmailInput) => {
    startTransition(async () => {
      const response = await checkStudentStatus(values.email);
      if (response.status === 200) {
        toast.success(response.message);
        setOpen(false);
        router.push('/chat');
      } else {
        toast.error(response.message);
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button onClick={handleOpen} variant="outline" className={cn("text-sm font-medium text-muted-foreground hover:text-primary-foreground transition-colors hidden sm:inline-block", triggerClassName)}>
        {triggerText}
      </Button>
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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5 mt-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type="email"
                        placeholder=" " // important! keeps placeholder-shown working
                        {...field}
                        className="peer pr-10"
                      />
                      <MailIcon className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-50" />

                      <FormLabel
                        className="
                          absolute left-2.5 text-muted-foreground/70 transition-all
                          top-1/2 -translate-y-1/2 text-sm
                          peer-focus:top-0 peer-focus:text-xs peer-focus:font-medium peer-focus:text-foreground
                          peer-[&:not(:placeholder-shown)]:top-0 peer-[&:not(:placeholder-shown)]:text-xs peer-[&:not(:placeholder-shown)]:font-medium peer-[&:not(:placeholder-shown)]:text-foreground
                        "
                      >
                        Email Address
                      </FormLabel>
                    </div>
                  </FormControl>
                  <FormDescription className='italic text-primary-foreground/40 mx-3'>
                    Don&apos;t worry, we won&apos;t share your email.
                  </FormDescription>
                  <FormMessage className='text-sm text-destructive p-2 text-center rounded-md' />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full flex items-center justify-center gap-1.5 rounded-2xl" disabled={isPending}>
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
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default StudentChecker