interface PostInteraction {
    leftCharacter?: string;
    rightCharacter?: string;
    dialogue: string;
}
  
interface ResponseOption {
    option: string;
    context: string;
    response: string | null;
    postInteraction: PostInteraction | PostInteraction[];
    questAdded?: string;
}

interface QuestRespond {
    options: ResponseOption[];
}
  
export interface StoryScene {
    id: number;
    story: string;
    required: string;
    leftCharacter: string | null;
    rightCharacter: string | null;
    questRespond: QuestRespond | null;
    questAccuracy: string[];
}
  
type Story = StoryScene[];

export default Story;