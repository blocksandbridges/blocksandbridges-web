import { logoTypes } from "@/app/lib/constants";
import Image from 'next/image';

export default function Home() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full items-center">
      <div className="flex items-center w-full pl-4 md:pl-12">
        <Image
          src={logoTypes.colorComboMark}
          alt="Blocks and Bridges logo"
          className="w-full max-w-md mt-[100px]"
          width={400}
          height={400}
        />
      </div>
      <div className="flex justify-end items-center 
            font-merriweather text-[40px] leading-none mt-[100px]">
        <p>
          Welcome to Blocks and Bridges!
          <br /><br />
          A Fetal Alcohol Spectrum Disorder (FASD) Support and Awareness Organization.
        </p>
      </div>
    </div>
  );
}
