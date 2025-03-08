// "use server"

// import { signIn , signOut} from "@/auth";

// export const login = async () => {
//       await signIn("github",{redirectTo : "/"});
// };

// export const logout = async () => {
//     await signOut({redirectTo : "/"})
// };


"use server"; 
import { signIn, signOut } from "@/auth"; // ✅ Import from server-side module

export const login = async () => {
  await signIn("github", { redirectTo: "/" }); // ✅ Change redirectTo to redirect
};

export const logout = async () => {
  await signOut({ redirectTo: "/" }); // ✅ Change redirectTo to redirect
};
