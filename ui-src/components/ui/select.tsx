import { cn } from "@/lib/utils";
import { Select as BaseSelect } from "@base-ui-components/react";
import { CheckIcon, ChevronDown, ChevronUp } from "lucide-react";
import * as React from "react";

function Select({ ...props }: React.ComponentProps<typeof BaseSelect.Root>) {
  return <BaseSelect.Root {...props} />;
}

function SelectTrigger({
  className,
  children,
  iconLead,
  ...props
}: React.ComponentProps<typeof BaseSelect.Trigger> & {
  iconLead?: React.ReactNode;
}) {
  return (
    <BaseSelect.Trigger
      className={cn(
        "group border-grey-300 flex cursor-default items-center justify-between rounded-md border outline-none focus-visible:border-blue-500",
        "dark:border-grey-700 pl-2 dark:focus-visible:border-blue-500",
        "has-data-[figui=select-icon-lead]:pl-0",
        className
      )}
      {...props}
    >
      {iconLead && (
        <span
          className="[&_svg]:text-black-500 dark:[&_svg]:text-white-500 flex aspect-square h-full items-center justify-center [&_svg]:size-3 [&_svg]:shrink-0"
          data-figui="select-icon-lead"
        >
          {typeof iconLead === "string" ? (
            <span className="text-black-500 dark:text-white-500 typography-body-medium">
              {iconLead}
            </span>
          ) : (
            iconLead
          )}
        </span>
      )}
      {children}
      <BaseSelect.Icon className="[&_svg]:text-black-800 dark:[&_svg]:text-white-800 group-data-disabled:[&_svg]:text-black-400 dark:group-data-disabled:[&_svg]:text-white-400 flex size-6 items-center justify-center [&_svg]:size-3 [&_svg]:shrink-0">
        <ChevronDown />
      </BaseSelect.Icon>
    </BaseSelect.Trigger>
  );
}

function SelectContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof BaseSelect.Positioner>) {
  return (
    <BaseSelect.Portal>
      <BaseSelect.Positioner
        className={cn(
          "bg-grey-900 shadow-400 dark:inset-shadow-white-100 overflow-hidden rounded-lg dark:inset-shadow-2xs",
          className
        )}
        sideOffset={4}
        {...props}
      >
        <SelectScrollUpArrow />
        <BaseSelect.Popup className={"group max-h-(--available-height)] p-2"}>
          {children}
        </BaseSelect.Popup>
        <SelectScrollDownArrow />
      </BaseSelect.Positioner>
    </BaseSelect.Portal>
  );
}

function SelectValue({
  className,
  ...props
}: React.ComponentProps<typeof BaseSelect.Value>) {
  return (
    <BaseSelect.Value
      className={cn(
        "typography-body-medium text-black-1000 dark:text-white-1000 flex-1 truncate",
        "group-data-disabled:text-black-400 dark:group-data-disabled:text-white-400",
        className
      )}
      {...props}
    />
  );
}

function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof BaseSelect.Item>) {
  return (
    <BaseSelect.Item
      className={cn(
        "typography-body-medium text-white-1000 grid min-w-(--anchor-width) cursor-default grid-cols-[0.75rem_1fr] gap-2 rounded-md px-2 py-1 data-highlighted:bg-blue-500",
        className
      )}
      {...props}
    >
      <BaseSelect.ItemIndicator className="col-start-1 flex items-center justify-center">
        <CheckIcon className="size-3" />
      </BaseSelect.ItemIndicator>
      <BaseSelect.ItemText className="col-start-2">
        {children}
      </BaseSelect.ItemText>
    </BaseSelect.Item>
  );
}

function SelectItemText({
  ...props
}: React.ComponentProps<typeof BaseSelect.ItemText>) {
  return <BaseSelect.ItemText {...props} />;
}

function SelectItemIndicator({
  ...props
}: React.ComponentProps<typeof BaseSelect.ItemIndicator>) {
  return <BaseSelect.ItemIndicator {...props} />;
}

function SelectSeparator({
  ...props
}: React.ComponentProps<typeof BaseSelect.Separator>) {
  return <BaseSelect.Separator {...props} />;
}

function SelectGroup({
  ...props
}: React.ComponentProps<typeof BaseSelect.Group>) {
  return <BaseSelect.Group {...props} />;
}

function SelectGroupLabel({
  ...props
}: React.ComponentProps<typeof BaseSelect.GroupLabel>) {
  return <BaseSelect.GroupLabel {...props} />;
}

function SelectScrollUpArrow({
  className,
  ...props
}: React.ComponentProps<typeof BaseSelect.ScrollUpArrow>) {
  return (
    <BaseSelect.ScrollUpArrow
      {...props}
      className={cn(
        "bg-grey-900 z-10 flex h-4 w-full cursor-default items-center justify-center rounded-lg py-1",
        className
      )}
    >
      <ChevronUp className="text-black-1000 dark:text-white-1000 size-3" />
    </BaseSelect.ScrollUpArrow>
  );
}

function SelectScrollDownArrow({
  className,
  ...props
}: React.ComponentProps<typeof BaseSelect.ScrollDownArrow>) {
  return (
    <BaseSelect.ScrollDownArrow
      {...props}
      className={cn(
        "bg-grey-900 z-10 flex h-4 w-full cursor-default items-center justify-center rounded-lg py-1",
        className
      )}
    >
      <ChevronDown className="text-black-1000 dark:text-white-1000 size-3" />
    </BaseSelect.ScrollDownArrow>
  );
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectGroupLabel,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectScrollDownArrow,
  SelectScrollUpArrow,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};
