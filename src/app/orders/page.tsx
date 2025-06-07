"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Truck, Package, Calendar, DollarSign, MapPin, Building2, User, Phone, Mail, FileText, Clock, Scale } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { useState } from "react"

// Mock data for orders
const mockOrders = [
  {
    id: "ORD001",
    company: "ABC Logistics",
    dispatcher: "John Smith",
    pickup: "New York, NY",
    delivery: "Boston, MA",
    loadType: "General Cargo",
    totalPrice: 2500,
    status: "pending",
    createdAt: "2024-02-20T10:00:00Z",
    vehicle: "Box Truck",
    weight: "2.5 tons",
    notes: "Fragile cargo, handle with care",
    contact: {
      name: "Mike Johnson",
      phone: "+1 (555) 123-4567",
      email: "mike@abclogistics.com"
    },
    timeline: [
      { status: "Order Created", date: "2024-02-20T10:00:00Z" },
      { status: "Assigned to Dispatcher", date: "2024-02-20T10:30:00Z" },
      { status: "Driver Assigned", date: "2024-02-20T11:00:00Z" }
    ]
  },
  {
    id: "ORD002",
    company: "XYZ Transport",
    dispatcher: "Sarah Wilson",
    pickup: "Los Angeles, CA",
    delivery: "San Francisco, CA",
    loadType: "Refrigerated",
    totalPrice: 3500,
    status: "in_progress",
    createdAt: "2024-02-19T15:30:00Z",
    vehicle: "Refrigerated Truck",
    weight: "3.0 tons",
    notes: "Temperature controlled cargo, maintain -5°C",
    contact: {
      name: "Lisa Brown",
      phone: "+1 (555) 987-6543",
      email: "lisa@xyztransport.com"
    },
    timeline: [
      { status: "Order Created", date: "2024-02-19T15:30:00Z" },
      { status: "Assigned to Dispatcher", date: "2024-02-19T16:00:00Z" },
      { status: "Driver Assigned", date: "2024-02-19T16:30:00Z" },
      { status: "In Transit", date: "2024-02-20T08:00:00Z" }
    ]
  },
  {
    id: "ORD003",
    company: "Global Shipping",
    dispatcher: "Michael Brown",
    pickup: "Chicago, IL",
    delivery: "Detroit, MI",
    loadType: "Heavy Machinery",
    totalPrice: 5000,
    status: "completed",
    createdAt: "2024-02-18T09:15:00Z",
    vehicle: "Flatbed Truck",
    weight: "5.0 tons",
    notes: "Oversized load, requires special permits",
    contact: {
      name: "David Wilson",
      phone: "+1 (555) 456-7890",
      email: "david@globalshipping.com"
    },
    timeline: [
      { status: "Order Created", date: "2024-02-18T09:15:00Z" },
      { status: "Assigned to Dispatcher", date: "2024-02-18T09:45:00Z" },
      { status: "Driver Assigned", date: "2024-02-18T10:15:00Z" },
      { status: "In Transit", date: "2024-02-18T11:00:00Z" },
      { status: "Delivered", date: "2024-02-19T14:30:00Z" }
    ]
  }
]

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  in_progress: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
}

const statusLabels = {
  pending: "Pending",
  in_progress: "In Progress",
  completed: "Completed",
  cancelled: "Cancelled"
}

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedOrder, setSelectedOrder] = useState<typeof mockOrders[0] | null>(null)

  const filteredOrders = mockOrders.filter(order => {
    const matchesSearch = 
      order.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.pickup.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.delivery.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.loadType.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = selectedStatus === "all" || order.status === selectedStatus

    return matchesSearch && matchesStatus
  })

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold">Orders</h1>
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search orders..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedStatus === "all" ? "default" : "outline"}
          onClick={() => setSelectedStatus("all")}
        >
          All
        </Button>
        <Button
          variant={selectedStatus === "pending" ? "default" : "outline"}
          onClick={() => setSelectedStatus("pending")}
        >
          Pending
        </Button>
        <Button
          variant={selectedStatus === "in_progress" ? "default" : "outline"}
          onClick={() => setSelectedStatus("in_progress")}
        >
          In Progress
        </Button>
        <Button
          variant={selectedStatus === "completed" ? "default" : "outline"}
          onClick={() => setSelectedStatus("completed")}
        >
          Completed
        </Button>
        <Button
          variant={selectedStatus === "cancelled" ? "default" : "outline"}
          onClick={() => setSelectedStatus("cancelled")}
        >
          Cancelled
        </Button>
      </div>

      <div className="grid gap-6">
        {filteredOrders.map((order) => (
          <Card 
            key={order.id} 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setSelectedOrder(order)}
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between p-6">
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-4">
                  <Building2 className="h-6 w-6 text-muted-foreground" />
                  <div>
                    <h3 className="text-lg font-semibold">{order.company}</h3>
                    <p className="text-sm text-muted-foreground">Order #{order.id}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Dispatcher</p>
                      <p className="text-sm text-muted-foreground">{order.dispatcher}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Route</p>
                      <p className="text-sm text-muted-foreground">{order.pickup} → {order.delivery}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Cargo</p>
                      <p className="text-sm text-muted-foreground">{order.loadType}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-4 mt-4 md:mt-0">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Total Price</p>
                      <p className="text-sm text-muted-foreground">${order.totalPrice.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Created</p>
                      <p className="text-sm text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.status]}`}>
                  {statusLabels[order.status]}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">Order Details - {selectedOrder.id}</DialogTitle>
                <DialogDescription className="text-base">
                  Created on {new Date(selectedOrder.createdAt).toLocaleString()}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-8">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4 p-4 rounded-lg border bg-card">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Building2 className="h-5 w-5" />
                      Company Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Company Name</p>
                          <p className="text-sm text-muted-foreground">{selectedOrder.company}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Dispatcher</p>
                          <p className="text-sm text-muted-foreground">{selectedOrder.dispatcher}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 p-4 rounded-lg border bg-card">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Contact Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <User className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Contact Name</p>
                          <p className="text-sm text-muted-foreground">{selectedOrder.contact.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Phone</p>
                          <p className="text-sm text-muted-foreground">{selectedOrder.contact.phone}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Email</p>
                          <p className="text-sm text-muted-foreground">{selectedOrder.contact.email}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 p-4 rounded-lg border bg-card">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Route Information
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Pickup Location</p>
                        <p className="text-sm text-muted-foreground">{selectedOrder.pickup}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Delivery Location</p>
                        <p className="text-sm text-muted-foreground">{selectedOrder.delivery}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4 p-4 rounded-lg border bg-card">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      Cargo Details
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Package className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Cargo Type</p>
                          <p className="text-sm text-muted-foreground">{selectedOrder.loadType}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Truck className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Vehicle Type</p>
                          <p className="text-sm text-muted-foreground">{selectedOrder.vehicle}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Scale className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Weight</p>
                          <p className="text-sm text-muted-foreground">{selectedOrder.weight}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 p-4 rounded-lg border bg-card">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      Financial Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Total Price</p>
                          <p className="text-sm text-muted-foreground">${selectedOrder.totalPrice.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 p-4 rounded-lg border bg-card">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Notes
                  </h3>
                  <p className="text-sm text-muted-foreground">{selectedOrder.notes}</p>
                </div>

                <div className="space-y-4 p-4 rounded-lg border bg-card">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Order Timeline
                  </h3>
                  <div className="space-y-4">
                    {selectedOrder.timeline.map((event, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
                        <div>
                          <div className="text-sm font-medium">{event.status}</div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(event.date).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
} 