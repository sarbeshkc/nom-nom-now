import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function AboutUs() {
  return (
    <Card className="mb-12">
      <CardHeader>
        <CardTitle>About Us</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">
          At Nom Nom Now, our primary goal is to provide fast delivery and a convenient way for customers to reserve tables at their favorite restaurants. We aim to make food delivery seamless and enjoyable for everyone. Our dedicated team works tirelessly to ensure that your culinary experiences are nothing short of exceptional, whether you're dining in or enjoying a meal at home. With a wide selection of top-rated restaurants and a user-friendly platform, we're committed to satisfying your cravings and elevating your dining experience. Join us in our journey to revolutionize the way you enjoy food!
        </p>
      </CardContent>
    </Card>
  )
}

