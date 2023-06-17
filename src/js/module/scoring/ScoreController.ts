import EmotionalUnderstandingScoring, { EmotionalUnderstandingScoreInitData } from "./EmotionalUnderstandingScoreController";
import IMinigameScore from "Definitions/GameScore";
import { MinigameTypes } from "Definitions/Minigame";
import { IEmotionalUnderstandingScore, IGameData } from "Definitions/Settings";

export default class ScoreController
{
    private _emotionalUnderstandingScoring: EmotionalUnderstandingScoring;
    private _scores: { [key in MinigameTypes] : IMinigameScore};

    public get scores() { return this._scores};

    constructor()
    {
        this._emotionalUnderstandingScoring = new EmotionalUnderstandingScoring()

        this._scores = {
            [MinigameTypes.GuessTheWord] : {
                performance : 0,
                accuracy: 0
            },
            [MinigameTypes.MemoryOfSpades]: {
                performance: 0,
                accuracy: 0,
            },
            [MinigameTypes.PuzzleBlock]: {
                performance: 0,
                accuracy: 0,
            },
            [MinigameTypes.EmotionalUnderstanding]: {
                performance: 0,
                accuracy: 0
            }
        };
    }

    public Init(previousScore : typeof this._scores, previousEmotionalUnderstandingProgress: IEmotionalUnderstandingScore)
    {
        this._scores = previousScore;
        this.addEmotionalScore(previousEmotionalUnderstandingProgress.emotion)
        this.addRespondScore(previousEmotionalUnderstandingProgress.response)

        return this._scores;
    }

    public addEmotionalScore(emotionScore: number) : number
    {
        console.log("Added Emotional Score: " + emotionScore);

        this._emotionalUnderstandingScoring.score_for_emotion += emotionScore;

        return this._emotionalUnderstandingScoring.score_for_emotion;
    }

    public addRespondScore(respondScore : number) : number
    {
        console.log("Added Respond Score: " + respondScore);

        this._emotionalUnderstandingScoring.score_for_respond += respondScore;

        return this._emotionalUnderstandingScoring.score_for_respond;
    }

    public addMinigameScore(minigameType : MinigameTypes, minigameScore: IMinigameScore)
    {
        if(minigameType == MinigameTypes.EmotionalUnderstanding)
        {
            throw new Error("You cannot add scores from EU directly, it's should be added through addRespondScore and addEmotionScore Instead")
        }

        console.log("Added Minigame Score: " + minigameScore.performance + " for " + minigameType)

        this._scores[minigameType] = minigameScore;

        return this._scores;
    }

    public getFinalScore()
    {
        this._scores[MinigameTypes.EmotionalUnderstanding] = this._emotionalUnderstandingScoring.CalculateScore();

        return this._scores;
    }
}