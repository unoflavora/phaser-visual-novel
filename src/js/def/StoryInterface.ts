

  interface CharacterDisplay {
    name: string;
    position: number;
  }
  
  interface ResponseContext extends CharacterDisplay {
    text: string[];
  }
  
  interface Response {
    index: number;
    text: string;
    score: number;
  }
  
  interface Scene {
    scene: number;
    has_quest: boolean;
    tutorialId: string | null;
    tutorialEn: string | null;
    audio: string;
    background: string;
    intro_en: string[];
    intro_id: string[];
    intro_character: CharacterDisplay[];
    emotions_en: Response[];
    emotions_id: Response[];
    response_en: Response[];
    response_id: Response[];
    response_en_contexts: ResponseContext[][];
    response_id_contexts: ResponseContext[][];
  }  