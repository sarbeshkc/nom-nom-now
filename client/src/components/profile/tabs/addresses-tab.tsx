import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, MapPin, Edit2, Trash2 } from 'lucide-react'
import { useState } from 'react'

interface Address {
  id: string
  label: string
  street: string
  city: string
  state: string
  zipCode: string
  isDefault: boolean
}

export function AddressesTab() {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [isAddingAddress, setIsAddingAddress] = useState(false)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Delivery Addresses</CardTitle>
            <CardDescription>
              Manage your delivery addresses
            </CardDescription>
          </div>
          <Button 
            onClick={() => setIsAddingAddress(true)}
            className="bg-[#FF4500] hover:bg-[#FF4500]/90 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Address
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {addresses.map((address) => (
            <div
              key={address.id}
              className="flex items-start justify-between p-4 border rounded-lg"
            >
              <div className="flex gap-4">
                <MapPin className="h-5 w-5 text-gray-400 mt-1" />
                <div>
                  <h4 className="font-medium">{address.label}</h4>
                  <p className="text-sm text-gray-600">
                    {address.street}, {address.city}
                  </p>
                  <p className="text-sm text-gray-600">
                    {address.state}, {address.zipCode}
                  </p>
                  {address.isDefault && (
                    <span className="text-xs text-[#FF4500] mt-1">
                      Default Address
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm">
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-red-500">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}

          {addresses.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No addresses saved yet</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
