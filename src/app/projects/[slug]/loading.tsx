import { Loading as LoadingIcon } from '@/components/icons';

export default function Loading() {
  return (
    <div className="grid h-[calc(100%-35px)] place-items-center lg:h-[calc(100%-28px)]">
      <LoadingIcon className="size-5 animate-spin" />
    </div>
  );
}
