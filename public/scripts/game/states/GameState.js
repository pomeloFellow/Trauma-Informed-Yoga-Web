import State from "../../core/State/State.js";
import Skeleton from "../skeleton/Skeleton.js";
import BackButton from "../buttons/BackButton.js";
import MenuButton from "../buttons/MenuButton.js";
import Target from "../form/Target.js";
import Narrator from "../narrator/Narrator.js";
import Diaphragm from "../breathing/Diaphragm.js";
import Silhouette from "../souvenir/Silhouette.js";
// import Silhouette from "../souvenir/PoseTrail.js";
import SmokeTrails from "../souvenir/SmokeTrails.js";

/** Example of Gamestate
 *
 *  1. Renders a background
 *  2. Takes poseLandmarks and renders a skeleton
 *  3. Loads relevant game items (charge pack, etc.)
 *  4. Goes through 4 poses
 *  5. Transition to game over
 *
 * Alt: Game over on empty charge pack for 5 seconds
 */

export default class GameState extends State {
	backButton = {};
	menuButton = {};
	testTarget = {};
	testTarget1 = {};
	narrator = {};
	diaphragm = {};
	silhouette = {};
	smoke = {}; 
	// why are fields instantiated with anonymous classes?
	
	constructor() {
		super("Game");
	}

	// TODO load style from some configuration
	// TODO allow the user to edit it in game

	setup() {
		super.setup();

		//Make sure skeleton is already loaded, load if not
		if(!this.gameSession.skeletonLoaded){
			this.gameSession.skeleton = new Skeleton();
			this.gameSession.skeletonLoaded = true;
		}

		this.diaphragm = new Diaphragm( this.gameSession.skeleton );
		this.silhouette = new Silhouette( {
			// thickness: undefined,
			empty: [50,50,50],
			full: [250, 250, 250]
		});
		this.smoke = new SmokeTrails([
			{index:0, small:16, large:32, fuzz:4, empty:[25,150,25,5], full:[100,100,100,1]},
			{index:20, small:16, large:32, fuzz:4, empty:[150,0,25,5], full:[100,100,100,1]},
			{index:19, small:16, large:32, fuzz:4, empty:[25,0,150,5], full:[100,100,100,1]}
		]);

		//Instantiate backbutton
		let backButtonLayout = {
			x: this.gameSession.canvasWidth * .05,
			y: this.gameSession.canvasHeight * .05,
			width: this.gameSession.canvasWidth * .05,
			height: this.gameSession.canvasWidth * .05
		}

		let backButtonStyle = {
			stroke: this.p5.color(255, 255, 255),
			strokeWeight: 5,
			fill: this.p5.color(0, 0, 0),
			hoverFill: this.p5.color(123, 123, 123),
			pressedFill: this.p5.color(255, 255, 255),
			loadingFill: this.p5.color(62, 62, 62),
			disabledFill: this.p5.color(125, 0, 0),
		}

		this.backButton = new BackButton(backButtonLayout, backButtonStyle, false, "Loading");
		this.backButton.setup();

		//Instantiate menubutton
		let menuButtonLayout = {
			x: this.gameSession.canvasWidth * .9,
			y: this.gameSession.canvasHeight * .9,
			width: this.gameSession.canvasWidth * .05,
			height: this.gameSession.canvasWidth * .05
		}

		let menuButtonStyle = {
			stroke: this.p5.color(255, 255, 255),
			strokeWeight: 5,
			fill: this.p5.color(0, 0, 0),
			hoverFill: this.p5.color(123, 123, 123),
			pressedFill: this.p5.color(255, 255, 255),
			loadingFill: this.p5.color(62, 62, 62),
			disabledFill: this.p5.color(125, 0, 0),
		}

		this.menuButton = new MenuButton(menuButtonLayout, menuButtonStyle, false, "Menu");
		this.menuButton.setup();

		//TODO: Test target out
		let testBone = this.gameSession.skeleton.getBone("Left Innerpalm");
		//find target item
		this.testTarget = new Target(300, -300, 50, testBone, 10000, false, this.gameSession.skeleton);
		
		//TODO: Test target out
		let testBone1 = this.gameSession.skeleton.getBone("Right Innerpalm");
		//find target item
		this.testTarget1 = new Target(-300, -300, 50, testBone1, 10000, false, this.gameSession.skeleton);
	
		//TODO: Test background waves out
		this.gameSession.soundManager.waveSound.startLoop();

		this.narrator = new Narrator();
		this.narrator.setup();
	}

	render() {
		super.render();

		this.silhouette.render();
		// this.diaphragm.render();
		this.smoke.render();
		
		//Render skeleton
		// this.gameSession.skeleton.render();
		// TODO I'm rendering the filter instead! Should the Skeleton be updated to also use the Filter?

		//Test target
		this.testTarget.render();
		this.testTarget1.render();

		//UI
		this.backButton.render();
		this.menuButton.render();

		//TODO: Make generic and add logic to exist across multiple states... singleton.
		//Test Narrator
		this.narrator.render();

	}

	resize() {
		super.resize();
		//TODO: I'm almost sure there's a better way for us to structure resize
		
		this.backButton.resize(
			this.gameSession.canvasWidth * .05,
			this.gameSession.canvasHeight * .05,
			this.gameSession.canvasWidth * .05,
			this.gameSession.canvasWidth * .05
		);

		this.menuButton.resize(
			this.gameSession.canvasWidth * .9,
			this.gameSession.canvasHeight * .05,
			this.gameSession.canvasWidth * .05,
			this.gameSession.canvasWidth * .05
		);

		this.narrator.resize();
	}

	update() {
		super.update();

		//this.diaphragm.update(); // unnecessary but here for consistency or if something changes...

		//Update skeleton
		this.gameSession.skeleton.update();

		// Update breathing
		this.gameSession.breathingManager.update();

		//Test Target
		this.testTarget.update();
		this.testTarget1.update();

		//UI
		this.backButton.update();
		this.menuButton.update();

		this.narrator.update();
	}

	mousePressed(){
		this.backButton.checkPressed();
		this.menuButton.checkPressed();
	}

	mouseReleased(){
		this.backButton.checkReleased();
		this.menuButton.checkReleased();
	}
	
	keyPressed() {
		console.log(this.p5.key);
	}

	cleanup() {
		super.update();
	}

	get gameBackground() {
		return this.__gameBackground;
	}

}
