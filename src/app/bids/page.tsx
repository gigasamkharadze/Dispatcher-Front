"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Truck, Package, Scale, Hash } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { api } from "@/lib/api"
import { Toast, useToast } from "@/components/ui/toast"

interface Bid {
  id: number;
  order_id: string;
  owner: {
    first_name: string;
    last_name: string;
  };
  driver: {
    first_name: string;
    last_name: string;
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
}

export default function BidsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedBid, setSelectedBid] = useState<Bid | null>(null)
  const [bids, setBids] = useState<Bid[]>([])
  const [loading, setLoading] = useState(true)
  const [bidPrices, setBidPrices] = useState<{ [key: number]: string }>({})
  const { toast, showToast, hideToast } = useToast()

  useEffect(() => {
    let interval: NodeJS.Timeout;
    const fetchBids = async () => {
      try {
        const data = await api.getBids();
        setBids(data);
      } catch (error) {
        showToast("Failed to fetch bids", "error");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchBids();
    interval = setInterval(fetchBids, 10000); // Poll every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const handleAcceptBid = async (orderId: string, bidId: number) => {
    try {
      await api.acceptBid(orderId, bidId.toString());
      setBids(bids.filter(bid => bid.id !== bidId));
      showToast("Bid accepted successfully", "success");
    } catch (error) {
      showToast("Failed to accept bid", "error");
      console.error(error);
    }
  };

  const handleRejectBid = async (bidId: number) => {
    try {
      await api.rejectBid(bidId.toString());
      setBids(bids.filter(bid => bid.id !== bidId));
      showToast("Bid rejected successfully", "success");
    } catch (error) {
      showToast("Failed to reject bid", "error");
      console.error(error);
    }
  };

  const handleCreateOrder = async (bidId: number, price: string) => {
    if (!price || isNaN(Number(price)) || Number(price) <= 0) {
      showToast("Please enter a valid price", "error");
      return;
    }

    try {
      console.log('Creating order with:', { bidId, price });
      await api.createOrder(bidId.toString(), price);
      setBids(bids.filter(bid => bid.id !== bidId));
      showToast("Order created successfully", "success");
    } catch (error) {
      console.error('Error creating order:', error);
      showToast("Failed to create order", "error");
    }
  };

  const handlePriceChange = (bidId: number, price: string) => {
    setBidPrices(prev => ({
      ...prev,
      [bidId]: price
    }));
  };

  const filteredBids = bids.filter(bid => {
    const searchLower = searchQuery.toLowerCase();
    return (
      bid.order_id.toLowerCase().includes(searchLower) ||
      bid.pickup_location.toLowerCase().includes(searchLower) ||
      bid.delivery_location.toLowerCase().includes(searchLower) ||
      `${bid.owner.first_name} ${bid.owner.last_name}`.toLowerCase().includes(searchLower) ||
      `${bid.driver.first_name} ${bid.driver.last_name}`.toLowerCase().includes(searchLower)
    );
  });

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
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
          <Input
            type="search"
            placeholder="Search bids..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
      </div>

      <div className="grid gap-6">
        {filteredBids.length === 0 ? (
          <Card className="p-6">
            <CardContent className="flex flex-col items-center justify-center py-8 text-center">
              <Package className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Bids Available</h3>
              <p className="text-muted-foreground">
                There are currently no bids to display. Check back later for new bids.
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredBids.map((bid) => (
            <Card key={bid.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div>
                  <CardTitle className="text-xl mb-2">
                    Order #{bid.order_id}
                  </CardTitle>
                  <div className="text-sm text-muted-foreground">
                    Owner: {bid.owner.first_name} {bid.owner.last_name} | Driver: {bid.driver.first_name} {bid.driver.last_name}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>Pickup: {bid.pickup_location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>Pickup Date: {new Date(bid.pickup_date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>Delivery: {bid.delivery_location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>Delivery Date: {new Date(bid.delivery_date).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Truck className="h-4 w-4" />
                      <span>Load Type: {bid.load_type}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Hash className="h-4 w-4" />
                      <span>Miles: {bid.miles}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      <span>Stops: {bid.stops}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Scale className="h-4 w-4" />
                      <span>Weight: {bid.weight} {bid.weight_unit}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    <span>Dimensions: {bid.dimensions}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    <span>Pieces: {bid.pieces}</span>
                  </div>
                  {bid.notes && (
                    <div className="mt-2 p-3 bg-muted rounded-md">
                      <div className="text-sm font-medium mb-1">Notes:</div>
                      <div className="text-sm text-muted-foreground">{bid.notes}</div>
                    </div>
                  )}
                </div>

                <div className="mt-4 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <Input
                        type="number"
                        placeholder="Enter your price"
                        value={bidPrices[bid.id] || ''}
                        onChange={(e) => handlePriceChange(bid.id, e.target.value)}
                        className="w-full"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="default"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleCreateOrder(bid.id, bidPrices[bid.id] || '')}
                      >
                        Create Order
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleRejectBid(bid.id)}
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Offered Price: ${bid.offered_price}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
} 