function Footer() {
    return(
        <footer className="bg-gray-900 text-white px-6 py-12 bottom-0 left-0">
  <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
   
    <div>
      <h2 className="text-2xl font-bold mb-2">Howsing</h2>
      <p className="text-gray-400">Find your perfect home with ease. Trusted by thousands of users across the country.</p>
    </div>

    <div>
      <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
      <ul className="space-y-2 text-gray-300">
        <li><a href="#" className="hover:text-white">Home</a></li>
        <li><a href="#" className="hover:text-white">Properties</a></li>
        <li><a href="#" className="hover:text-white">Agents</a></li>
        <li><a href="#" className="hover:text-white">Contact Us</a></li>
      </ul>
    </div>

    <div>
      <h3 className="text-xl font-semibold mb-4">Contact</h3>
      <p className="text-gray-300">Email: support@howsing.com</p>
      <p className="text-gray-300">Phone: +1 234 567 890</p>
      <p className="text-gray-300">Address: 123 Main St, New York, NY</p>
    </div>

    
    <div>
      <h3 className="text-xl font-semibold mb-4">Follow Us</h3>
      <div className="flex space-x-4 text-gray-300">
        <a href="#" className="hover:text-white"><i className="fab fa-facebook-f"></i></a>
        <a href="#" className="hover:text-white"><i className="fab fa-twitter"></i></a>
        <a href="#" className="hover:text-white"><i className="fab fa-instagram"></i></a>
        <a href="#" className="hover:text-white"><i className="fab fa-linkedin-in"></i></a>
      </div>
    </div>
  </div>

  <div className="mt-12 text-center text-gray-500 border-t border-gray-700 pt-6">
    © 2025 Howsing. All rights reserved.
  </div>
</footer>

    )
}
export default Footer;