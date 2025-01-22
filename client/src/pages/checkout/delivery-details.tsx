// 'use client'

// import { useState } from 'react'
// import { Button } from "@/components/ui/button"
// import { CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { useLocation } from 'react-router-dom';
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { DeliveryDetailsType as ExternalDeliveryDetailsType, DeliveryMethod, PickupType } from '../checkout/page';
// import { MapPin, Navigation, Phone } from 'lucide-react'

// interface DeliveryDetailsType {
//   method: string;
//   pickupType: string;
//   province: string;
//   district: string;
//   municipality: string;
//   wardNo: string;
//   tole: string;
//   landmark: string;
//   phone: string;
//   deliveryPhone: string;
// }

// interface DeliveryDetailsProps {
//   onSubmit: (details: DeliveryDetailsType) => void
// }

// interface CartItem {
//   id: number;
//   name: string;
//   price: number;
//   quantity: number;
//   // Add other properties as needed
// }


// const RESTAURANT_LOCATION = {
//   province: "Bagmati",
//   district: "Kathmandu",
//   municipality: "Kathmandu Metropolitan City",
//   wardNo: "1",
//   tole: "Thamel",
//   landmark: "Near Thamel Chowk"
// }

// export function DeliveryDetails({ onSubmit }: DeliveryDetailsProps) {
//   const location = useLocation();
//   const { items, subtotal } = location.state as { items: CartItem[]; subtotal: number }; // Get items and subtotal from state

//   const [details, setDetails] = useState<DeliveryDetailsType>({
//     method: 'delivery',
//     pickupType: 'designated',
//     province: '',
//     district: '',
//     municipality: '',
//     wardNo: '',
//     tole: '',
//     landmark: '',
//     phone: '',
//     deliveryPhone: ''
//   })

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault()
//     if (details.method === 'pickup' && details.pickupType === 'restaurant') {
//       onSubmit({
//         ...details,
//         ...RESTAURANT_LOCATION
//       })
//     } else {
//       onSubmit(details)
//     }
//   }

//   return (
//     <form onSubmit={handleSubmit}>
//       <CardHeader>
//         <CardTitle className="flex items-center space-x-2">
//           <Navigation className="h-5 w-5 text-[#FF780B]" />
//           <span>Delivery Details</span>
//         </CardTitle>
//       </CardHeader>
//       <CardContent className="space-y-6">
//         {/* Display subtotal */}
//         <div>
//           <h3 className="font-semibold">Subtotal: NPR {subtotal}</h3>
//         </div>
//         {/* Display ordered items */}
//         <div>
//           <h4 className="font-semibold">Ordered Items:</h4>
//           <ul>
//             {items.map(item => (
//               <li key={item.id}>
//                 {item.name} (x{item.quantity}) - NPR {item.price * item.quantity}
//               </li>
//             ))}
//           </ul>
//         </div>

//         <RadioGroup
//           defaultValue={details.method}
//           onValueChange={(value) => setDetails({ 
//             ...details, 
//             method: value as DeliveryMethod,
//             pickupType: 'designated'
//           })}
//           className="flex space-x-4"
//         >
//           <div className="flex items-center space-x-2">
//             <RadioGroupItem value="delivery" id="delivery" />
//             <Label htmlFor="delivery">Delivery</Label>
//           </div>
//           <div className="flex items-center space-x-2">
//             <RadioGroupItem value="pickup" id="pickup" />
//             <Label htmlFor="pickup">Pickup</Label>
//           </div>
//         </RadioGroup>

//         {details.method === 'pickup' && (
//           <RadioGroup
//             value={details.pickupType}
//             onValueChange={(value) => setDetails({ ...details, pickupType: value as PickupType })}
//             className="grid gap-4"
//           >
//             <div className="flex items-center space-x-3 rounded-lg border p-4">
//               <RadioGroupItem value="designated" id="designated" />
//               <Label htmlFor="designated" className="flex-1">
//                 <div className="font-medium">Designated Location</div>
//                 <div className="text-sm text-gray-500">Choose your preferred pickup location</div>
//               </Label>
//             </div>
//             <div className="flex items-center space-x-3 rounded-lg border p-4">
//               <RadioGroupItem value="restaurant" id="restaurant" />
//               <Label htmlFor="restaurant" className="flex-1">
//                 <div className="font-medium">Restaurant Location</div>
//                 <div className="text-sm text-gray-500">Pickup from our restaurant at {RESTAURANT_LOCATION.tole}</div>
//               </Label>
//             </div>
//           </RadioGroup>
//         )}

//         {(details.method === 'delivery' || details.pickupType === 'designated') && (
//           <div className="grid gap-6">
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <Label htmlFor="province">Province</Label>
//                 <Select 
//                   value={details.province}
//                   onValueChange={(value) => setDetails({ ...details, province: value })}
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select province" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="bagmati">Bagmati</SelectItem>
//                     <SelectItem value="gandaki">Gandaki</SelectItem>
//                     <SelectItem value="lumbini">Lumbini</SelectItem>
//                     <SelectItem value="karnali">Karnali</SelectItem>
//                     <SelectItem value="sudurpashchim">Sudurpashchim</SelectItem>
//                     <SelectItem value="province1">Province 1</SelectItem>
//                     <SelectItem value="madhesh">Madhesh</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//               <div>
//                 <Label htmlFor="district">District</Label>
//                 <Select 
//                   value={details.district}
//                   onValueChange={(value) => setDetails({ ...details, district: value })}
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select district" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="kathmandu">Kathmandu</SelectItem>
//                     <SelectItem value="lalitpur">Lalitpur</SelectItem>
//                     <SelectItem value="bhaktapur">Bhaktapur</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>

//             <div>
//               <Label htmlFor="municipality">Municipality/VDC</Label>
//               <Input
//                 id="municipality"
//                 value={details.municipality}
//                 onChange={(e) => setDetails({ ...details, municipality: e.target.value })}
//                 placeholder="Enter municipality or VDC"
//               />
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <Label htmlFor="wardNo">Ward No.</Label>
//                 <Input
//                   id="wardNo"
//                   value={details.wardNo}
//                   onChange={(e) => setDetails({ ...details, wardNo: e.target.value })}
//                   placeholder="Enter ward number"
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="tole">Tole/Street</Label>
//                 <Input
//                   id="tole"
//                   value={details.tole}
//                   onChange={(e) => setDetails({ ...details, tole: e.target.value })}
//                   placeholder="Enter tole or street name"
//                 />
//               </div>
//             </div>

//             <div>
//               <Label htmlFor="landmark">Landmark</Label>
//               <Input
//                 id="landmark"
//                 value={details.landmark}
//                 onChange={(e) => setDetails({ ...details, landmark: e.target.value })}
//                 placeholder="Enter a nearby landmark"
//               />
//             </div>
//           </div>
//         )}

//         <div className="space-y-4 p-4 rounded-lg bg-gray-50">
//           <div>
//             <Label htmlFor="phone" className="flex items-center space-x-2">
//               <Phone className="h-4 w-4 text-[#FF780B]" />
//               <span>Your Contact Number</span>
//             </Label>
//             <Input
//               id="phone"
//               type="tel"
//               value={details.phone}
//               onChange={(e) => setDetails({ ...details, phone: e.target.value })}
//               placeholder="Enter your phone number"
//             />
//           </div>

//           {details.method === 'delivery' && (
//             <div>
//               <Label htmlFor="deliveryPhone" className="flex items-center space-x-2">
//                 <Phone className="h-4 w-4 text-[#FF780B]" />
//                 <span>Alternative Contact Number</span>
//               </Label>
//               <Input
//                 id="deliveryPhone"
//                 type="tel"
//                 value={details.deliveryPhone}
//                 onChange={(e) => setDetails({ ...details, deliveryPhone: e.target.value })}
//                 placeholder="Enter alternative phone number"
//               />
//             </div>
//           )}
//         </div>
//       </CardContent>
//       <CardFooter className="justify-end space-x-4">
//         <Button 
//           type="submit"
//           className="bg-[#FF780B] hover:bg-[#FF780B]/90 text-white"
//         >
//           Continue to Summary
//         </Button>
//       </CardFooter>
//     </form>
//   )
// }

