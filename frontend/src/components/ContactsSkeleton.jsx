import {Skeleton} from "@nextui-org/react";

export default function ContactsSkeleton() {
  return (
    <>
    <div className="max-w-[300px] w-full flex items-center gap-3 pb-4 mt-4">
      <div>
        <Skeleton className="flex rounded-full w-16 h-16"/>
      </div>  
      <div className="w-full flex flex-col gap-2 ">
        <Skeleton className="h-3 w-3/5 rounded-lg"/>
        <Skeleton className="h-3 w-4/4 rounded-lg"/>
      </div>
    </div>
    <div className="max-w-[300px] w-full flex items-center gap-3 pb-4">
      <div>
        <Skeleton className="flex rounded-full w-16 h-16"/>
      </div>  
      <div className="w-full flex flex-col gap-2 ">
        <Skeleton className="h-3 w-3/5 rounded-lg"/>
        <Skeleton className="h-3 w-4/4 rounded-lg"/>
      </div>
    </div>

    <div className="max-w-[300px] w-full flex items-center gap-3 pb-4">
      <div>
        <Skeleton className="flex rounded-full w-16 h-16"/>
      </div>  
      <div className="w-full flex flex-col gap-2 ">
        <Skeleton className="h-3 w-3/5 rounded-lg"/>
        <Skeleton className="h-3 w-4/4 rounded-lg"/>
      </div>
    </div>


    <div className="max-w-[300px] w-full flex items-center gap-3 pb-4">
      <div>
        <Skeleton className="flex rounded-full w-16 h-16"/>
      </div>  
      <div className="w-full flex flex-col gap-2 ">
        <Skeleton className="h-3 w-3/5 rounded-lg"/>
        <Skeleton className="h-3 w-4/4 rounded-lg"/>
      </div>
    </div>

    <div className="max-w-[300px] w-full flex items-center gap-3 pb-4">
      <div>
        <Skeleton className="flex rounded-full w-16 h-16"/>
      </div>  
      <div className="w-full flex flex-col gap-2 ">
        <Skeleton className="h-3 w-3/5 rounded-lg"/>
        <Skeleton className="h-3 w-4/4 rounded-lg"/>
      </div>
    </div>

    <div className="max-w-[300px] w-full flex items-center gap-3 pb-4">
      <div>
        <Skeleton className="flex rounded-full w-16 h-16"/>
      </div>  
      <div className="w-full flex flex-col gap-2 ">
        <Skeleton className="h-3 w-3/5 rounded-lg"/>
        <Skeleton className="h-3 w-4/4 rounded-lg"/>
      </div>
    </div>
    </>
  );
}