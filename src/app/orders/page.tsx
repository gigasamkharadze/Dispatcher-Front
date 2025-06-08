"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Truck, Package, Calendar, DollarSign, MapPin, Building2, User, Phone, Mail, FileText, Clock, Scale, Hash } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { api } from "@/lib/api"
import { Toast, useToast } from "@/components/ui/toast"

interface Order {
  id: number;
  company: {
    name: string;
    email: string;
  };
  dispatcher: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
  };
  total_price: number;
  status: string;
  bid: {
    id: number;
    owner: {
      first_name: string;
      last_name: string;
    };
    driver: {
      first_name: string;
      last_name: string;
      phone_number: string;
    };
    pickup_location: string;
    pickup_date: string;
    delivery_location: string;
    delivery_date: string;
    load_type: string;
    miles: number;
    stops: number;
    vehicle_required: string;
    notes?: string;
    offered_price: number;
    dimensions: string;
    weight: number;
    weight_unit: string;
    pieces: number;
  } | null;
}

const statusColors = {
  'Pending': "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  'In Progress': "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  'Completed': "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  'Cancelled': "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
}

const statusLabels = {
  'Pending': "Pending",
  'In Progress': "In Progress",
  'Completed': "Completed",
  'Cancelled': "Cancelled"
}

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const { toast, showToast, hideToast } = useToast()

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await api.getOrders();
        // Sort orders by id descending (newest first)
        setOrders(data.sort((a: Order, b: Order) => b.id - a.id));
      } catch (error) {
        showToast("Failed to fetch orders", "error");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleStatusUpdate = async (orderId: number, newStatus: string) => {
    try {
      // Update UI immediately for both the list and selected order
      const updatedOrders = orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      );
      setOrders(updatedOrders);
      
      // Update selected order if it's the one being modified
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
      
      // Update backend
      await api.updateOrderStatus(orderId.toString(), newStatus);
      showToast("Order status updated successfully", "success");
    } catch (error) {
      // Revert UI changes if backend update fails
      const originalOrders = orders.map(order => 
        order.id === orderId ? { ...order, status: order.status } : order
      );
      setOrders(originalOrders);
      
      // Revert selected order if it was modified
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: selectedOrder.status });
      }
      
      showToast("Failed to update order status", "error");
      console.error(error);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.status.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = selectedStatus === "all" || order.status === selectedStatus

    return matchesSearch && matchesStatus
  })

  if (loading) {
    return <div className="container mx-auto p-6">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-3 py-2 border rounded-md"
        >
          <option value="all">All Statuses</option>
          {Object.entries(statusLabels).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

      <div className="grid gap-6">
        {filteredOrders.map((order) => (
          <Card 
            key={order.id} 
            className="cursor-pointer hover:shadow-lg transition-shadow px-8 py-6 border border-gray-200"
            onClick={() => setSelectedOrder(order)}
          >
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center gap-6 justify-between">
                <div className="flex items-center gap-3">
                  <Building2 className="h-6 w-6 text-muted-foreground" />
                  <span className="font-semibold text-lg">{order.company.name}</span>
                  <span className="text-sm text-muted-foreground ml-2">Order #{order.id}</span>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 items-start sm:items-center">
                  {order.bid && (
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm font-semibold">Initial Price:</span>
                      <span className="text-base ml-1">${order.bid.offered_price}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm font-semibold">Total Price:</span>
                    <span className="text-base ml-1">${order.total_price}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Status:</span>
                    <span className="text-base font-medium ml-1">{statusLabels[order.status as keyof typeof statusLabels]}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-8 mt-2">
                {order.bid && (
                  <>
                    <div className="flex flex-col gap-1 min-w-[180px]">
                      <div className="flex items-center gap-2">
                        <User className="h-5 w-5 text-muted-foreground" />
                        <span className="text-sm font-semibold">Owner:</span>
                        <span className="text-sm ml-1">{order.bid.owner.first_name} {order.bid.owner.last_name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="h-5 w-5 text-muted-foreground" />
                        <span className="text-sm font-semibold">Driver:</span>
                        <span className="text-sm ml-1">{order.bid.driver.first_name} {order.bid.driver.last_name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-5 w-5 text-muted-foreground" />
                        <span className="text-sm font-semibold">Driver Phone:</span>
                        <span className="text-sm ml-1">{order.bid.driver.phone_number}</span>
                      </div>
                    </div>
                    <div className="flex flex-1 flex-row gap-8 min-w-[400px]">
                      <div className="flex flex-col gap-1 min-w-[180px]">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-5 w-5 text-muted-foreground" />
                          <span className="text-sm font-semibold">Pickup:</span>
                          <span className="text-sm ml-1">{order.bid.pickup_location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-5 w-5 text-muted-foreground" />
                          <span className="text-sm font-semibold">Pickup Date:</span>
                          <span className="text-sm ml-1">{new Date(order.bid.pickup_date).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1 min-w-[180px]">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-5 w-5 text-muted-foreground" />
                          <span className="text-sm font-semibold">Delivery:</span>
                          <span className="text-sm ml-1">{order.bid.delivery_location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-5 w-5 text-muted-foreground" />
                          <span className="text-sm font-semibold">Delivery Date:</span>
                          <span className="text-sm ml-1">{new Date(order.bid.delivery_date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}
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
                <DialogTitle className="text-2xl">Order Details - #{selectedOrder.id}</DialogTitle>
                <DialogDescription className="text-base">
                  Company: {selectedOrder.company.name}
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
                          <p className="text-sm text-muted-foreground">{selectedOrder.company.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Email</p>
                          <p className="text-sm text-muted-foreground">{selectedOrder.company.email}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedOrder.bid && (
                  <div className="space-y-4 p-4 rounded-lg border bg-card">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      Bid Details
                    </h3>
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <User className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">Owner</p>
                            <p className="text-sm text-muted-foreground">
                              {selectedOrder.bid.owner.first_name} {selectedOrder.bid.owner.last_name}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">Driver</p>
                            <p className="text-sm text-muted-foreground">
                              {selectedOrder.bid.driver.first_name} {selectedOrder.bid.driver.last_name}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">Driver Phone</p>
                            <p className="text-sm text-muted-foreground">{selectedOrder.bid.driver.phone_number}</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">Pickup Location</p>
                            <p className="text-sm text-muted-foreground">{selectedOrder.bid.pickup_location}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">Pickup Date</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(selectedOrder.bid.pickup_date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">Delivery Location</p>
                            <p className="text-sm text-muted-foreground">{selectedOrder.bid.delivery_location}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">Delivery Date</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(selectedOrder.bid.delivery_date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <Truck className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">Load Type</p>
                            <p className="text-sm text-muted-foreground">{selectedOrder.bid.load_type}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Hash className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">Miles</p>
                            <p className="text-sm text-muted-foreground">{selectedOrder.bid.miles}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Hash className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">Stops</p>
                            <p className="text-sm text-muted-foreground">{selectedOrder.bid.stops}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Truck className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">Vehicle Required</p>
                            <p className="text-sm text-muted-foreground">{selectedOrder.bid.vehicle_required}</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <Scale className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">Weight</p>
                            <p className="text-sm text-muted-foreground">
                              {selectedOrder.bid.weight} {selectedOrder.bid.weight_unit}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Package className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">Dimensions</p>
                            <p className="text-sm text-muted-foreground">{selectedOrder.bid.dimensions}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Hash className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">Pieces</p>
                            <p className="text-sm text-muted-foreground">{selectedOrder.bid.pieces}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">Offered Price</p>
                            <p className="text-sm text-muted-foreground">${selectedOrder.bid.offered_price}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {selectedOrder.bid.notes && (
                      <div className="mt-4 p-4 bg-muted rounded-lg">
                        <h4 className="text-sm font-medium mb-2">Notes</h4>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                          {selectedOrder.bid.notes}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                <div className="space-y-4 p-4 rounded-lg border bg-card">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Order Status
                  </h3>
                  <div className="flex gap-4">
                    {Object.entries(statusLabels).map(([value, label]) => (
                      <Button
                        key={value}
                        variant={selectedOrder.status === value ? "default" : "outline"}
                        onClick={() => handleStatusUpdate(selectedOrder.id, value)}
                      >
                        {label}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 