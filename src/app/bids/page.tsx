"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Truck, Package, Scale, Hash } from "lucide-react"

// Mock data for bids
const mockBids = [
  {
    id: 1,
    order_id: "ORD-001",
    owner: {
      first_name: "John",
      last_name: "Doe"
    },
    driver: {
      first_name: "Mike",
      last_name: "Smith"
    },
    pickup_location: "Tbilisi, Georgia",
    pickup_date: "2024-03-20",
    delivery_location: "Batumi, Georgia",
    delivery_date: "2024-03-21",
    load_type: "Electronics",
    miles: 350,
    stops: 1,
    vehicle_required: "Box Truck",
    notes: "Fragile cargo, handle with care",
    offered_price: 150.00,
    dimensions: "48x40x40 inches",
    weight: 500,
    weight_unit: "lbs",
    pieces: 10,
    status: "pending"
  },
  {
    id: 2,
    order_id: "ORD-002",
    owner: {
      first_name: "Jane",
      last_name: "Smith"
    },
    driver: {
      first_name: "Alex",
      last_name: "Johnson"
    },
    pickup_location: "Kutaisi, Georgia",
    pickup_date: "2024-03-22",
    delivery_location: "Tbilisi, Georgia",
    delivery_date: "2024-03-22",
    load_type: "Furniture",
    miles: 220,
    stops: 2,
    vehicle_required: "Flatbed",
    notes: "Heavy items, need lift gate",
    offered_price: 100.00,
    dimensions: "60x48x36 inches",
    weight: 800,
    weight_unit: "lbs",
    pieces: 5,
    status: "pending"
  },
]

export default function DispatcherPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="grid gap-6">
        {mockBids.map((bid) => (
          <Card key={bid.id} className="w-full">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-xl mb-2">
                    Order #{bid.order_id}
                  </CardTitle>
                  <div className="text-sm text-muted-foreground">
                    Owner: {bid.owner.first_name} {bid.owner.last_name} | Driver: {bid.driver.first_name} {bid.driver.last_name}
                  </div>
                </div>
                <Badge variant="outline">{bid.status}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>Route</span>
                  </div>
                  <div className="font-medium">
                    {bid.pickup_location} → {bid.delivery_location}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {bid.miles} miles | {bid.stops} stops
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Schedule</span>
                  </div>
                  <div className="font-medium">
                    Pickup: {new Date(bid.pickup_date).toLocaleDateString()}
                  </div>
                  <div className="font-medium">
                    Delivery: {new Date(bid.delivery_date).toLocaleDateString()}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Truck className="h-4 w-4" />
                    <span>Vehicle</span>
                  </div>
                  <div className="font-medium">
                    {bid.vehicle_required}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Package className="h-4 w-4" />
                    <span>Cargo Details</span>
                  </div>
                  <div className="font-medium">
                    {bid.load_type}
                  </div>
                  <div className="text-sm">
                    {bid.pieces} pieces | {bid.dimensions}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Scale className="h-4 w-4" />
                    <span>Weight</span>
                  </div>
                  <div className="font-medium">
                    {bid.weight} {bid.weight_unit}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Hash className="h-4 w-4" />
                    <span>Price</span>
                  </div>
                  <div className="font-medium">
                    ${bid.offered_price}
                  </div>
                </div>
              </div>

              {bid.notes && (
                <div className="mb-6 p-3 bg-muted rounded-md">
                  <div className="text-sm font-medium mb-1">Notes:</div>
                  <div className="text-sm text-muted-foreground">{bid.notes}</div>
                </div>
              )}
              
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <label className="text-sm text-gray-500 mb-2 block">Your Price</label>
                  <Input type="number" placeholder="Enter your price" />
                </div>
                <Button variant="default" className="bg-green-600 hover:bg-green-700">
                  Accept
                </Button>
                <Button variant="destructive">
                  Reject
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 