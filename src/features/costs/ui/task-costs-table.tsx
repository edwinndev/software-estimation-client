"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatCurrency } from "@/lib/format"
import type { TaskCost } from "../types/task-cost"
import { CostProfileIdentity } from "./cost-profile-identity"

type TaskCostsTableProps = {
  taskCosts: readonly TaskCost[]
}

export const TaskCostsTable = ({ taskCosts }: TaskCostsTableProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Costos por tarea</CardTitle>
        <CardDescription>
          El costo de cada tarea es horas × CER del perfil técnico (soles). Si
          hay varios perfiles, se suma el de cada uno.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tarea</TableHead>
              <TableHead>Perfil</TableHead>
              <TableHead className="text-right">Horas</TableHead>
              <TableHead className="text-right">Costo</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {taskCosts.map((task) => (
              <TableRow key={task.taskId}>
                <TableCell className="font-medium">{task.taskName}</TableCell>
                <TableCell>
                  <div className="flex flex-col gap-2">
                    {task.profiles.map((profile) => (
                      <CostProfileIdentity
                        key={profile.profileId}
                        name={profile.profileName}
                        role={profile.profileRole}
                        email={profile.profileEmail}
                      />
                    ))}
                  </div>
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {task.totalHours} h
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {formatCurrency(task.totalCost)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
