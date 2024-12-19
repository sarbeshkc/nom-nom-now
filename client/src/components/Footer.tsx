export default function Footer() {
    return (
      <footer className="bg-gray-50 border-t">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold mb-4">About Nom Nom Now</h3>
              <p className="text-gray-600">
                Your favorite restaurants, delivered to your doorstep.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900">Help Center</a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900">Partner with Us</a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900">Contact</a>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900">Terms of Service</a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900">Privacy Policy</a>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t text-center text-gray-600">
            <p>&copy; {new Date().getFullYear()} Nom Nom Now. All rights reserved.</p>
          </div>
        </div>
      </footer>
    );
  }