import { SearchParams } from "@/components/SearchForm";
import { SearchResult } from "@/components/ResultsTable";

// SerpAPI integration for real Google search results
export class SearchService {
  private static apiKey: string | null = null;

  static setApiKey(key: string) {
    this.apiKey = key;
    localStorage.setItem('serpapi_key', key);
  }

  static getApiKey(): string | null {
    if (!this.apiKey) {
      this.apiKey = localStorage.getItem('serpapi_key');
    }
    return this.apiKey;
  }

  static async searchLinkedInProfiles(params: SearchParams): Promise<{
    results: SearchResult[];
    totalResults: number;
    query: string;
  }> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      throw new Error('SerpAPI key is required. Please set your API key first.');
    }

    const query = this.buildLinkedInQuery(params);
    
    try {
      const response = await fetch(`https://serpapi.com/search?engine=google&q=${encodeURIComponent(query)}&api_key=${apiKey}&num=20`);
      
      if (!response.ok) {
        throw new Error(`SerpAPI request failed: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(`SerpAPI error: ${data.error}`);
      }

      const organicResults = data.organic_results || [];
      
      const results: SearchResult[] = organicResults
        .filter((result: any) => result.link && result.link.includes('linkedin.com/in/'))
        .map((result: any, index: number) => ({
          id: `${Date.now()}-${index}`,
          title: result.title || 'No title',
          link: result.link,
          snippet: result.snippet || 'No description available'
        }));

      return {
        results,
        totalResults: data.search_information?.total_results || results.length,
        query: query
      };
    } catch (error) {
      console.error('SerpAPI search failed:', error);
      throw new Error(`Search failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private static buildLinkedInQuery(params: SearchParams): string {
    const parts = [
      params.role && `"${params.role}"`,
      params.industry && `"${params.industry}"`, 
      params.location && `"${params.location}"`,
      params.companySize && `"${params.companySize}"`,
      params.additionalCriteria && `"${params.additionalCriteria}"`
    ].filter(Boolean);

    return `site:linkedin.com/in/ ${parts.join(" ")}`;
  }

  static exportToExcel(results: SearchResult[], searchQuery: string): void {
    // Prepare data for export
    const exportData = results.map(result => ({
      Name: this.extractNameFromTitle(result.title),
      Title: this.extractRoleFromTitle(result.title), 
      Company: this.extractCompanyFromSnippet(result.snippet),
      LinkedIn_URL: result.link,
      Profile_Summary: result.snippet,
      Search_Query: searchQuery,
      Export_Date: new Date().toISOString().split('T')[0]
    }));

    // Convert to CSV format for download
    const csvContent = this.convertToCSV(exportData);
    this.downloadCSV(csvContent, `linkedin_leads_${new Date().toISOString().split('T')[0]}.csv`);
  }

  private static extractNameFromTitle(title: string): string {
    const match = title.match(/^([^-|]+)/);
    return match ? match[1].trim() : title;
  }

  private static extractRoleFromTitle(title: string): string {
    const roleMatch = title.match(/(?:-|–)\s*([^|]+)/);
    return roleMatch ? roleMatch[1].trim() : "Not specified";
  }

  private static extractCompanyFromSnippet(snippet: string): string {
    const companyMatch = snippet.match(/at\s+([^.]+)/i) || 
                        snippet.match(/\b([A-Z][a-zA-Z\s&]+(?:Inc|LLC|Corp|Ltd|Company|Group|Solutions|Technologies|Services))\b/);
    return companyMatch ? companyMatch[1].trim() : "Not specified";
  }

  private static convertToCSV(data: any[]): string {
    if (data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header] || '';
          // Escape commas and quotes in CSV
          return `"${value.toString().replace(/"/g, '""')}"`;
        }).join(',')
      )
    ];
    
    return csvRows.join('\n');
  }

  private static downloadCSV(csvContent: string, filename: string): void {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}