"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Document Analysis - Releef.ai',
  description: 'Analyze sustainability documents against compliance requirements'
};

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

interface Requirement {
  id: string;
  text: string;
}

interface Match {
  segment_text: string;
  confidence_score: number;
  gpt4_explanation: string;
}

interface RequirementMatch {
  requirement_id: string;
  requirement_text: string;
  matches: Match[];
}

export default function DocumentAnalysis() {
  const { toast } = useToast();
  const [documentText, setDocumentText] = useState('');
  const [requirements, setRequirements] = useState<Requirement[]>([
    { id: '1', text: '' }
  ]);
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<RequirementMatch[]>([]);

  const addRequirement = () => {
    setRequirements([
      ...requirements,
      { id: (requirements.length + 1).toString(), text: '' }
    ]);
  };

  const updateRequirement = (id: string, text: string) => {
    setRequirements(requirements.map(req =>
      req.id === id ? { ...req, text } : req
    ));
  };

  const analyzeDocument = async () => {
    try {
      setAnalyzing(true);
      const response = await fetch('/dashboard/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          document_text: documentText,
          requirements: requirements.filter(r => r.text.trim() !== '')
        }),
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const data = await response.json();
      setResults(data.matches);
      
      toast({
        title: "Analysis Complete",
        description: "Document has been analyzed against all requirements.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to analyze document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setAnalyzing(false);
    }
  };
  const [documentText, setDocumentText] = useState('');
  const [requirements, setRequirements] = useState<Requirement[]>([
    { id: '1', text: '' }
  ]);
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<RequirementMatch[]>([]);
  const { toast } = useToast();

  const addRequirement = () => {
    setRequirements([
      ...requirements,
      { id: (requirements.length + 1).toString(), text: '' }
    ]);
  };

  const updateRequirement = (id: string, text: string) => {
    setRequirements(requirements.map(req =>
      req.id === id ? { ...req, text } : req
    ));
  };

  const analyzeDocument = async () => {
    try {
      setAnalyzing(true);
      const response = await fetch('/dashboard/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          document_text: documentText,
          requirements: requirements.filter(r => r.text.trim() !== '')
        }),
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const data = await response.json();
      setResults(data.matches);
      
      toast({
        title: "Analysis Complete",
        description: "Document has been analyzed against all requirements.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to analyze document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8 py-6">
      <Card>
        <CardHeader>
          <CardTitle>Document Analysis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Document Text
            </label>
            <Textarea
              placeholder="Paste your document text here..."
              value={documentText}
              onChange={(e) => setDocumentText(e.target.value)}
              className="min-h-[200px]"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium">
                Requirements
              </label>
              <Button
                variant="outline"
                size="sm"
                onClick={addRequirement}
              >
                Add Requirement
              </Button>
            </div>
            
            {requirements.map((req) => (
              <Input
                key={req.id}
                placeholder={`Requirement ${req.id}`}
                value={req.text}
                onChange={(e) => updateRequirement(req.id, e.target.value)}
              />
            ))}
          </div>

          <Button
            onClick={analyzeDocument}
            disabled={analyzing || !documentText.trim() || !requirements.some(r => r.text.trim())}
          >
            {analyzing ? "Analyzing..." : "Analyze Document"}
          </Button>
        </CardContent>
      </Card>

      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Analysis Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {results.map((result) => (
              <div key={result.requirement_id} className="space-y-4">
                <h3 className="font-medium">
                  Requirement: {result.requirement_text}
                </h3>
                
                {result.matches.map((match, idx) => (
                  <Card key={idx}>
                    <CardContent className="pt-6">
                      <div className="space-y-2">
                        <div>
                          <span className="font-medium">Matched Text:</span>
                          <p className="mt-1">{match.segment_text}</p>
                        </div>
                        <div>
                          <span className="font-medium">Confidence Score:</span>
                          <p className="mt-1">{(match.confidence_score * 100).toFixed(1)}%</p>
                        </div>
                        <div>
                          <span className="font-medium">GPT-4 Analysis:</span>
                          <p className="mt-1">{match.gpt4_explanation}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
