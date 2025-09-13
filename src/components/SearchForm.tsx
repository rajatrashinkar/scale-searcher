import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Target, Users, MapPin, Building2 } from "lucide-react";

interface SearchFormProps {
  onSearch: (searchParams: SearchParams) => void;
  isSearching?: boolean;
}

export interface SearchParams {
  naturalLanguageQuery: string;
  role: string;
  industry: string;
  location: string;
  companySize: string;
  additionalCriteria: string;
}

export const SearchForm = ({ onSearch, isSearching = false }: SearchFormProps) => {
  const [formData, setFormData] = useState<SearchParams>({
    naturalLanguageQuery: "Find founders in staffing/recruitment firms from Bangalore with 50-100 employees who are actively seeking to scale their businesses",
    role: "Founder",
    industry: "Staffing/Recruitment",
    location: "Bangalore, India",
    companySize: "50-100 employees",
    additionalCriteria: "actively seeking to scale"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(formData);
  };

  const generateQuery = () => {
    const parts = [
      formData.role && `"${formData.role}"`,
      formData.industry && `"${formData.industry}"`,
      formData.location && `"${formData.location}"`,
      formData.companySize && `"${formData.companySize}"`,
      formData.additionalCriteria && `"${formData.additionalCriteria}"`
    ].filter(Boolean);
    
    return `site:linkedin.com/in/ ${parts.join(" ")}`;
  };

  return (
    <Card className="business-card">
      <CardHeader className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Target className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle className="text-2xl">Professional Contact Search</CardTitle>
            <CardDescription className="text-base">
              Find targeted leads with precision using natural language queries
            </CardDescription>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Search className="h-3 w-3" />
            LinkedIn Targeted
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            Lead Generation
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Building2 className="h-3 w-3" />
            Business Intelligence
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Natural Language Query */}
          <div className="space-y-2">
            <Label htmlFor="naturalQuery" className="text-sm font-medium flex items-center gap-2">
              <Search className="h-4 w-4" />
              Natural Language Search Query
            </Label>
            <Textarea
              id="naturalQuery"
              placeholder="Describe who you're looking for in natural language..."
              value={formData.naturalLanguageQuery}
              onChange={(e) => setFormData({ ...formData, naturalLanguageQuery: e.target.value })}
              className="min-h-[100px] resize-none"
            />
          </div>

          {/* Structured Parameters */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="role" className="text-sm font-medium">Target Role</Label>
              <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Founder">Founder</SelectItem>
                  <SelectItem value="CEO">CEO</SelectItem>
                  <SelectItem value="CTO">CTO</SelectItem>
                  <SelectItem value="VP">VP</SelectItem>
                  <SelectItem value="Director">Director</SelectItem>
                  <SelectItem value="Manager">Manager</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="industry" className="text-sm font-medium">Industry</Label>
              <Input
                id="industry"
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                placeholder="e.g., Staffing/Recruitment"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="text-sm font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Location
              </Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g., Bangalore, India"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="companySize" className="text-sm font-medium">Company Size</Label>
              <Select value={formData.companySize} onValueChange={(value) => setFormData({ ...formData, companySize: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select company size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-10 employees">1-10 employees</SelectItem>
                  <SelectItem value="11-50 employees">11-50 employees</SelectItem>
                  <SelectItem value="50-100 employees">50-100 employees</SelectItem>
                  <SelectItem value="100-500 employees">100-500 employees</SelectItem>
                  <SelectItem value="500+ employees">500+ employees</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="additionalCriteria" className="text-sm font-medium">Additional Criteria</Label>
            <Input
              id="additionalCriteria"
              value={formData.additionalCriteria}
              onChange={(e) => setFormData({ ...formData, additionalCriteria: e.target.value })}
              placeholder="e.g., actively seeking to scale, hiring, expanding"
            />
          </div>

          {/* Generated Query Preview */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Generated LinkedIn Search Query</Label>
            <div className="p-3 bg-muted rounded-md font-mono text-sm text-muted-foreground">
              {generateQuery()}
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full btn-business h-12 text-base font-medium"
            disabled={isSearching}
          >
            {isSearching ? (
              <>
                <div className="loading-pulse mr-2 h-4 w-4 rounded-full bg-current" />
                Searching LinkedIn Profiles...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Find Professional Contacts
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};