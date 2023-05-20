import MainSceneController from "./MainSceneController";
import PopupController, { PopupType } from "./popup/PopupController";

export default class Main
{
    static inst : Main;
    static get instance()
    {
        if (!Main.inst) throw Error('Main is not initialized');

        return Main.inst;
    };

    private popupController: PopupController;

    scene : MainSceneController;

    constructor(scene : MainSceneController) 
    {
        Main.inst = this;

        this.scene = scene;

        this.popupController = new PopupController(scene);
    }

    
    public OpenPopup()
    {
        this.scene.scene.bringToTop();

        this.HideAllDOMElements();

        this.popupController.OpenPopup(PopupType.Settings);

        this.popupController.RegisterOnClosePopup(() => this.ClosePopup());
    }

    private ClosePopup()
    {
        console.log("Closing Popup")

        this.HideAllDOMElements(false)

        this.scene.scene.sendToBack();

    }


    private HideAllDOMElements(hide : boolean = true) {
        var domElements = document.getElementsByClassName("phaser-dom-elements");

        for (var i = 0; i < domElements.length; i++) {
            var element = domElements[i] as HTMLElement;

            if(hide) element.classList.add("hidden");
            
            else element.classList.remove("hidden");
        }
    }


}