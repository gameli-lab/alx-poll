export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">PollApp</h3>
            <p className="text-sm text-muted-foreground">
              Create and participate in polls with ease.
            </p>
          </div>
          
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Features</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>Create Polls</li>
              <li>Vote Anonymously</li>
              <li>Real-time Results</li>
              <li>Share Polls</li>
            </ul>
          </div>
          
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Support</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>Help Center</li>
              <li>Contact Us</li>
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
            </ul>
          </div>
          
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Connect</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>Twitter</li>
              <li>GitHub</li>
              <li>Discord</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; 2024 PollApp. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
