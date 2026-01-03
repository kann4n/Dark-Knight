class Controls {
    constructor() {
        this.moveleft = false;
        this.moveright = false;
        this.jump = false;
        this.attack = false;
        this.heal = false;

        this.#addKeyboardListeners();
    }

    #addKeyboardListeners() {
        const setKeyState = (code, isPressed) => {
            switch (code) {
                case "KeyA":
                case "ArrowLeft":
                    this.moveleft = isPressed;
                    break;
                case "KeyD":
                case "ArrowRight":
                    this.moveright = isPressed;
                    break;
                case "Space":
                case "KeyW":
                case "ArrowUp":
                    this.jump = isPressed;
                    break;
                case "KeyJ":
                case "KeyZ":
                case "Enter":
                    this.attack = isPressed;
                    break;
                case "KeyH":
                case "KeyX":
                case "KeyE":
                    this.heal = isPressed;
                    break;
            }
        };

        document.addEventListener("keydown", (e) => {
            // Added "Enter" to this list so it doesn't click buttons on the page
            if(["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Enter"].includes(e.code)) {
                e.preventDefault(); 
            }
            
            // Log moved OUTSIDE so you can see every key press
            // console.log("Pressed:", e.code); 

            setKeyState(e.code, true);
        });

        document.addEventListener("keyup", (e) => {
            setKeyState(e.code, false);
        });
    }
}