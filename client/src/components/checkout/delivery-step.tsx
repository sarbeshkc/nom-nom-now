"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface DeliveryStepProps {
  deliveryDetails: {
    type: string
    province: string
    district: string
    municipality: string
    ward: string
    street: string
    landmark: string
    phone: string
    alternativePhone: string
  }
  setDeliveryDetails: (details: any) => void
  onBack: () => void
  onNext: () => void
}

export function DeliveryStep({ deliveryDetails, setDeliveryDetails, onBack, onNext }: DeliveryStepProps) {
  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-bold mb-6">Delivery Details</h2>

      <div className="space-y-6">
        <RadioGroup
          value={deliveryDetails.type}
          onValueChange={(value) => setDeliveryDetails({ ...deliveryDetails, type: value })}
          className="flex gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="delivery" id="delivery" />
            <Label htmlFor="delivery">Delivery</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="pickup" id="pickup" />
            <Label htmlFor="pickup">Pickup</Label>
          </div>
        </RadioGroup>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Province</Label>
            <Select
              value={deliveryDetails.province}
              onValueChange={(value) => setDeliveryDetails({ ...deliveryDetails, province: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select province" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bagmati">Bagmati</SelectItem>
                <SelectItem value="gandaki">Gandaki</SelectItem>
                {/* Add more provinces */}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>District</Label>
            <Select
              value={deliveryDetails.district}
              onValueChange={(value) => setDeliveryDetails({ ...deliveryDetails, district: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select district" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="kavre">Kavre</SelectItem>
                <SelectItem value="kathmandu">Kathmandu</SelectItem>
                {/* Add more districts */}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Municipality/VDC</Label>
          <Input
            value={deliveryDetails.municipality}
            onChange={(e) =>
              setDeliveryDetails({
                ...deliveryDetails,
                municipality: e.target.value,
              })
            }
            placeholder="Enter municipality or VDC"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Ward No.</Label>
            <Input
              value={deliveryDetails.ward}
              onChange={(e) => setDeliveryDetails({ ...deliveryDetails, ward: e.target.value })}
              placeholder="Enter ward number"
            />
          </div>

          <div className="space-y-2">
            <Label>Tole/Street</Label>
            <Input
              value={deliveryDetails.street}
              onChange={(e) => setDeliveryDetails({ ...deliveryDetails, street: e.target.value })}
              placeholder="Enter tole or street name"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Landmark</Label>
          <Input
            value={deliveryDetails.landmark}
            onChange={(e) =>
              setDeliveryDetails({
                ...deliveryDetails,
                landmark: e.target.value,
              })
            }
            placeholder="Enter a nearby landmark"
          />
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Your Contact Number</Label>
            <Input
              value={deliveryDetails.phone}
              onChange={(e) => setDeliveryDetails({ ...deliveryDetails, phone: e.target.value })}
              placeholder="Enter your phone number"
            />
          </div>

          <div className="space-y-2">
            <Label>Alternative Contact Number</Label>
            <Input
              value={deliveryDetails.alternativePhone}
              onChange={(e) =>
                setDeliveryDetails({
                  ...deliveryDetails,
                  alternativePhone: e.target.value,
                })
              }
              placeholder="Enter alternative phone number"
            />
          </div>
        </div>

        <div className="flex gap-4">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button className="bg-[#FF4D00] hover:bg-[#ff6a33] text-white" onClick={onNext}>
            Continue to Summary
          </Button>
        </div>
      </div>
    </div>
  )
}

