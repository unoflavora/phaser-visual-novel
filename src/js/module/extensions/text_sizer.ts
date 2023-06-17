type Parent = {displayWidth: number, displayHeight: number, x: number, y: number}

declare global {
    namespace Phaser.GameObjects {
        interface Text {
            handleTextSize(parentBox: Parent, initialSize: number, marginHeight?: number): void;
        }
    }
}

Phaser.GameObjects.Text.prototype.handleTextSize = function(this: Phaser.GameObjects.Text, parentBox: Parent, initialSize: number, marginHeight : number = 0)
{
    var initialFontSize = initialSize;
    
    this.setFontSize(initialFontSize);

    // Check if the text overflows the parent box
    while (this.displayWidth > parentBox.displayWidth || this.displayHeight > parentBox.displayHeight - marginHeight) {
    // Reduce the font size
    initialFontSize -= 1;

    // Update the font size of the Text object
    this.setFontSize(initialFontSize);
    }

    // Center the Text object within the parent box
    this.setPosition(parentBox.x, parentBox.y);
}

export {}