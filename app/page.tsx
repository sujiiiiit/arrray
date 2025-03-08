// "use client";
// import DrawerDialogDemo from "@/components/chat/findFiles";
// import Loading from "@/components/ui/loading";

// import MessageContainer from "@/components/chat/messageContainer";
// import Imports from "@/components/chat/imports";
// import FileUpload from "@/components/chat/file-upload";
// import Header from "@/components/header/header";
// const App = () => {
//   return (
//     <>
//       <div className="h-dvh w-dvw overflow-hidden max-w-screen-2xl m-auto">
//         <Header />
//         <div className=" relative flex justify-center items-center h-dvh w-full">
//           <div className="flex flex-col gap-3 w-full">
//             <MessageContainer />
//             <Imports />
//           </div>
//         </div>
//       </div>
//       <DrawerDialogDemo />
//       <FileUpload
//         maxFiles={5}
//         maxSizeMB={10}
//         acceptedFileTypes={["image/*", "application/pdf", "text/plain"]}
//         onFilesDrop={(files) => {
//           console.log("Files dropped:", files);
//         }}
        
//       />
//     </>
//   );
// };

// export default App;





import LoginButton from "@/components/LoginLogoutButton";
import UserGreetText from "@/components/UserGreetText";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <LoginButton />
    </main>
  );
}
