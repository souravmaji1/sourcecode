import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RocketIcon, MessageCircleIcon } from "lucide-react"

export default function Faq() {
  return (
    <Card className="w-full mt-20  max-w-6xl mx-auto">
      <CardContent className="p-6 bg-gradient-to-b from-purple-500 to-blue-600 text-white rounded-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-4xl font-bold text-center">Get Started Now</CardTitle>
        </CardHeader>
        <div className="space-y-6">
          <p className="text-center text-lg">There will always be a free plan.</p>
          <div className="flex justify-center">
            <Button className="bg-white text-blue-600 hover:bg-gray-100">
              <RocketIcon className="mr-2 h-4 w-4" />
              Get Started
            </Button>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-center">Have questions?</h3>
            <p className="text-center">Join our discord and wed love to help out!</p>
          </div>
          <div className="flex justify-center">
            <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-blue-600">
              <MessageCircleIcon className="mr-2 h-4 w-4" />
              Discord
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}