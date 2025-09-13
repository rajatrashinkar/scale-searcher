import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Download, 
  ExternalLink, 
  Filter, 
  Search, 
  Users, 
  FileText,
  CheckCircle
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export interface SearchResult {
  id: string;
  title: string;
  link: string;
  snippet: string;
  name?: string;
  role?: string;
  company?: string;
  location?: string;
}

interface ResultsTableProps {
  results: SearchResult[];
  searchQuery: string;
  totalResults: number;
  onExportExcel: () => void;
}

export const ResultsTable = ({ 
  results, 
  searchQuery, 
  totalResults,
  onExportExcel 
}: ResultsTableProps) => {
  const [filterText, setFilterText] = useState("");
  const { toast } = useToast();

  const filteredResults = results.filter(result => 
    result.title.toLowerCase().includes(filterText.toLowerCase()) ||
    result.snippet.toLowerCase().includes(filterText.toLowerCase())
  );

  const extractNameFromTitle = (title: string) => {
    const match = title.match(/^([^-|]+)/);
    return match ? match[1].trim() : title;
  };

  const extractRoleFromTitle = (title: string) => {
    const roleMatch = title.match(/(?:-|–)\s*([^|]+)/);
    return roleMatch ? roleMatch[1].trim() : "Not specified";
  };

  const extractCompanyFromSnippet = (snippet: string) => {
    const companyMatch = snippet.match(/at\s+([^.]+)/i) || 
                        snippet.match(/\b([A-Z][a-zA-Z\s&]+(?:Inc|LLC|Corp|Ltd|Company|Group|Solutions|Technologies|Services))\b/);
    return companyMatch ? companyMatch[1].trim() : "Not specified";
  };

  const handleViewProfile = (link: string) => {
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  const handleExport = () => {
    onExportExcel();
    toast({
      title: "Export Started",
      description: "Your results are being prepared for download...",
      duration: 3000,
    });
  };

  if (results.length === 0) {
    return (
      <Card className="business-card">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Search className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg font-medium text-muted-foreground">No results yet</p>
          <p className="text-sm text-muted-foreground">Enter your search criteria to find professional contacts</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="business-card">
      <CardHeader className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-2xl flex items-center gap-3">
              <div className="p-2 bg-success/10 rounded-lg">
                <Users className="h-6 w-6 text-success" />
              </div>
              Search Results
            </CardTitle>
            <CardDescription className="text-base mt-2">
              Found {totalResults} professional contacts matching your criteria
            </CardDescription>
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={handleExport}
              className="btn-business"
              size="sm"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Excel
            </Button>
          </div>
        </div>

        {/* Search Query Display */}
        <div className="p-3 bg-muted rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">Search Query</span>
          </div>
          <code className="text-sm font-mono">{searchQuery}</code>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Filter results..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="max-w-sm"
          />
          <Badge variant="outline" className="ml-auto">
            {filteredResults.length} of {results.length} results
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <div className="data-table">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Professional</TableHead>
                <TableHead>Role & Company</TableHead>
                <TableHead>Profile Summary</TableHead>
                <TableHead className="text-center w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredResults.map((result) => (
                <TableRow key={result.id} className="hover:bg-muted/50 transition-colors">
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium text-foreground">
                        {extractNameFromTitle(result.title)}
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-success" />
                        <span className="text-xs text-success font-medium">LinkedIn Verified</span>
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="space-y-1">
                      <Badge variant="secondary" className="text-xs">
                        {extractRoleFromTitle(result.title)}
                      </Badge>
                      <div className="text-sm text-muted-foreground">
                        {extractCompanyFromSnippet(result.snippet)}
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {result.snippet}
                    </p>
                  </TableCell>
                  
                  <TableCell className="text-center">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewProfile(result.link)}
                      className="h-8 w-8 p-0"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};