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
import type { TaskCost } from "../types/task-cost"

interface TaskCostsTableProps {
  taskCosts: readonly TaskCost[]
}

export const TaskCostsTable = ({ taskCosts }: TaskCostsTableProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Costos por tarea</CardTitle>
        <CardDescription>
          Costo estimado calculado para cada tarea del proyecto.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tarea</TableHead>
              <TableHead className="text-right">Costo estimado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {taskCosts.map((task) => (
              <TableRow key={task.taskId}>
                <TableCell className="font-medium">{task.taskName}</TableCell>
                <TableCell className="text-right">{task.totalCost}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
