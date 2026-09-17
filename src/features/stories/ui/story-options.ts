import type { VariantProps } from "class-variance-authority"
import type { LucideIcon } from "lucide-react"
import {
  Activity,
  ArrowDownIcon,
  ArrowUpIcon,
  CheckCircle2Icon,
  CircleDashedIcon,
  Clock3Icon,
  Cpu,
  FileTextIcon,
  Flag,
  Layers,
  ListTodoIcon,
  Server,
  Sliders,
  SparklesIcon,
  UserRound,
} from "lucide-react"
import { badgeVariants } from "@/components/ui/badge"
import type { StoryStatus, TaskStatus } from "../types/story-types"

type BadgeVariant = NonNullable<VariantProps<typeof badgeVariants>["variant"]>

export type SelectOption<TValue extends string> = {
  value: TValue
  label: string
  icon: LucideIcon
  color: string
  variant: BadgeVariant
}

export const STORY_PRIORITY_OPTIONS: SelectOption<"low" | "medium" | "high">[] =
  [
    {
      value: "low",
      label: "Baja",
      icon: ArrowDownIcon,
      color: "text-blue-500",
      variant: "info",
    },
    {
      value: "medium",
      label: "Media",
      icon: ArrowUpIcon,
      color: "text-amber-500",
      variant: "warning",
    },
    {
      value: "high",
      label: "Alta",
      icon: SparklesIcon,
      color: "text-rose-500",
      variant: "destructive",
    },
  ]

export const STORY_STATUS_OPTIONS: SelectOption<StoryStatus>[] = [
  {
    value: "draft",
    label: "Borrador",
    icon: FileTextIcon,
    color: "text-muted-foreground",
    variant: "muted",
  },
  {
    value: "ready",
    label: "Lista",
    icon: CircleDashedIcon,
    color: "text-sky-500",
    variant: "info",
  },
  {
    value: "in-progress",
    label: "En progreso",
    icon: Clock3Icon,
    color: "text-amber-500",
    variant: "warning",
  },
  {
    value: "done",
    label: "Completada",
    icon: CheckCircle2Icon,
    color: "text-emerald-500",
    variant: "success",
  },
]

export const TASK_STATUS_OPTIONS: SelectOption<TaskStatus>[] = [
  {
    value: "todo",
    label: "Pendiente",
    icon: ListTodoIcon,
    color: "text-muted-foreground",
    variant: "muted",
  },
  {
    value: "in-progress",
    label: "En progreso",
    icon: Clock3Icon,
    color: "text-amber-500",
    variant: "warning",
  },
  {
    value: "done",
    label: "Completada",
    icon: CheckCircle2Icon,
    color: "text-emerald-500",
    variant: "success",
  },
]

export const PROFILE_OPTIONS: SelectOption<string>[] = [
  {
    value: "Frontend",
    label: "Frontend",
    icon: Cpu,
    color: "text-blue-500",
    variant: "info",
  },
  {
    value: "Backend",
    label: "Backend",
    icon: Server,
    color: "text-emerald-500",
    variant: "success",
  },
  {
    value: "Fullstack",
    label: "Fullstack",
    icon: Layers,
    color: "text-cyan-500",
    variant: "info",
  },
  {
    value: "QA",
    label: "QA / Testing",
    icon: CheckCircle2Icon,
    color: "text-amber-500",
    variant: "warning",
  },
  {
    value: "DevOps",
    label: "DevOps / Infraestructura",
    icon: Activity,
    color: "text-purple-500",
    variant: "secondary",
  },
  {
    value: "UI/UX Designer",
    label: "Diseñador UI/UX",
    icon: SparklesIcon,
    color: "text-rose-500",
    variant: "destructive",
  },
  {
    value: "Product Manager",
    label: "Product Manager",
    icon: UserRound,
    color: "text-blue-500",
    variant: "info",
  },
  {
    value: "Tech Lead",
    label: "Líder Técnico",
    icon: Flag,
    color: "text-purple-500",
    variant: "secondary",
  },
  {
    value: "Functional Analyst",
    label: "Analista Funcional",
    icon: FileTextIcon,
    color: "text-amber-500",
    variant: "warning",
  },
  {
    value: "Other",
    label: "Otro",
    icon: Sliders,
    color: "text-muted-foreground",
    variant: "muted",
  },
]

export const findOption = <TValue extends string>(
  options: SelectOption<TValue>[],
  value: string
) => options.find((option) => option.value === value)
