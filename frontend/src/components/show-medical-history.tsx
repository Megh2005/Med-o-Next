'use client'

import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useParams } from 'next/navigation'
import axios from 'axios'

interface MedicalHistory {
  id: number
  description: string
  diagnosis: string
  treatment: string
  patientId: number
  createdAt: string
  updatedAt: string
}

export function ShowMedicalHistoryComponent() {
  const [medicalHistories, setMedicalHistories] = useState<MedicalHistory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const params = useParams(); // Get params from the URL
  const patientId = params.patientId; // Extract the patientId from params


  useEffect(() => {
    const fetchMedicalHistories = async () => {
      try {
        const response = await axios.get(`/api/medical-history/${patientId}`)
        setMedicalHistories(response.data)
      } catch (err) {
        setError('Failed to fetch medical histories. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    if (patientId) {
      fetchMedicalHistories();
    }
  }, [patientId])


  if (isLoading) {
    return <LoadingSkeleton />
  }

  if (error) {
    return <ErrorMessage message={error} />
  }

  return (
    <div className=" p-8 container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Medical Histories</h1>
      {medicalHistories.map((history) => (
        <Card key={history.id} className="mb-6">
          <CardHeader>
            <CardTitle>Medical History #{history.id}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Description</TableCell>
                  <TableCell>{history.description}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Diagnosis</TableCell>
                  <TableCell>{history.diagnosis}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Treatment</TableCell>
                  <TableCell>{history.treatment}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Patient ID</TableCell>
                  <TableCell>{history.patientId}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Created At</TableCell>
                  <TableCell>{format(new Date(history.createdAt), 'PPpp')}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Updated At</TableCell>
                  <TableCell>{format(new Date(history.updatedAt), 'PPpp')}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Medical Histories</h1>
      <Card className="mb-6">
        <CardHeader>
          <Skeleton className="h-6 w-[250px]" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="container mx-auto py-10">
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{message}</span>
      </div>
    </div>
  )
}