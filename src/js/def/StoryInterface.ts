export interface CharacterDisplay {
    leftCharacter?: string;
    rightCharacter?: string;
}

export interface DialogueResponse extends CharacterDisplay {
    dialogue: string;
    monologue: never;
}

export interface MonologueResponse extends CharacterDisplay {
  dialogue: never;
  monologue: string;
}

export interface Option {
    option: string;
    context: string;
    response: (DialogueResponse | MonologueResponse)[];
    questAdded?: string;
}

export interface QuestRespond {
    options: Option[];
}

export interface StoryElement {
    id: number;
    story: string;
    required?: CharacterDisplay;
    questRespond?: QuestRespond;
    questAccuracy: string[];
}

export type Story = StoryElement[];
