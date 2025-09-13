import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Key, ExternalLink, Shield } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApiKeySaved: (apiKey: string) => void;
}

export const ApiKeyModal = ({ isOpen, onClose, onApiKeySaved }: ApiKeyModalProps) => {
  const [apiKey, setApiKey] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    if (!apiKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter your SerpAPI key",
        variant: "destructive",
      });
      return;
    }

    setIsValidating(true);
    
    // Simulate API key validation
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      onApiKeySaved(apiKey);
      toast({
        title: "Success",
        description: "API key saved successfully!",
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error", 
        description: "Invalid API key. Please check and try again.",
        variant: "destructive",
      });
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Configure SerpAPI Key
          </DialogTitle>
          <DialogDescription>
            Enter your SerpAPI key to start searching LinkedIn profiles. Your key is stored securely in your browser.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              Your API key is stored locally and never sent to our servers. It's only used to authenticate with SerpAPI.
            </AlertDescription>
          </Alert>
          
          <div className="space-y-2">
            <Label htmlFor="apiKey">SerpAPI Key</Label>
            <Input
              id="apiKey"
              type="password"
              placeholder="Enter your SerpAPI key..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="font-mono"
            />
          </div>
          
          <div className="text-sm text-muted-foreground">
            Don't have a SerpAPI key?{" "}
            <Button
              variant="link"
              className="p-0 h-auto text-primary"
              onClick={() => window.open("https://serpapi.com/", "_blank")}
            >
              Get one here
              <ExternalLink className="h-3 w-3 ml-1" />
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={isValidating}
            className="btn-business"
          >
            {isValidating ? "Validating..." : "Save API Key"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};