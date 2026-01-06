"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Task, NotificationFrequency } from "@/lib/types"
import { saveTask } from "@/app/actions/tasks"
import { Plus } from "lucide-react"

interface TaskFormProps {
  onAddTask: (task: Task) => void
  token: string
}

const PRESET_COLORS = [
  { name: "Rosa suave", value: "#FFC0CB" },
  { name: "Azul", value: "#60A5FA" },
  { name: "Verde", value: "#4ADE80" },
  { name: "Amarillo", value: "#FBBF24" },
  { name: "Morado", value: "#A78BFA" },
  { name: "Naranja", value: "#FB923C" },
  { name: "Rojo", value: "#F87171" },
  { name: "Gris", value: "#9CA3AF" },
]

export default function TaskForm({ onAddTask, token }: TaskFormProps) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [startDay, setStartDay] = useState("")
  const [endDay, setEndDay] = useState("")
  const [isRecurring, setIsRecurring] = useState(true)
  const [enableNotifications, setEnableNotifications] = useState(true)
  const [user, setUser] = useState("")
  const [frequency, setFrequency] = useState<NotificationFrequency>("daily")
  const [color, setColor] = useState("#FFC0CB")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      // Validaciones
      if (!title.trim()) {
        setError("Por favor ingresa un título para la tarea")
        return
      }

      const start = Number.parseInt(startDay)

      if (isNaN(start) || start < 1 || start > 31) {
        setError("El día de inicio debe ser un número entre 1 y 31")
        return
      }

      // Si no hay endDay, usar startDay
      const end = endDay ? Number.parseInt(endDay) : start

      if (endDay && (isNaN(end) || end < 1 || end > 31)) {
        setError("El día final debe ser un número entre 1 y 31")
        return
      }

      if (start > end) {
        setError("El día de inicio no puede ser mayor que el día final")
        return
      }

      // Crear nueva tarea
      const newTask: Task = {
        id: Date.now().toString(),
        title,
        startDay: start,
        endDay: end,
        createdAt: new Date().toISOString(),
        completions: [],
        isRecurring,
        enableNotifications,
        token,
        user: user.trim() || undefined,
        frequency,
        color,
      }

      // Guardar en la base de datos
      const result = await saveTask(newTask)

      if (!result.success) {
        setError(result.error || "Error al guardar la tarea")
        return
      }

      onAddTask(newTask)

      // Limpiar formulario y cerrar dialog
      setTitle("")
      setStartDay("")
      setEndDay("")
      setIsRecurring(true)
      setEnableNotifications(true)
      setUser("")
      setFrequency("daily")
      setColor("#FFC0CB")
      setOpen(false)
    } catch (error) {
      setError("Ocurrió un error al guardar la tarea")
      console.error("Error al guardar la tarea:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-violet-600 hover:bg-violet-700">
          <Plus className="size-4 mr-2" />
          Nueva Tarea
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Crear Nueva Tarea</DialogTitle>
          <DialogDescription>
            Completa los datos para crear una nueva tarea. Los campos marcados son opcionales.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título de la Tarea *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Pagar factura de luz"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="user">Usuario (opcional)</Label>
            <Input
              id="user"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              placeholder="Ej: Juan Pérez"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDay">Día de inicio *</Label>
              <Input
                id="startDay"
                type="number"
                min="1"
                max="31"
                value={startDay}
                onChange={(e) => setStartDay(e.target.value)}
                placeholder="1-31"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDay">Día final (opcional)</Label>
              <Input
                id="endDay"
                type="number"
                min="1"
                max="31"
                value={endDay}
                onChange={(e) => setEndDay(e.target.value)}
                placeholder="Mismo que inicio si está vacío"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="frequency">Frecuencia de Notificaciones</Label>
            <Select value={frequency} onValueChange={(value) => setFrequency(value as NotificationFrequency)}>
              <SelectTrigger id="frequency">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Todos los días (desde inicio hasta fin)</SelectItem>
                <SelectItem value="alternate">Días alternos (día sí, día no)</SelectItem>
                <SelectItem value="week_before">Una semana antes del día final</SelectItem>
                <SelectItem value="day_before">Un día antes del día final</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="color">Color de la Tarea</Label>
            <Select value={color} onValueChange={setColor}>
              <SelectTrigger id="color">
                <div className="flex items-center gap-2">
                  <div
                    className="size-4 rounded-full border"
                    style={{ backgroundColor: color }}
                  />
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent>
                {PRESET_COLORS.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    <div className="flex items-center gap-2">
                      <div
                        className="size-4 rounded-full border"
                        style={{ backgroundColor: c.value }}
                      />
                      {c.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isRecurring"
                checked={isRecurring}
                onCheckedChange={(checked) => setIsRecurring(checked === true)}
              />
              <Label htmlFor="isRecurring" className="cursor-pointer">
                Renovar tarea cada mes
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="enableNotifications"
                checked={enableNotifications}
                onCheckedChange={(checked) => setEnableNotifications(checked === true)}
              />
              <Label htmlFor="enableNotifications" className="cursor-pointer">
                Activar notificaciones
              </Label>
            </div>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-violet-600 hover:bg-violet-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Guardando..." : "Crear Tarea"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
