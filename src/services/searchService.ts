import { SearchParams } from "@/components/SearchForm";
import { SearchResult } from "@/components/ResultsTable";

// Mock SerpAPI integration - In production, this would connect to actual SerpAPI
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
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const query = this.buildLinkedInQuery(params);

    // Mock results for demonstration
    const mockResults: SearchResult[] = [
      {
        id: "1",
        title: "Rajesh Kumar - Founder & CEO | TalentBridge Solutions",
        link: "https://linkedin.com/in/rajesh-kumar-talentbridge",
        snippet: "Experienced founder in the staffing industry with 8+ years of experience. Leading TalentBridge Solutions, a 75-employee recruitment firm based in Bangalore. Currently expanding operations across South India and looking to scale technology solutions.",
      },
      {
        id: "2", 
        title: "Priya Sharma - Co-Founder | RecruitPro India",
        link: "https://linkedin.com/in/priya-sharma-recruitpro",
        snippet: "Co-founder of RecruitPro India, a growing staffing company with 60+ employees in Bangalore. Specializes in IT and engineering recruitment. Actively seeking partnerships and investment for rapid scaling across tier-2 cities.",
      },
      {
        id: "3",
        title: "Amit Patel - Founder | StaffingHub Bangalore", 
        link: "https://linkedin.com/in/amit-patel-staffinghub",
        snippet: "Serial entrepreneur and founder of StaffingHub, a 85-person recruitment agency in Bangalore. Expert in healthcare and finance staffing. Currently fundraising for expansion and technology upgrades to scale operations.",
      },
      {
        id: "4",
        title: "Sneha Reddy - CEO & Founder | TalentFlow Solutions",
        link: "https://linkedin.com/in/sneha-reddy-talentflow", 
        snippet: "Founder of TalentFlow Solutions with 90 employees across Bangalore and Hyderabad. Specializing in technical recruitment for startups and enterprises. Looking to scale through AI-powered recruitment tools and geographic expansion.",
      },
      {
        id: "5",
        title: "Vikram Singh - Founder | EliteStaff Recruiters",
        link: "https://linkedin.com/in/vikram-singh-elitestaff",
        snippet: "Founder of EliteStaff Recruiters, a boutique staffing firm with 55 employees in Bangalore. Focus on executive search and high-skilled placements. Exploring strategic partnerships and technology investments for business growth.",
      },
      {
        id: "6",
        title: "Kavitha Menon - Co-Founder | NextGen Staffing",
        link: "https://linkedin.com/in/kavitha-menon-nextgen",
        snippet: "Co-founder of NextGen Staffing with 70+ team members in Bangalore. Specializes in remote work placements and digital talent acquisition. Actively scaling operations and implementing new recruitment technologies.",
      },
      {
        id: "7",
        title: "Rohit Agarwal - Founder & Managing Director | ProHire Solutions",
        link: "https://linkedin.com/in/rohit-agarwal-prohire",
        snippet: "Managing Director of ProHire Solutions, a 80-employee staffing company in Bangalore. Expert in manufacturing and logistics recruitment. Currently expanding service offerings and seeking growth capital for market expansion.",
      },
      {
        id: "8",
        title: "Deepika Iyer - Founder | SkillBridge Recruitment",
        link: "https://linkedin.com/in/deepika-iyer-skillbridge",
        snippet: "Founder of SkillBridge Recruitment with 65 employees in Bangalore. Focuses on skill-based hiring for tech companies. Looking to scale through platform development and expansion into new industry verticals.",
      }
    ];

    return {
      results: mockResults,
      totalResults: mockResults.length,
      query: query
    };
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