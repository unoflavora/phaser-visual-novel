import GameScore from "Definitions/GameScore";

export default class EmotionalUnderstandingScoring {
   
    //#region variables
    total_emotion_quest:number = 8.0;
    total_respond_quest:number = 8.0;
    total_quest_type:number = 2.0;
    percentage:number = 100.0;
    //#endregion

    // #region data
    score_for_emotion:number;
    readonly max_score_for_emotion:number;

    score_for_respond:number;
    readonly max_score_for_respond:number;

    // #endregion

    // region Results
    score_accuracy:number = 0.0;
    score_performance:number = 0.0;

    // #endregion

    constructor()
    {
        this.score_for_emotion = 0;
        this.max_score_for_emotion = this.total_emotion_quest * this.percentage;

        this.score_for_respond = 0;
        this.max_score_for_respond = this.total_respond_quest * this.percentage;
    }

    private TotalAverageFractionForAccuracy():number
    {
        return this.percentage / ( ( ( this.max_score_for_emotion / this.total_emotion_quest ) + ( this.max_score_for_respond / this.total_respond_quest ) / this.total_quest_type ) );
    }


    private TotalAverageFractionForPerformance():number
    {
        return this.percentage / ( this.max_score_for_emotion / this.total_emotion_quest );
    }


    private AccuracyPercentage():number
    {
        return ( ( ( this.score_for_emotion / this.total_emotion_quest ) + ( this.score_for_respond / this.total_respond_quest ) / this.total_quest_type ) * this.TotalAverageFractionForAccuracy() );
    }


    private PerformancePercentage():number
    {
        return ( ( this.score_for_emotion / this.total_emotion_quest ) * this.TotalAverageFractionForPerformance() );
    }

    
    public CalculateScore() : GameScore
    {
        (this.score_for_emotion >= 800.0) ? this.score_for_emotion = 800.0 : this.score_for_emotion = this.score_for_emotion;
        (this.score_for_respond >= 800.0)  ? this.score_for_respond  = 800.0 : this.score_for_respond  = this.score_for_respond;

        this.score_accuracy = this.AccuracyPercentage();
        this.score_performance = this.PerformancePercentage();

        console.log(`score_accuracy   : ${this.score_accuracy}%`);
        console.log(`score_performance: ${this.score_performance}%`);

        return {
            accuracy: this.score_accuracy,
            performance: this.score_performance
        }
    }
}

export interface EmotionalUnderstandingScoreInitData
{
    total_emotion_quest : number,
    total_respond_quest : number,
    percentage : number,
}







//#endregion

