import { Container, Graphics, Rectangle, Text } from 'pixi.js'
import { GAME_CONFIG } from '../game/GameConfig'
import type { FederatedPointerEvent } from 'pixi.js'

export class RulesButton {
	public readonly view: Container

	public constructor(onOpen: () => void) {
		this.view = new Container()
		this.view.position.set(GAME_CONFIG.width - 660, 10)
		this.view.eventMode = 'static'
		this.view.cursor = 'pointer'
		this.view.hitArea = new Rectangle(0, 0, 112, 36)
		this.view.on('pointerdown', (event: FederatedPointerEvent) => {
			event.stopPropagation()
			onOpen()
		})

		const background = new Graphics().roundRect(0, 0, 112, 36, 8).fill(0xfacc15)
		const label = new Text({
			text: 'Rules',
			style: {
				fill: 0x172554,
				fontFamily: 'Arial',
				fontSize: 17,
				fontWeight: '700'
			}
		})
		label.anchor.set(0.5)
		label.position.set(56, 18)

		this.view.addChild(background, label)
	}
}
