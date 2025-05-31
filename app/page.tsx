import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-8 bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30 text-black dark:text-white">
          Welcome to MilloColor
        </p>
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
          <a
            className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
            href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Deployed on{' '}
            <Image
              src="/vercel.svg"
              alt="Vercel Logo"
              className="dark:invert"
              width={100}
              height={24}
              priority
            />
          </a>
        </div>
      </div>

      <div className="relative flex flex-col items-center justify-center gap-8 py-20">
        <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
          MilloColor
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl text-center">
          A modern color palette and design portfolio project built with Next.js, TypeScript, and Tailwind CSS.
        </p>
      </div>

      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-3 lg:text-left gap-4">
        <a
          className="group rounded-lg border border-gray-700 px-5 py-4 transition-colors hover:border-purple-400 hover:bg-gray-800"
          href="#features"
        >
          <h2 className="mb-3 text-2xl font-semibold text-gray-100">
            Features{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-sm text-gray-400">
            Explore the powerful features that MilloColor offers for designers.
          </p>
        </a>

        <a
          className="group rounded-lg border border-gray-700 px-5 py-4 transition-colors hover:border-pink-400 hover:bg-gray-800"
          href="#palettes"
        >
          <h2 className="mb-3 text-2xl font-semibold text-gray-100">
            Palettes{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-sm text-gray-400">
            Browse our handcrafted color palettes for your next project.
          </p>
        </a>

        <a
          className="group rounded-lg border border-gray-700 px-5 py-4 transition-colors hover:border-red-400 hover:bg-gray-800"
          href="#contact"
        >
          <h2 className="mb-3 text-2xl font-semibold text-gray-100">
            Contact{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-sm text-gray-400">
            Get in touch with us for custom design solutions.
          </p>
        </a>
      </div>
    </main>
  );
}
