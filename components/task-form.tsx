"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import type { Task } from "@/lib/types"
import { saveTask } from "@/app/actions/tasks"

interface TaskFormProps {
  onAddTask: (task: Task) => void
  token: string
}

export default function TaskForm({ onAddTask, token }: TaskFormProps) {
  const [title, setTitle] = useState("")
  const [startDay, setStartDay] = useState("")
  const [endDay, setEndDay] = useState("")
  const [isRecurring, setIsRecurring] = useState(true)
  const [enableNotifications, setEnableNotifications] = useState(true)
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
      const end = Number.parseInt(endDay)

      if (isNaN(start) || start < 1 || start > 31) {
        setError("El día de inicio debe ser un número entre 1 y 31")
        return
      }

      if (isNaN(end) || end < 1 || end > 31) {
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
      }

      // Guardar en la base de datos
      const result = await saveTask(newTask)

      if (!result.success) {
        setError(result.error || "Error al guardar la tarea")
        return
      }

      onAddTask(newTask)

      // Limpiar formulario
      setTitle("")
      setStartDay("")
      setEndDay("")
      setIsRecurring(true)
      setEnableNotifications(true)
    } catch (error) {
      setError("Ocurrió un error al guardar la tarea")
      console.error("Error al guardar la tarea:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="border-violet-200 shadow-md">
      <CardHeader className="bg-violet-50 border-b border-violet-100">
        <CardTitle className="text-violet-800">Crear Nueva Tarea</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título de la Tarea</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Pagar factura de luz"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDay">Día de inicio</Label>
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
              <Label htmlFor="endDay">Día final</Label>
              <Input
                id="endDay"
                type="number"
                min="1"
                max="31"
                value={endDay}
                onChange={(e) => setEndDay(e.target.value)}
                placeholder="1-31"
              />
            </div>
          </div>

          <div className="space-y-4">
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

          <Button
            type="submit"
            className="w-full bg-violet-600 hover:bg-violet-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Guardando..." : "Crear Tarea"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
