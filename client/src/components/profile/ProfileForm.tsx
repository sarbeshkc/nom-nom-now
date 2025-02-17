// src/components/profile/ProfileForm.tsx
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PlusCircle, Trash } from 'lucide-react'

interface ProfileFormProps {
  user: any
  onUpdate: (data: any) => Promise<void>
}

export function ProfileForm({ user, onUpdate }: ProfileFormProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [formData, setFormData] = useState({
    name: user.name || '',
    bio: user.bio || '',
    email: user.email || '',
    phoneNumbers: user.phoneNumbers || [],
    addresses: user.addresses || []
  })

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setAvatarFile(e.target.files[0])
    }
  }

  const handleAddPhoneNumber = () => {
    setFormData(prev => ({
      ...prev,
      phoneNumbers: [...prev.phoneNumbers, { number: '', isPrimary: false }]
    }))
  }

  const handleAddAddress = () => {
    setFormData(prev => ({
      ...prev,
      addresses: [...prev.addresses, { 
        street: '', 
        city: '', 
        province: '', 
        ward: '', 
        isPrimary: false 
      }]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const formDataToSend = new FormData()
      if (avatarFile) {
        formDataToSend.append('avatar', avatarFile)
      }
      formDataToSend.append('data', JSON.stringify(formData))

      await onUpdate(formDataToSend)
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Avatar Section */}
      <div className="flex items-center gap-6">
        <Avatar className="w-24 h-24">
          <AvatarImage src={user.avatar || ''} alt={user.name} />
          <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="space-y-2">
          <Input
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
            id="avatar-upload"
          />
          <Label
            htmlFor="avatar-upload"
            className="cursor-pointer inline-flex items-center gap-2 text-sm text-primary hover:text-primary/90"
          >
            Change avatar
          </Label>
        </div>
      </div>

      {/* Basic Info */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            disabled
          />
        </div>
      </div>

      {/* Phone Numbers */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Phone Numbers</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddPhoneNumber}
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Add Phone
          </Button>
        </div>
        {formData.phoneNumbers.map((phone, index) => (
          <div key={index} className="flex gap-4 items-center">
            <Input
              value={phone.number}
              onChange={(e) => {
                const newPhones = [...formData.phoneNumbers]
                newPhones[index].number = e.target.value
                setFormData({ ...formData, phoneNumbers: newPhones })
              }}
              placeholder="Enter phone number"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => {
                const newPhones = formData.phoneNumbers.filter((_, i) => i !== index)
                setFormData({ ...formData, phoneNumbers: newPhones })
              }}
            >
              <Trash className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>

      {/* Addresses */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Addresses</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddAddress}
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Add Address
          </Button>
        </div>
        {formData.addresses.map((address, index) => (
          <div key={index} className="space-y-4 p-4 border rounded-lg">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Street</Label>
                <Input
                  value={address.street}
                  onChange={(e) => {
                    const newAddresses = [...formData.addresses]
                    newAddresses[index].street = e.target.value
                    setFormData({ ...formData, addresses: newAddresses })
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>Ward</Label>
                <Input
                  type="number"
                  value={address.ward}
                  onChange={(e) => {
                    const newAddresses = [...formData.addresses]
                    newAddresses[index].ward = parseInt(e.target.value)
                    setFormData({ ...formData, addresses: newAddresses })
                  }}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>City</Label>
                <Input
                  value={address.city}
                  onChange={(e) => {
                    const newAddresses = [...formData.addresses]
                    newAddresses[index].city = e.target.value
                    setFormData({ ...formData, addresses: newAddresses })
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>Province</Label>
                <Input
                  value={address.province}
                  onChange={(e) => {
                    const newAddresses = [...formData.addresses]
                    newAddresses[index].province = e.target.value
                    setFormData({ ...formData, addresses: newAddresses })
                  }}
                />
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                const newAddresses = formData.addresses.filter((_, i) => i !== index)
                setFormData({ ...formData, addresses: newAddresses })
              }}
              className="w-full text-red-500 hover:text-red-600"
            >
              <Trash className="w-4 h-4 mr-2" />
              Remove Address
            </Button>
          </div>
        ))}
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Updating..." : "Update Profile"}
      </Button>
    </form>
  )
}