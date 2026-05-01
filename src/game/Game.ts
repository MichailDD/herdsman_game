import { Application } from 'pixi.js'
import type { Ticker } from 'pixi.js'
import { GAME_CONFIG } from './GameConfig'
import { GameScene } from './GameScene'

export class Game {
	private readonly root: HTMLElement
	private readonly app: Application
	private scene: GameScene | null
	private readonly resizeObserver: ResizeObserver

	public constructor(root: HTMLElement) {
		this.root = root
		this.app = new Application()
		this.scene = null
		this.resizeObserver = new ResizeObserver(() => {
			this.resize()
		})
	}

	public async start(): Promise<void> {
		await this.app.init({
			width: GAME_CONFIG.width,
			height: GAME_CONFIG.height,
			backgroundColor: GAME_CONFIG.backgroundColor,
			antialias: true,
			resolution: window.devicePixelRatio || 1,
			autoDensity: true
		})

		this.scene = new GameScene()
		this.app.stage.addChild(this.scene.container)
		this.app.ticker.add((ticker: Ticker) => {
			this.scene?.update(ticker.deltaMS / 1000)
		})

		this.root.appendChild(this.app.canvas)

		this.resizeObserver.observe(this.root)
		this.resize()
	}

	public destroy(): void {
		this.resizeObserver.disconnect()
		this.app.destroy()
	}

	private resize(): void {
		const availW = this.root.clientWidth
		const availH = this.root.clientHeight

		const scale = Math.min(
			1,
			availW / GAME_CONFIG.width,
			availH / GAME_CONFIG.height
		)

		const cssW = Math.floor(GAME_CONFIG.width * scale)
		const cssH = Math.floor(GAME_CONFIG.height * scale)

		this.app.canvas.style.width = `${cssW}px`
		this.app.canvas.style.height = `${cssH}px`
	}
}
