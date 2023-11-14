interface CharacterDisplay {
  name: string;
  position: number;
}

interface ResponseContext extends CharacterDisplay {
  text: string[];
}

interface StoryResponse {
  index: number;
  text: string;
  score: number;
  info: string;
  bullet_list: string[];
}

interface Scene {
  scene: number;
  has_quest: boolean;
  tutorialId: string | null;
  tutorialEn: string | null;
  audio: string;
  background: string;
  intro_en: { text: string; displayCharacter?: boolean }[];
  intro_id: { text: string; displayCharacter?: boolean }[];
  intro_character: CharacterDisplay[];
  emotions_en: StoryResponse[];
  emotions_id: StoryResponse[];
  response_en: StoryResponse[];
  response_id: StoryResponse[];
  response_en_contexts: ResponseContext[][];
  response_id_contexts: ResponseContext[][];
}
