import { useState } from "react";
import QRCode from "react-qr-code";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

function ScanCheckoutQR() {
  const [sessionId, setSessionId] = useState("");
  const [checkoutData, setCheckoutData] = useState(null);
  const { toast } = useToast();

  const handleFetchCheckout = async () => {
    if (!sessionId.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid Session ID.",
        variant: "destructive",
      });
      return;
    }
    try {
      const res = await fetch(
        `https://endusermenumania.onrender.com/api/checkout/${sessionId}`
      );
      const data = await res.json();
      if (res.ok) {
        setCheckoutData(data);
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to fetch checkout data",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Something went wrong while fetching data.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white px-4 py-10">
      <h1 className="text-4xl md:text-5xl font-extrabold text-teal-400 mb-8 text-center">
        Scan to Checkout
      </h1>
      <Card className="bg-zinc-900 border border-zinc-700 shadow-2xl p-6 rounded-2xl max-w-2xl w-full animate-fade-in">
        <CardContent className="flex flex-col items-center gap-6">
          <QRCode
            value={sessionId || "d80f413b-6f47-49b1-a5b3-d76a6fd39c97"}
            size={180}
            bgColor="#000000"
            fgColor="#14b8a6"
          />
          <Input
            placeholder="Enter or Scan Session ID"
            value={sessionId}
            onChange={(e) => setSessionId(e.target.value)}
            className="bg-zinc-800 border-zinc-700 text-white focus:ring-teal-500 focus:border-teal-500"
          />
          <Button
            onClick={handleFetchCheckout}
            className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-full text-lg transition-all duration-200"
          >
            Fetch Checkout Details
          </Button>

          {checkoutData && (
            <div className="mt-6 w-full bg-zinc-800 rounded-xl p-4 text-sm text-gray-300 space-y-3 overflow-auto max-h-[400px]">
              <h2 className="text-teal-400 font-bold text-lg">
                Table No: {checkoutData.tableNo}
              </h2>
              <p>Total Amount: ₹{checkoutData.totalAmount}</p>
              <p>Paid Online: ₹{checkoutData.paidOnline}</p>
              <p>Remaining: ₹{checkoutData.remainingAmount}</p>
              <div className="space-y-4">
                {checkoutData.orders.map((order, idx) => (
                  <div
                    key={idx}
                    className="bg-zinc-900 p-3 rounded-lg border border-zinc-700"
                  >
                    <p className="text-teal-300">Order ID: {order.OrderId}</p>
                    <p>Status: {order.Status}</p>
                    <p>
                      Date: {new Date(order.orderDateTime).toLocaleString()}
                    </p>
                    <div className="mt-2 space-y-1">
                      {order.Items.map((item, i) => (
                        <div key={i} className="flex justify-between">
                          <span>
                            {item.Name} x {item.Quantity}
                          </span>
                          <span>₹{item.Total}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default ScanCheckoutQR;
