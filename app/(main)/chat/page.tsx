import { ChatInterface } from "@/components/chat/ChatInterface";
import StudentChecker from "@/components/layout/StudentChecker";
import { cookies } from "next/headers";

export default async function ChatPage() {
  const sessionCookie = await cookies();

  if (!sessionCookie.get("session")) {
    // Redirect to home page if no session cookie is found
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4 gap-5">
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p className="text-center mb-6 max-w-xl text-wrap">
          You must be a verified student to access the chat feature. Please go back to the home page and verify your student status.
        </p>
        <StudentChecker
          title="Let's See if You are a Student"
          description="Please enter your email to check your student status."
          triggerText="Check Student Status"
          className="py-10"
        />
      </div>
    );
  }

  return <ChatInterface />;
}
