"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Send } from "lucide-react"
import { motion } from "framer-motion"

interface DeliveryStepProps {
  deliveryDetails: {
    type: string
    pickupType: string
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
    <div className="max-w-3xl">
      <div className="flex items-center gap-2 mb-6">
        <Send className="w-6 h-6 text-[#FF4D00]" />
        <h2 className="text-2xl font-bold">Delivery Details</h2>
      </div>

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

        {deliveryDetails.type === "pickup" ? (
          <div className="space-y-4">
            <RadioGroup
              value={deliveryDetails.pickupType}
              onValueChange={(value) => setDeliveryDetails({ ...deliveryDetails, pickupType: value })}
              className="space-y-4"
            >
              <div className="flex items-start space-x-3">
                <RadioGroupItem value="designated" id="designated" />
                <div>
                  <Label htmlFor="designated" className="font-medium">
                    Designated Location
                  </Label>
                  <p className="text-sm text-gray-500">Choose your preferred pickup location</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <RadioGroupItem value="restaurant" id="restaurant" />
                <div>
                  <Label htmlFor="restaurant" className="font-medium">
                    Restaurant Location
                  </Label>
                  <p className="text-sm text-gray-500">Pickup from our restaurant at Thamel</p>
                </div>
              </div>
            </RadioGroup>

            {deliveryDetails.pickupType === "designated" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pt-4">
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
              </motion.div>
            )}
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* Delivery form fields */}
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
          </motion.div>
        )}

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Your Contact Number</Label>
            <Input
              value={deliveryDetails.phone}
              onChange={(e) => setDeliveryDetails({ ...deliveryDetails, phone: e.target.value })}
              placeholder="Enter your phone number"
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