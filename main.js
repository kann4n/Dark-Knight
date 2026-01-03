
const BackgrndCanvas = document.getElementById('background-canvas');
const Bgrndnctx = BackgrndCanvas.getContext('2d');

Bgrndnctx.translate(-100, -100);
// Instantiate the class to run the code
const treeScene = new TreeScene('background-canvas');
treeScene.init();

/** @type {HTMLCanvasElement} */
const FightCanvas = document.getElementById('fight-canvas');
/** @type {CanvasRenderingContext2D} */
const Fightctx = FightCanvas.getContext('2d');
FightCanvas.width = window.innerWidth;
FightCanvas.height = window.innerHeight/2;

const player = new Player(FightCanvas.width / 2, FightCanvas.height / 2);

function animate() {
    Fightctx.clearRect(0, 0, FightCanvas.width, FightCanvas.height);
    player.draw(Fightctx);
    player.update();
    requestAnimationFrame(animate);
}

animate();