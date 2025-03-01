
import * as React from "react"
import { cn } from "@/lib/utils"
import { Button, type ButtonProps } from "./button"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"

const Pagination = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center justify-center gap-1 sm:gap-2", className)}
    {...props}
  />
))
Pagination.displayName = "Pagination"

const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.HTMLAttributes<HTMLUListElement>
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn("flex flex-row items-center gap-1", className)}
    {...props}
  />
))
PaginationContent.displayName = "PaginationContent"

const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.LiHTMLAttributes<HTMLLIElement>
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("", className)} {...props} />
))
PaginationItem.displayName = "PaginationItem"

type PaginationLinkProps = {
  isActive?: boolean;
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  children?: React.ReactNode;
  className?: string;
}

const PaginationLink = ({
  className,
  isActive,
  disabled,
  children,
  onClick,
  ...props
}: PaginationLinkProps) => (
  <Button
    aria-current={isActive ? "page" : undefined}
    variant={isActive ? "default" : "outline"}
    size="icon"
    disabled={disabled || isActive}
    onClick={onClick}
    className={cn(
      "h-8 w-8 p-0 text-foreground",
      className
    )}
    {...props}
  >
    {children}
  </Button>
)
PaginationLink.displayName = "PaginationLink"

const PaginationPrevious = ({
  className,
  ...props
}: ButtonProps) => (
  <Button
    aria-label="Go to previous page"
    size="icon"
    variant="outline"
    className={cn("h-8 w-8 p-0 text-foreground", className)}
    {...props}
  >
    <ChevronLeft className="h-4 w-4" />
  </Button>
)
PaginationPrevious.displayName = "PaginationPrevious"

const PaginationNext = ({
  className,
  ...props
}: ButtonProps) => (
  <Button
    aria-label="Go to next page"
    size="icon"
    variant="outline"
    className={cn("h-8 w-8 p-0 text-foreground", className)}
    {...props}
  >
    <ChevronRight className="h-4 w-4" />
  </Button>
)
PaginationNext.displayName = "PaginationNext"

const PaginationEllipsis = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => (
  <span
    aria-hidden
    className={cn("flex h-8 w-8 items-center justify-center", className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
)
PaginationEllipsis.displayName = "PaginationEllipsis"

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
}
