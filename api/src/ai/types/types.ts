export namespace AI {
  export interface QuestionResponse {
    answer: string;
    citations: Citation[];
  }

  export interface Citation {
    source: string;
    chunk: string;
    timestamp: string;
    speaker: string;
    confidence: number;
  }

  export interface TitleResponse {
    title: string;
  }
}

export namespace VectorStore {
  export interface Config {
    collectionName: string;
    vectorSize: number;
    distance: 'Cosine' | 'Euclid' | 'Dot';
  }

  export interface CollectionConfig {
    vectors: {
      size: number;
      distance: 'Cosine' | 'Euclid' | 'Dot';
    };
  }

  export interface Point {
    id: string;
    vector: number[];
    content: string;
    metadata: {
      timestamp?: string;
      speaker?: string;
    };
  }

  export interface SearchResult {
    id: string;
    score: number;
    content: string;
    metadata: {
      transcript_id: string;
      timestamp?: string;
      speaker?: string;
    };
  }
} 