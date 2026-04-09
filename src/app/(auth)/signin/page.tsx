// app/login/page.tsx

import SignInPage from "@/src/components/auth/Signin";

export const dynamic = "force-dynamic";


export default function Page() {
  return <SignInPage/>;
}