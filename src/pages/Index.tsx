import { useState, useEffect } from "react";
import { SearchForm, SearchParams } from "@/components/SearchForm";
import { ResultsTable, SearchResult } from "@/components/ResultsTable";
import { ApiKeyModal } from "@/components/ApiKeyModal";
import { SearchService } from "@/services/searchService";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { 
  Search, 
  Database, 
  Target, 
  Zap, 
  Settings, 
  TrendingUp,
  Users,
  Download,
  Linkedin
} from "lucide-react";

const Index = () => {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showApiModal, setShowApiModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [totalResults, setTotalResults] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    // Check if API key exists
    const apiKey = SearchService.getApiKey();
    if (!apiKey) {
      setShowApiModal(true);
    }
  }, []);

  const handleSearch = async (searchParams: SearchParams) => {
    const apiKey = SearchService.getApiKey();
    if (!apiKey) {
      setShowApiModal(true);
      return;
    }

    setIsSearching(true);
    try {
      const searchResults = await SearchService.searchLinkedInProfiles(searchParams);
      setResults(searchResults.results);
      setSearchQuery(searchResults.query);
      setTotalResults(searchResults.totalResults);
      
      toast({
        title: "Search Complete",
        description: `Found ${searchResults.totalResults} professional contacts`,
      });
    } catch (error) {
      toast({
        title: "Search Failed",
        description: "Unable to complete search. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleApiKeySaved = (apiKey: string) => {
    SearchService.setApiKey(apiKey);
  };

  const handleExportExcel = () => {
    if (results.length === 0) {
      toast({
        title: "No Data to Export",
        description: "Please perform a search first",
        variant: "destructive",
      });
      return;
    }
    
    SearchService.exportToExcel(results, searchQuery);
    toast({
      title: "Export Complete",
      description: "Results downloaded as CSV file",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Hero Section */}
      <div className="hero-gradient text-white py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl">
                <Database className="h-12 w-12" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Professional Lead Generation
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
              Find targeted business contacts with precision using AI-powered LinkedIn search
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Badge variant="secondary" className="bg-white/10 text-white border-white/20 px-4 py-2">
                <Linkedin className="h-4 w-4 mr-2" />
                LinkedIn Targeted
              </Badge>
              <Badge variant="secondary" className="bg-white/10 text-white border-white/20 px-4 py-2">
                <Target className="h-4 w-4 mr-2" />
                Precision Search
              </Badge>
              <Badge variant="secondary" className="bg-white/10 text-white border-white/20 px-4 py-2">
                <Download className="h-4 w-4 mr-2" />
                Excel Export
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-12 px-4 bg-background">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">500M+</div>
              <div className="text-sm text-muted-foreground">LinkedIn Profiles</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">95%</div>
              <div className="text-sm text-muted-foreground">Search Accuracy</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">2s</div>
              <div className="text-sm text-muted-foreground">Average Search Time</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">Excel</div>
              <div className="text-sm text-muted-foreground">Export Format</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-12 px-4">
        <div className="container mx-auto max-w-6xl space-y-8">
          {/* Configuration */}
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-semibold">Search Configuration</h2>
              <p className="text-muted-foreground">Configure your professional contact search parameters</p>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowApiModal(true)}
              className="flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              API Settings
            </Button>
          </div>

          {/* Search Form */}
          <SearchForm onSearch={handleSearch} isSearching={isSearching} />

          {/* Results */}
          {(results.length > 0 || isSearching) && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-success" />
                <h2 className="text-2xl font-semibold">Search Results</h2>
              </div>
              
              {isSearching ? (
                <div className="business-card">
                  <div className="flex flex-col items-center justify-center py-16">
                    <div className="loading-pulse h-12 w-12 rounded-full bg-primary mb-4" />
                    <h3 className="text-lg font-medium">Searching LinkedIn Profiles...</h3>
                    <p className="text-muted-foreground">This may take a few moments</p>
                  </div>
                </div>
              ) : (
                <ResultsTable
                  results={results}
                  searchQuery={searchQuery}
                  totalResults={totalResults}
                  onExportExcel={handleExportExcel}
                />
              )}
            </div>
          )}
        </div>
      </div>

      {/* API Key Modal */}
      <ApiKeyModal
        isOpen={showApiModal}
        onClose={() => setShowApiModal(false)}
        onApiKeySaved={handleApiKeySaved}
      />
    </div>
  );
};

export default Index;
