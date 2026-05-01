import { Container, Graphics, Rectangle } from 'pixi.js'
import { Animal } from '../entities/Animal'
import { Hero } from '../entities/Hero'
import { Yard } from '../entities/Yard'
import { ClicksView } from '../ui/ClicksView'
import { GameOverlay } from '../ui/GameOverlay'
import { PauseButton } from '../ui/PauseButton'
import { RestartButton } from '../ui/RestartButton'
import { RulesButton } from '../ui/RulesButton'
import { RulesOverlay } from '../ui/RulesOverlay'
import { ScoreView } from '../ui/ScoreView'
import { TimerView } from '../ui/TimerView'
import { distanceBetween, randomInt, randomRange } from '../utils/math'
import { GAME_CONFIG } from './GameConfig'
import type { FederatedPointerEvent, PointData } from 'pixi.js'

type GameState = 'countdown' | 'playing' | 'paused' | 'completed'

export class GameScene {
	public readonly container: Container

	private readonly hero: Hero
	private readonly yard: Yard
	private readonly animals: Animal[]
	private readonly animalLayer: Container
	private readonly followers: Animal[]
	private readonly scoreView: ScoreView
	private readonly clicksView: ClicksView
	private readonly timerView: TimerView
	private readonly restartButton: RestartButton
	private readonly pauseButton: PauseButton
	private readonly rulesButton: RulesButton
	private readonly rulesOverlay: RulesOverlay
	private readonly overlay: GameOverlay
	private readonly targetMarker: Graphics
	private score: number
	private clicks: number
	private elapsedSeconds: number
	private countdownRemaining: number
	private gameState: GameState

	public constructor() {
		this.container = new Container()
		this.hero = new Hero()
		this.yard = new Yard()
		this.animals = []
		this.animalLayer = new Container()
		this.followers = []
		this.scoreView = new ScoreView()
		this.clicksView = new ClicksView()
		this.timerView = new TimerView()
		this.restartButton = new RestartButton(() => {
			this.startNewGame()
		})
		this.pauseButton = new PauseButton(() => {
			this.togglePause()
		})
		this.rulesButton = new RulesButton(() => {
			this.openRules()
		})
		this.rulesOverlay = new RulesOverlay(() => {
			this.closeRules()
		})
		this.overlay = new GameOverlay(() => {
			this.startNewGame()
		})
		this.targetMarker = this.createTargetMarker()
		this.score = 0
		this.clicks = 0
		this.elapsedSeconds = 0
		this.countdownRemaining = GAME_CONFIG.countdownSeconds
		this.gameState = 'countdown'

		this.createField()
		this.createYard()
		this.createHero()
		this.container.addChild(this.animalLayer)
		this.createUi()
		this.container.addChild(this.targetMarker)
		this.container.addChild(this.overlay.view)
		this.container.addChild(this.rulesOverlay.view)
		this.startNewGame()
	}

	public update(deltaSeconds: number): void {
		if (this.gameState === 'countdown') {
			this.updateCountdown(deltaSeconds)
			return
		}

		if (this.gameState !== 'playing') {
			return
		}

		this.elapsedSeconds += deltaSeconds
		this.timerView.setTime(this.elapsedSeconds)
		this.hero.update(deltaSeconds)
		this.collectNearbyAnimals()
		this.updateFollowers(deltaSeconds)
		this.deliverAnimals()
		this.completeGameIfNeeded()
	}

	private createField(): void {
		const field = new Graphics()
			.rect(0, 0, GAME_CONFIG.width, GAME_CONFIG.uiHeight)
			.fill(0x1f2937)
			.rect(
				0,
				GAME_CONFIG.uiHeight,
				GAME_CONFIG.width,
				GAME_CONFIG.height - GAME_CONFIG.uiHeight
			)
			.fill(GAME_CONFIG.fieldColor)
			.stroke({
				color: GAME_CONFIG.fieldBorderColor,
				width: 4
			})

		field.eventMode = 'static'
		field.cursor = 'crosshair'
		field.hitArea = new Rectangle(
			0,
			GAME_CONFIG.uiHeight,
			GAME_CONFIG.width,
			GAME_CONFIG.height - GAME_CONFIG.uiHeight
		)
		field.on('pointerdown', (event) => {
			this.handleFieldClick(event)
		})

		this.container.addChild(field)
	}

	private createYard(): void {
		this.yard.setPosition({
			x: GAME_CONFIG.yard.x,
			y: GAME_CONFIG.yard.y
		})

		this.container.addChild(this.yard.view)
	}

	private createHero(): void {
		this.hero.reset(GAME_CONFIG.hero.startPosition)
		this.container.addChild(this.hero.view)
	}

	private createAnimals(): void {
		const count = randomInt(
			GAME_CONFIG.animal.spawnCountMin,
			GAME_CONFIG.animal.spawnCountMax
		)

		for (let index = 0; index < count; index += 1) {
			const animal = new Animal()
			animal.setPosition(this.getRandomAnimalPosition())

			this.animals.push(animal)
			this.animalLayer.addChild(animal.view)
		}
	}

	private createUi(): void {
		this.scoreView.setScore(0)
		this.clicksView.setClicks(0)
		this.timerView.setTime(0)
		this.container.addChild(
			this.scoreView.view,
			this.restartButton.view,
			this.pauseButton.view,
			this.rulesButton.view,
			this.clicksView.view,
			this.timerView.view
		)
	}

	private handleFieldClick(event: FederatedPointerEvent): void {
		if (this.gameState !== 'playing') {
			return
		}

		const position = event.getLocalPosition(this.container)

		this.clicks += 1
		this.clicksView.setClicks(this.clicks)
		this.hero.setTarget({
			x: position.x,
			y: position.y
		})
		this.showTargetMarker(position)
	}

	private collectNearbyAnimals(): void {
		if (this.followers.length >= GAME_CONFIG.animal.maxGroupSize) {
			return
		}

		for (const animal of this.animals) {
			const hasGroupSpace =
				this.followers.length < GAME_CONFIG.animal.maxGroupSize

			if (!hasGroupSpace) {
				return
			}

			if (animal.state !== 'idle') {
				continue
			}

			const distanceToHero = distanceBetween(
				this.hero.position,
				animal.position
			)

			if (distanceToHero > GAME_CONFIG.animal.collectDistance) {
				continue
			}

			animal.startFollowing()
			this.followers.push(animal)
		}
	}

	private updateFollowers(deltaSeconds: number): void {
		for (const [index, animal] of this.followers.entries()) {
			const target =
				index === 0 ? this.hero.position : this.followers[index - 1].position

			animal.follow(target, deltaSeconds)
		}
	}

	private deliverAnimals(): void {
		for (const animal of [...this.followers]) {
			if (!this.yard.contains(animal.position)) {
				continue
			}

			animal.markDelivered()
			this.removeAnimal(animal)
			this.score += 1
			this.scoreView.setScore(this.score)
		}
	}

	private startNewGame(): void {
		this.clearAnimals()
		this.followers.length = 0
		this.score = 0
		this.clicks = 0
		this.elapsedSeconds = 0
		this.countdownRemaining = GAME_CONFIG.countdownSeconds
		this.gameState = 'countdown'

		this.hero.reset(GAME_CONFIG.hero.startPosition)
		this.scoreView.setScore(this.score)
		this.clicksView.setClicks(this.clicks)
		this.timerView.setTime(this.elapsedSeconds)
		this.restartButton.setEnabled(true)
		this.pauseButton.setPaused(false)
		this.pauseButton.setEnabled(false)
		this.targetMarker.visible = false
		this.createAnimals()
		this.overlay.showCountdown(this.countdownRemaining)
	}

	private updateCountdown(deltaSeconds: number): void {
		this.countdownRemaining -= deltaSeconds

		if (this.countdownRemaining <= 0) {
			this.gameState = 'playing'
			this.pauseButton.setEnabled(true)
			this.overlay.hide()
			return
		}

		this.overlay.showCountdown(this.countdownRemaining)
	}

	private completeGameIfNeeded(): void {
		if (this.animals.length > 0) {
			return
		}

		this.gameState = 'completed'
		this.restartButton.setEnabled(true)
		this.pauseButton.setPaused(false)
		this.pauseButton.setEnabled(false)
		this.targetMarker.visible = false
		this.overlay.showWin(this.score, this.elapsedSeconds, this.clicks)
	}

	private togglePause(): void {
		if (this.gameState === 'playing') {
			this.gameState = 'paused'
			this.restartButton.setEnabled(false)
			this.pauseButton.setPaused(true)
			return
		}

		if (this.gameState === 'paused') {
			this.gameState = 'playing'
			this.restartButton.setEnabled(true)
			this.pauseButton.setPaused(false)
		}
	}

	private stateBeforeRules: GameState | null = null

	private openRules(): void {
		this.rulesOverlay.show()

		if (this.gameState === 'playing' || this.gameState === 'countdown') {
			this.stateBeforeRules = this.gameState
			this.gameState = 'paused'
			this.pauseButton.setPaused(true)
			this.restartButton.setEnabled(false)
		} else {
			this.stateBeforeRules = this.gameState
		}
	}

	private closeRules(): void {
		this.rulesOverlay.hide()
		
		if (this.stateBeforeRules !== null) {
			this.gameState = this.stateBeforeRules
			if (this.stateBeforeRules === 'playing') {
				this.pauseButton.setPaused(false)
				this.restartButton.setEnabled(true)
			} else if (this.stateBeforeRules === 'countdown') {
				this.pauseButton.setPaused(false)
			}
		}
		this.stateBeforeRules = null
	}

	private createTargetMarker(): Graphics {
		const marker = new Graphics()
			.circle(0, 0, 13)
			.stroke({
				color: 0xffffff,
				width: 2
			})
			.circle(0, 0, 4)
			.fill(0xffffff)
		marker.visible = false

		return marker
	}

	private showTargetMarker(position: PointData): void {
		this.targetMarker.position.set(position.x, position.y)
		this.targetMarker.visible = true
	}

	private clearAnimals(): void {
		for (const animal of this.animals) {
			animal.view.removeFromParent()
		}

		this.animals.length = 0
		this.animalLayer.removeChildren()
	}

	private removeAnimal(animal: Animal): void {
		this.removeFromList(this.animals, animal)
		this.removeFromList(this.followers, animal)
		animal.view.removeFromParent()
	}

	private removeFromList(list: Animal[], animal: Animal): void {
		const index = list.indexOf(animal)

		if (index >= 0) {
			list.splice(index, 1)
		}
	}

	private getRandomAnimalPosition(): PointData {
		const padding = 70

		for (let attempt = 0; attempt < 30; attempt += 1) {
			const position = {
				x: randomRange(padding, GAME_CONFIG.width - padding),
				y: randomRange(
					GAME_CONFIG.uiHeight + padding,
					GAME_CONFIG.height - padding
				)
			}

			if (this.isSafeAnimalPosition(position)) {
				return position
			}
		}

		return {
			x: randomRange(padding, GAME_CONFIG.width - padding),
			y: randomRange(
				GAME_CONFIG.uiHeight + padding,
				GAME_CONFIG.height - padding
			)
		}
	}

	private isSafeAnimalPosition(position: PointData): boolean {
		const isInsideYard = this.yard.contains(position)
		const isTooCloseToHero = distanceBetween(position, this.hero.position) < 100

		return !isInsideYard && !isTooCloseToHero
	}
}
