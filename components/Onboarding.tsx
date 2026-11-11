"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
export default function Onboarding() {
  const router = useRouter();
  return (
    <section className="absolute inset-0 flex flex-col">
      <div className="relative flex-1 overflow-hidden bg-[#4566EC]">
        <Image src="/icons/semi.png" alt="" width={90} height={90} className="absolute -right-2 -top-5 size-20 object-contain" />
        <Image src="/icons/Union.png" alt="" width={134} height={124} className="absolute left-0 top-20 w-29.25 size-21 object-contain" />
        <Image src="/icons/Union.png" alt="" width={84} height={84} className="absolute bottom-7.5 right-0 w-29.25 size-21 rotate-180 object-contain" />
      </div>

      <div className="h-70.5 w-full px-5 pt-5">
        <h1 className="mb-2.5 text-[24px] font-semibold leading-relaxed">
          Manage What To Do
        </h1>

        <p className="mb-22 max-w-72.5 text-[14px] leading-relaxed text-mute">
          The best way to manage what you have to do, don’t forget your plans
        </p>

        <button type="button" onClick={() => router.push("/home")} className="btn-primary h-12 w-full p-2 text-[16.5px] font-semibold">
          Get Started
        </button>
      </div>
    </section>
  );
}
