import { Spinner } from "./ui/spinner";

const Loading = () => {
  return (
    <div className="grid place-items-center min-h-svh w-full">
      <Spinner className="size-8" />
    </div>
  );
};

export default Loading;
