export default function Home() {
  return (
    <pre className="flex h-full flex-col items-center justify-center space-y-2.5 whitespace-pre-wrap md:space-y-5">
      <code className="select-none text-[2dvw] leading-[0.9] tracking-[-0.1em] lg:text-[1.4dvh]">
        {ascii}
      </code>
      <code className="text-center text-sm md:text-base">
        <p>Self taught software engineer</p>
        <p>
          love to learn new things and I&apos;m always looking for new
          challenges to solve :)
        </p>
      </code>
    </pre>
  );
}

const ascii = `
 ______   ________  ____  _____  ____  ____
|_   _ \ |_   __  ||_   \|_   _||_  _||_  _|
  | |_) |  | |_ \_|  |   \ | |    \ \  / /
  |  __'.  |  _| _   | |\ \| |     \ \/ /
 _| |__) |_| |__/ | _| |_\   |_    _|  |_
|_______/|________||_____|\____|  |______|
                                             
`;
