// get current user

import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions"; // return session

export const currentUser = async () => {

   const session = await getServerSession(authOptions);
   return session?.user;
}