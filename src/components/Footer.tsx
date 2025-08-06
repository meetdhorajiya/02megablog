export default function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 mt-auto">
      <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Nexus. All Rights Reserved.</p>
          <p className="mt-1">
            Built with Next.js and Tailwind CSS.
          </p>
        </div>
      </div>
    </footer>
  );
}