export default function SiteFooter() {
  return (
    <footer className="bg-gray-50 border-t mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="text-xl">✨</div>
            <span className="font-display font-semibold text-gray-800">
              Peter Pan Boca
            </span>
          </div>
          
          <div className="text-sm text-gray-600 text-center md:text-right">
            <p>&copy; 2025 Peter Pan Boca. All rights reserved.</p>
            <p className="mt-1">Capturing magical moments since 2023</p>
          </div>
        </div>
        
        <div className="border-t pt-6 mt-6 text-center text-xs text-gray-500">
          <p>
            "All you need is faith, trust, and a little bit of pixie dust." - Peter Pan
          </p>
        </div>
      </div>
    </footer>
  );
}